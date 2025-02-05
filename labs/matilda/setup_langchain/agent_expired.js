
// async function main() {
//     const question = "Do we sell Nike shoes?";
//     const collection = await routeQuestion(question);
//     console.log('Collection for the question:', collection);
// }

// main().catch(console.error);


require('dotenv').config();
const { routeQuestion } = require('./select_collection');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { AzureCosmosDBVectorStore,AzureCosmosDBSimilarityType} = require("@langchain/community/vectorstores/azure_cosmosdb")
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai")
// To support the LangChain LCEL RAG chain
const { PromptTemplate } = require("@langchain/core/prompts")
const { RunnableSequence, RunnablePassthrough } = require("@langchain/core/runnables")
const { StringOutputParser } = require("@langchain/core/output_parsers")
// For LangChain agent
const { DynamicTool } = require("@langchain/core/tools");
const { AgentExecutor } = require("langchain/agents");
const {MessagesPlaceholder,ChatPromptTemplate,} = require("@langchain/core/prompts");
const {convertToOpenAIFunction,} = require("@langchain/core/utils/function_calling");
const {OpenAIFunctionsAgentOutputParser,} = require("langchain/agents/openai/output_parser");
const {formatToOpenAIFunctionMessages,} = require("langchain/agents/format_scratchpad");
// set up the MongoDB client
const dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
var dbname = process.env.MONGODB_Name;
var graphRagAPI = process.env.GRAPH_RAG_API;

// // set up the Azure Cosmos DB vector store using the initialized MongoDB client
// const azureCosmosDBConfig = {
//     client: dbClient,
//     databaseName: dbname,
//     collectionName: "products",
//     indexName: "VectorSearchIndex",
//     embeddingKey: "contentVector",
//     textKey: "_id"
// }
// const vectorStore = new AzureCosmosDBVectorStore(new OpenAIEmbeddings(), azureCosmosDBConfig);
// set up the OpenAI chat model
const chatModel = new ChatOpenAI();

// async function main() {
//     try {
//         await dbClient.connect();
//         console.log("Connected to MongoDB");

//         const agentExecutor = await buildAgentExecutor();
//         console.log(
//             await executeAgent(agentExecutor, "What yellow products do you have?")
//         );
//     } catch (err) {
//         console.error(err);
//     } finally {
//         await dbClient.close();
//         console.log('Disconnected from MongoDB');
//     }
// }


function formatDocuments(docs) {
    // Prepares the answer list for the system prompt.  
    let strDocs = "";
    for (let index = 0; index < docs.length; index++) {
        let doc = docs[index];
        let docFormatted = { "_id": doc.pageContent };
        Object.assign(docFormatted, doc.metadata);

        // Build the answer document without the contentVector and tags
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

async function buildAgentExecutor() {
    // A system prompt describes the responsibilities, instructions, and persona of the AI.
    // Note the variable placeholders for the list of products and the incoming question are not included.
    // An agent system prompt contains only the persona and instructions for the AI.
    const systemMessage = `
            You are a helpful, fun and friendly assistant for kmart retail stores.
    
            Your name is Matilda.
    
            You are designed to answer questions about the user manuals and POS system documentation,product information including price, stock, and aisle location, store transactions including purchases and sales, mandatory training sessions for employees,store processes and steps to follow for tasks.
    
            If you don't know the answer to a question, respond with "I don't know."
            
            Only answer questions related to kmart retail stores, documentation regarding POS system, products and their attributes and locations, transactions for sales, refund and other, training topics and store processes.
            
            If a question is not related to kmart retail stores,  documentation regarding POS system, products and their attributes and locations, transactions for sales, refund and other, training topics and store processes,
            respond with "I only answer questions about kmart retail stores"          
        `;

    // Create vector store retriever chain to retrieve documents and formats them as a string for the prompt.
    const retrieverChain = vectorStore.asRetriever().pipe(formatDocuments);

    // Define tools for the agent can use, the description is important this is what the AI will
    // use to decide which tool to use.

    // A tool that retrieves product information from Contoso Bike Store based on the user's question.
    const productsRetrieverTool = new DynamicTool({
        name: "answer_retriever_tool",
        description: `Searches Contoso Bike Store product information for similar products based on the question. 
                    Returns the product information in JSON format.`,
        func: async (input) => await retrieverChain.invoke(input),
    });

    // // A tool that will lookup a product by its SKU. Note that this is not a vector store lookup.
    // const productLookupTool = new DynamicTool({
    //     name: "product_sku_lookup_tool",
    //     description: `Searches Contoso Bike Store product information for a single product by its SKU.
    //                 Returns the product information in JSON format.
    //                 If the product is not found, returns null.`,
    //     func: async (input) => {
    //         const db = dbClient.db(dbname);
    //         const products = db.collection("products");
    //         const doc = await products.findOne({ sku: input });
    //         if (doc) {
    //             //remove the contentVector property to save on tokens
    //             delete doc.contentVector;
    //         }
    //         return doc ? JSON.stringify(doc, null, "\t") : null;
    //     },
    // });

    // const productFeedbackTool = new DynamicTool({
    //     name: "product_feedback_lookup_tool",
    //     description: `Searches Contoso Bike Store feedback based on the question.
    //                 Returns the product name, sku and feedback in text format.
    //                 If the product is not found, returns null.`,
    //     func: async (input) => {
    //         const url = `${graphRagAPI}/query/global`;
    //         const requestBody = {
    //             index_name: "bike",
    //             query: `whats the top 2 products based on:  ${input}?`,
    //             community_level: 1
    //         };
            
    //         const response = await axios.post(url, requestBody, {});
    //         return response.data.result;
    //     },
    // });

    // Generate OpenAI function metadata to provide to the LLM
    // The LLM will use this metadata to decide which tool to use based on the description.
    const tools = [productsRetrieverTool
        // , productLookupTool, productFeedbackTool
    ];
    const modelWithFunctions = chatModel.bind({
        functions: tools.map((tool) => convertToOpenAIFunction(tool)),
    });

    // OpenAI function calling is fine-tuned for tool using therefore you don't need to provide instruction.
    // All that is required is that there be two variables: `input` and `agent_scratchpad`.
    // Input represents the user prompt and agent_scratchpad acts as a log of tool invocations and outputs.
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemMessage],
        ["human", "{input}"],
        new MessagesPlaceholder((variable_name = "agent_scratchpad")),
    ]);

    // Define the agent and executor
    // An agent is a type of chain that reasons over the input prompt and has the ability
    // to decide which function(s) (tools) to use and parses the output of the functions.
    const runnableAgent = RunnableSequence.from([
        {
            input: (i) => i.input,
            agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
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
        //returnIntermediateSteps: true
    });

    return executor;
}

// Helper function that executes the agent with user input and returns the string output
async function executeAgent(agentExecutor, input) {
    // Invoke the agent with the user input
    const result = await agentExecutor.invoke({ input });

    // Output the intermediate steps of the agent if returnIntermediateSteps is set to true
    if (agentExecutor.returnIntermediateSteps) {
        console.log(JSON.stringify(result.intermediateSteps, null, 2));
    }
    // Return the final response from the agent
    return result.output;
}

// Main function to handle the question
async function main() {
    try {
        await dbClient.connect();
        console.log("Connected to MongoDB");

        const question = "Do we sell Nike shoes?";
        const collectionName = await routeQuestion(question);
        console.log('Collection for the question:', collectionName);

        const azureCosmosDBConfig = {
            client: dbClient,
            databaseName: dbname,
            collectionName: collectionName, // Use the determined collection name
            indexName: "VectorSearchIndex",
            embeddingKey: "contentVector",
            textKey: "_id"
        };

        const vectorStore = new AzureCosmosDBVectorStore(new OpenAIEmbeddings(), azureCosmosDBConfig);

        const agentExecutor = await buildAgentExecutor();
        console.log(
            await executeAgent(agentExecutor, question)
        );
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
        console.log('Disconnected from MongoDB');
    }
}

main().catch(console.error);