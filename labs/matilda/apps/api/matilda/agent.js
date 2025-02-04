require('dotenv').config();
const { routeQuestion } = require('./select_collection');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { AgentExecutor } = require("langchain/agents");
const { OpenAIFunctionsAgentOutputParser } = require("langchain/agents/openai/output_parser");
const { formatToOpenAIFunctionMessages } = require("langchain/agents/format_scratchpad");
const { DynamicTool } = require("@langchain/core/tools");
const { RunnableSequence } = require("@langchain/core/runnables");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { MessagesPlaceholder, ChatPromptTemplate } = require("@langchain/core/prompts");
const { convertToOpenAIFunction } = require("@langchain/core/utils/function_calling");
const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { AzureCosmosDBVectorStore } = require("@langchain/community/vectorstores/azure_cosmosdb");
const { PromptTemplate } = require("@langchain/core/prompts")

var dbname = process.env.MONGODB_Name;

class MatildaTeamAssistant {
    constructor() {
        
        // set up the MongoDB client
        this.dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
        // set up the Azure Cosmos DB vector store
        // const azureCosmosDBConfig = {
        //     client: this.dbClient,
        //     databaseName: process.env.MONGODB_NAME,
        //     collectionName: collectionName,
        //     indexName: "VectorSearchIndex",
        //     embeddingKey: "contentVector",
        //     textKey: "_id"
        // }
        // this.vectorStore = new AzureCosmosDBVectorStore(new OpenAIEmbeddings(), azureCosmosDBConfig);

        // set up the OpenAI chat model
        // https://js.langchain.com/docs/integrations/chat/azure
        this.chatModel = new ChatOpenAI({
            temperature: 0,
            azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
            azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
            azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
            azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
            verbose: true,
        });

        // initialize the chat history
        this.chatHistory = [];

        // initialize the agent executor
        (async () => {
            this.agentExecutor = await this.buildAgentExecutor();
        })();
    }

    async formatDocuments(docs) {
        // Prepares the product list for the system prompt.  
        let strDocs = "";
        for (let index = 0; index < docs.length; index++) {
            let doc = docs[index];
            let docFormatted = { "_id": doc.pageContent };
            Object.assign(docFormatted, doc.metadata);

            // Build the product document without the contentVector and tags
            if ("contentVector" in docFormatted) {
                delete docFormatted["contentVector"];
            }
            if ("tags" in docFormatted) {
                delete docFormatted["tags"];
            }

            // Add the formatted product document to the list
            strDocs += JSON.stringify(docFormatted, null, '\t');

            // Add a comma and newline after each item except the last
            if (index < docs.length - 1) {
                strDocs += ",\n";
            }
        }
        // Add two newlines after the last item
        strDocs += "\n\n";
        return strDocs;
    }

    async buildAgentExecutor() {

        const question = "My POS system screen is froze, what do i do now ?";
        const collectionName = await routeQuestion(question);
        console.log('Collection for the question:', collectionName);

        const azureCosmosDBConfig = {
            client: this.dbClient,
            databaseName: dbname,
            collectionName: collectionName,
            indexName: "VectorSearchIndex",
            embeddingKey: "contentVector",
            textKey: "_id"
        };
        this.vectorStore = new AzureCosmosDBVectorStore(new OpenAIEmbeddings(), azureCosmosDBConfig);
        // A system prompt describes the responsibilities, instructions, and persona of the AI.
        // Note the variable placeholders for the list of products and the incoming question are not included.
        // An agent system prompt contains only the persona and instructions for the AI.
        const systemMessage = `
        You are a helpful, fun and friendly assistant for kmart retail stores.
    
        Your name is Matilda.

        You are designed to answer questions about the POS system documentation,product information including price, stock, and aisle location, store transactions including purchases and sales, mandatory training sessions for employees,store processes and steps to follow for tasks.

        I have 5 collections basically , i'll describe those collections below and what kind of data they hold

        1. documents - collection describes the user manual of working with a POS system
        2. products - collection contains infromation about these fields [Store_Id,Store_name,Product ID,Product Name,Department,Category,Price,Stock Availability,Aisle Location,Store-Specific Notes
        ]
        3. transactions - collection contining information about store transactions , consiting of fields as [Store_Id,Store_name,Product ID,Product Name,Department,Category,Price,Stock Availability,Aisle Location,Store-Specific Notes
        ]
        4.  training_topics - collection containing information about mandatory training information employee has to complete after joining the store , inclues fields as [Store_Id,Store_name,Training Topic,Key Learning Points,YouTube Link,Documentation Link]
        5.  store_tasks - collection containing information about different store processes and what all steps to follow for a particular process, includes fields like [Store_Id,Store_name,Task ID,Task Name,Step 1,Step 2,Step 3,Step 4
        ]
        6. aisle_locations: Gives instructions on where you can find the aisle in the store, includes fields as [Aisle No,Location in Store,Nearby Sections,Distance from Entrance (m),Special Notes]

        Based on the question, give me relevant information related to the question.

        Make the answer consize, more human speech like and to the point. Elaborate only when asked to tell in detail.

        If asked any questions about transactions on a particular day, or any aggregate value of the transactions, sales , profit or purchase, calculate according to the question and tell the answer, after the answer do mention that displayed numerical information is close to 99.9% accurate, however its best to consult with valid sales reports.

        If asked about any other information outside of the above points describe, respectfully decline.

    `;
        // Create vector store retriever chain to retrieve documents and formats them as a string for the prompt.
        const retrieverChain = this.vectorStore.asRetriever().pipe(this.formatDocuments);

        // Define tools for the agent can use, the description is important this is what the AI will 
        // use to decide which tool to use.

        // A tool that retrieves product information from Contoso Bike Store based on the user's question.
        const productsRetrieverTool = new DynamicTool({
            name: "products_retriever_tool",
            description: `Searches related to kmart retail stores,  documentation regarding POS system, products and their attributes and locations, transactions for sales, refund and other, training topics and store processes 
                    Returns the result in JSON format.`,
            func: async (input) => await retrieverChain.invoke(input),
        });

        // // A tool that will lookup a product by its SKU. Note that this is not a vector store lookup.
        // const productLookupTool = new DynamicTool({
        //     name: "product_sku_lookup_tool",
        //     description: `Searches Contoso Bike Store product information for a single product by its SKU.
        //             Returns the product information in JSON format.
        //             If the product is not found, returns null.`,
        //     func: async (input) => {
                
        //         console.log(`productLookupTool input: ${input}`);
                
        //         const db = this.dbClient.db(dbname);
        //         const products = db.collection("products");
        //         const doc = await products.findOne({ "sku": input });
        //         if (doc) {
        //             //remove the contentVector property to save on tokens
        //             delete doc.contentVector;
        //         }
                
        //         console.log(`productLookupTool doc: ${doc}`);

        //         return doc ? JSON.stringify(doc, null, '\t') : null;
        //     },
        // });

        // Generate OpenAI function metadata to provide to the LLM
        // The LLM will use this metadata to decide which tool to use based on the description.
        const tools = [productsRetrieverTool];
        const modelWithFunctions = this.chatModel.bind({
            functions: tools.map((tool) => convertToOpenAIFunction(tool)),
        });

        // OpenAI function calling is fine-tuned for tool using therefore you don't need to provide instruction.
        // All that is required is that there be two variables: `input` and `agent_scratchpad`.
        // Input represents the user prompt and agent_scratchpad acts as a log of tool invocations and outputs.
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemMessage],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
            new MessagesPlaceholder("agent_scratchpad")
        ]);

        // Define the agent and executor
        // An agent is a type of chain that reasons over the input prompt and has the ability
        // to decide which function(s) (tools) to use and parses the output of the functions.
        const runnableAgent = RunnableSequence.from([
            {
                input: (i) => i.input,
                agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
                chat_history: (i) => i.chat_history
            },
            prompt,
            modelWithFunctions,
            new OpenAIFunctionsAgentOutputParser(),
        ]);

        // An agent executor can be thought of as a runtime, it orchestrates the actions of the agent
        // until completed. This can be the result of a single or multiple actions (one can feed into the next).
        // Note: If you wish to see verbose output of the tool usage of the agent, 
        //       set returnIntermediateSteps to true
        const executor = AgentExecutor.fromAgentAndTools({
            agent: runnableAgent,
            tools,
            returnIntermediateSteps: true,
            verbose: true,
        });

        return executor;
    }

    // Helper function that executes the agent with user input and returns the string output
    async executeAgent(input) {
        let returnValue = "";
        try {
            await this.dbClient.connect();
            // Invoke the agent with the user input
            const result = await this.agentExecutor.invoke({ input: input, chat_history: this.chatHistory });

            this.chatHistory.push(new HumanMessage(input));
            this.chatHistory.push(new AIMessage(result.output));

            // Output the intermediate steps of the agent if returnIntermediateSteps is set to true
            if (this.agentExecutor.returnIntermediateSteps) {
                console.log(JSON.stringify(result.intermediateSteps, null, 2));
            }
            // Return the final response from the agent
            returnValue = result.output;
        } finally {
            await this.dbClient.close();
        }
        return returnValue;
    }
};

module.exports = MatildaTeamAssistant;
