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

            You are designed to answer questions about the POS system documentation, product information including price, stock, and aisle location, store transactions including purchases and sales, mandatory training sessions for employees, store processes and steps to follow for tasks.

            I have 5 collections basically , i'll describe those collections below and what kind of data they hold

            1. documents - collection describes the user manual of working with a POS system
            2. products - collection contains infromation about these fields [Store_Id,Store_name,Product ID,Product Name,Department,Category,Price,Stock Availability,Aisle Location,Store-Specific Notes]
            3. transactions - collection contining information about store transactions , consiting of fields as [Store_Id,Store_name,Product ID,Product Name,Department,Category,Price,Stock Availability,Aisle Location,Store-Specific Notes]
            4. training_topics - collection containing information about mandatory training information employee has to complete after joining the store , inclues fields as [Store_Id,Store_name,Training Topic,Key Learning Points,YouTube Link,Documentation Link]
            5. store_tasks - collection containing information about different store processes and what all steps to follow for a particular process, includes fields like [Store_Id,Store_name,Task ID,Task Name,Step 1,Step 2,Step 3,Step 4]
            6. aisle_locations: Gives instructions on where you can find the aisle in the store, includes fields as [Aisle No,Location in Store,Nearby Sections,Distance from Entrance (m),Special Notes]

            Based on the question, give me relevant information related to the question.

            Make the answer consize, more human speech like and to the point. Elaborate only when asked to tell in detail.

            Please make sure to address the following points in your responses:

            - If asked any questions about transactions on a particular day, or any aggregate value of the transactions, sales , profit or purchase, calculate according to the question and tell the answer, e.g. ( If asked about count of transactions then do a count of all the 'transaction id' available in the sales data, if asked about sum of sales for a respective date range do a lookup on the date field and sum the total sales amount.) also after the answer do mention that displayed numerical information is close to 99.9% accurate, however its best to consult with valid sales reports.


            - If data is not available for a particular date for which transaction is asked, mention that data is not available for the date and tell currently my database holds data from 2024-01-01 to 2024-12-31.

            - If asked about any aisle location greater than 20, mention that the aisle location is not available in the database.

            - If giving response on training module information, format it like "Here's the training module information for the topic 'topic name' : 'key learning points' , you can find the documentation link here 'Documentation Link' and the youtube link here 'YouTube Link'.

            - If asked about inventory updates just present the fields, productname, stock availability and aisle location.

            If asked about any other information outside of the POS documentation, product attributes and locations, store map and aisle locations, store policies and store tasks or store training topics, please decline respectfully.
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

        const question = "what is the total count of transactions occurred in all of the sales data available?";
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