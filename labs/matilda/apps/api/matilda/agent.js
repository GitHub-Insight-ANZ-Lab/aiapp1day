require('dotenv').config();
const { routeQuestion } = require('./select_collection');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { AzureCosmosDBVectorStore, AzureCosmosDBSimilarityType } = require("@langchain/community/vectorstores/azure_cosmosdb");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RunnableSequence, RunnablePassthrough } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { DynamicTool } = require("@langchain/core/tools");
const { AgentExecutor } = require("langchain/agents");
const { MessagesPlaceholder, ChatPromptTemplate } = require("@langchain/core/prompts");
const { convertToOpenAIFunction } = require("@langchain/core/utils/function_calling");
const { OpenAIFunctionsAgentOutputParser } = require("langchain/agents/openai/output_parser");
const { formatToOpenAIFunctionMessages } = require("langchain/agents/format_scratchpad");
const { HumanMessage, AIMessage } = require('langchain/schema');

class MatildaTeamAssistant {
    constructor() {
        this.dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
        this.dbname = process.env.MONGODB_Name;
        this.graphRagAPI = process.env.GRAPH_RAG_API;
        this.chatModel = new ChatOpenAI();
        this.chatHistory = [];
    }

    async connectToDatabase() {
        await this.dbClient.connect();
        console.log("Connected to MongoDB");
    }

    async disconnectFromDatabase() {
        await this.dbClient.close();
        console.log('Disconnected from MongoDB');
    }

    formatDocuments(docs) {
        return docs.map(doc => {
            const { pageContent, metadata } = doc;
            const formattedDoc = { "_id": pageContent, ...metadata };
            delete formattedDoc.contentVector; // Remove unnecessary properties
            delete formattedDoc.tags;
            return JSON.stringify(formattedDoc, null, '\t');
        }).join(",\n") + "\n\n";
    }

    async buildAgentExecutor(vectorStore) {
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

            - If asked any questions about transactions on a particular day, or any aggregate value of the transactions, sales , profit or purchase, calculate according to the question and tell the answer, after the answer do mention that displayed numerical information is close to 99.9% accurate, however its best to consult with valid sales reports.

            - If data is not available for a particular date for which transaction is asked, mention that data is not available for the date and tell currently my database holds data from 2024-01-01 to 2024-12-31.

            - If asked about any aisle location greater than 20, mention that the aisle location is not available in the database.

            - If giving response on training module information, format it like "Here's the training module information for the topic 'topic name' : 'key learning points' , you can find the documentation link here 'Documentation Link' and the youtube link here 'YouTube Link'.

            If asked about any other information outside of the POS documentation, product attributes and locations, store map and aisle locations, store policies and store tasks or store training topics, please decline respectfully.
        `;

        const retrieverChain = vectorStore.asRetriever().pipe(this.formatDocuments);

        const productsRetrieverTool = new DynamicTool({
            name: "products_retriever_tool",
            description: `Searches related to kmart retail stores, documentation regarding POS system, products and their attributes and locations, transactions for sales, refund and other, training topics and store processes 
                        Returns the result in JSON format.`,
            func: async (input) => await retrieverChain.invoke(input),
        });

        const tools = [productsRetrieverTool];
        const modelWithFunctions = this.chatModel.bind({
            functions: tools.map((tool) => convertToOpenAIFunction(tool)),
        });

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemMessage],
            ["human", "{input}"],
            new MessagesPlaceholder("agent_scratchpad"),
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

    async executeAgent(question) {
        try {
            await this.connectToDatabase();

            const collectionName = await routeQuestion(question);
            console.log('Collection for the question:', collectionName);

            const azureCosmosDBConfig = {
                client: this.dbClient,
                databaseName: this.dbname,
                collectionName: collectionName,
                indexName: "VectorSearchIndex",
                embeddingKey: "contentVector",
                textKey: "_id"
            };

            const vectorStore = new AzureCosmosDBVectorStore(new OpenAIEmbeddings(), azureCosmosDBConfig);
            const agentExecutor = await this.buildAgentExecutor(vectorStore);

            const result = await agentExecutor.invoke({ input: question, chat_history : this.chatHistory });

            this.chatHistory.push(new HumanMessage(question));
            this.chatHistory.push(new AIMessage(result.output));


            // console.log('Agent result:', result.output);
            return result.output;
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            await this.disconnectFromDatabase();
        }
    }
}

module.exports = MatildaTeamAssistant;