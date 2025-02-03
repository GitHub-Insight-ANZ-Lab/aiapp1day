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

const chatModel = new ChatOpenAI();



async function connectToDatabase() {
    await dbClient.connect();
    console.log("Connected to MongoDB");
}

async function disconnectFromDatabase() {
    await dbClient.close();
    console.log('Disconnected from MongoDB');
}

function formatDocuments(docs) {
    return docs.map(doc => {
        const { pageContent, metadata } = doc;
        const formattedDoc = { "_id": pageContent, ...metadata };
        delete formattedDoc.contentVector; // Remove unnecessary properties
        delete formattedDoc.tags;
        return JSON.stringify(formattedDoc, null, '\t');
    }).join(",\n") + "\n\n";
}

async function buildAgentExecutor(vectorStore) {
    const systemMessage = `
        You are a helpful, fun and friendly assistant for kmart retail stores.
    
        Your name is Matilda.

        You are designed to answer questions about the POS system documentation,product information including price, stock, and aisle location, store transactions including purchases and sales, mandatory training sessions for employees,store processes and steps to follow for tasks.

        If you don't know the answer to a question, respond with "I don't know."
        
        Only answer questions related to kmart retail stores, documentation regarding POS system, products and their attributes and locations, transactions for sales, refund and other, training topics and store processes.

        Return the answer as consize and to the point, until specifically asked to elaborate on the details.
        
        If a question is not related to kmart retail stores,  documentation regarding POS system, products and their attributes and locations, transactions for sales, refund and other, training topics and store processes,
        respond with "I only answer questions about kmart retail stores"
    `;

    const retrieverChain = vectorStore.asRetriever().pipe(formatDocuments);

    const productsRetrieverTool = new DynamicTool({
        name: "products_retriever_tool",
        description: `Searches related to kmart retail stores,  documentation regarding POS system, products and their attributes and locations, transactions for sales, refund and other, training topics and store processes 
                    Returns the result in JSON format.`,
        func: async (input) => await retrieverChain.invoke(input),
    });

    // const productLookupTool = new DynamicTool({
    //     name: "product_sku_lookup_tool",
    //     description: `Searches Kmart product information for a single product by its SKU.
    //                 Returns the product information in JSON format.
    //                 If the product is not found, returns null.`,
    //     func: async (input) => {
    //         const db = dbClient.db(dbname);
    //         const products = db.collection("products");
    //         const doc = await products.findOne({ sku: input });
    //         if (doc) {
    //             delete doc.contentVector;
    //         }
    //         return doc ? JSON.stringify(doc, null, "\t") : null;
    //     },
    // });

    // const productFeedbackTool = new DynamicTool({
    //     name: "product_feedback_lookup_tool",
    //     description: `Searches Kmart feedback based on the question.
    //                 Returns the product name, sku and feedback in text format.
    //                 If the product is not found, returns null.`,
    //     func: async (input) => {
    //         const url = `${graphRagAPI}/query/global`;
    //         const requestBody = {
    //             index_name: "kmart",
    //             query: `whats the top 2 products based on:  ${input}?`,
    //             community_level: 1
    //         };
            
    //         const response = await axios.post(url, requestBody, {});
    //         return response.data.result;
    //     },
    // });

    const tools = [productsRetrieverTool
        // , productLookupTool, productFeedbackTool
    ];
    const modelWithFunctions = chatModel.bind({
        functions: tools.map((tool) => convertToOpenAIFunction(tool)),
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemMessage],
        ["human", "{input}"],
        new MessagesPlaceholder((variable_name = "agent_scratchpad")),
    ]);

    const runnableAgent = RunnableSequence.from([
        {
            input: (i) => i.input,
            agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
        },
        prompt,
        modelWithFunctions,
        new OpenAIFunctionsAgentOutputParser(),
    ]);

    const executor = AgentExecutor.fromAgentAndTools({
        agent: runnableAgent,
        tools,
        //returnIntermediateSteps: true
    });

    return executor;
}

// Main function to handle the question
async function main() {
    try {
        await connectToDatabase();

        const question = "Where can I find asile 7 in store ?";
        const collectionName = await routeQuestion(question);
        console.log('Collection for the question:', collectionName);

        const azureCosmosDBConfig = {
            client: dbClient,
            databaseName: dbname,
            collectionName: collectionName,
            indexName: "VectorSearchIndex",
            embeddingKey: "contentVector",
            textKey: "_id"
        };

        const vectorStore = new AzureCosmosDBVectorStore(new OpenAIEmbeddings(), azureCosmosDBConfig);
        const agentExecutor = await buildAgentExecutor(vectorStore);

        // Example execution of the agent
        const result = await agentExecutor.invoke({ input: question });
        console.log('Agent result:', result.output);
    } catch (err) {
        console.error(err);
    } finally {
        await disconnectFromDatabase();
    }
}

main().catch(console.error);