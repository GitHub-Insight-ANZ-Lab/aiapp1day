require('dotenv').config();
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

var dbname = process.env.MONGODB_Name;

class POSStoreAgent {
    constructor() {
        
        // set up the MongoDB client
        this.dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
        // set up the Azure Cosmos DB vector store
        const azureCosmosDBConfig = {
            client: this.dbClient,
            databaseName: process.env.MONGODB_NAME,
            collectionName: "manuals",
            indexName: "VectorSearchIndex",
            embeddingKey: "contentVector",
            textKey: "_id"
        }
        this.vectorStore = new AzureCosmosDBVectorStore(new OpenAIEmbeddings(), azureCosmosDBConfig);

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
        // A system prompt describes the responsibilities, instructions, and persona of the AI.
        // Note the variable placeholders for the list of products and the incoming question are not included.
        // An agent system prompt contains only the persona and instructions for the AI.
        const systemMessage = `
            You are a helpful, fun and friendly sales assistant for a retail Store, a groceries, apparel and general merchandise store.

        Your name is YourAIBuddy .
        You are designed to answer questions about the a POS System LUCAS.
        
        Only answer questions related to the information provided in the given result string represented
        in JSON format.
        
        You only answer questions about POS systems and retail stores, if asked anything else respectfully decline to answer.        
        `;
        // Create vector store retriever chain to retrieve documents and formats them as a string for the prompt.
        const retrieverChain = this.vectorStore.asRetriever().pipe(this.formatDocuments);

        // Define tools for the agent can use, the description is important this is what the AI will 
        // use to decide which tool to use.

        // A tool that retrieves product information from Contoso Bike Store based on the user's question.
        const answersRetrieverTool = new DynamicTool({
            name: "answers_retriever_tool",
            description: `Searches manuals DB answer information for similar answers based on the question. 
                    Returns the answer information in JSON format.`,
            func: async (input) => await retrieverChain.invoke(input),
        });

        // A tool that will lookup a product by its SKU. Note that this is not a vector store lookup.
        const answerLookupTool = new DynamicTool({
            name: "answer_sku_lookup_tool",
            description: `Searches manuals DB answer information for a single answer by its SKU.
                    Returns the answer information in JSON format.
                    If the answer is not found, returns null.`,
            func: async (input) => {
                
                console.log(`answerLookupTool input: ${input}`);
                
                const db = this.dbClient.db(dbname);
                const answers = db.collection("manuals");
                const doc = await answers.findOne({ "sku": input });
                if (doc) {
                    //remove the contentVector property to save on tokens
                    delete doc.contentVector;
                }
                
                console.log(`answerLookupTool doc: ${doc}`);

                return doc ? JSON.stringify(doc, null, '\t') : null;
            },
        });

        // Generate OpenAI function metadata to provide to the LLM
        // The LLM will use this metadata to decide which tool to use based on the description.
        const tools = [answersRetrieverTool, answerLookupTool];
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

module.exports = POSStoreAgent;
