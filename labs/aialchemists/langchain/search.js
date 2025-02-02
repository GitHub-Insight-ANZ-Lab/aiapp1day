require('dotenv').config();
const { MongoClient } = require('mongodb');
const {
    AzureCosmosDBVectorStore,
    AzureCosmosDBSimilarityType,
} = require("@langchain/community/vectorstores/azure_cosmosdb");
const { OpenAIEmbeddings } = require("@langchain/openai");

// set up the MongoDB client
const dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
var dbname = process.env.MONGODB_Name;

// set up the Azure Cosmos DB vector store using the initialized MongoDB client
const azureCosmosDBConfig = {
    client: dbClient,
    databaseName: dbname,
    collectionName: "manuals",
    indexName: "VectorSearchIndex",
    embeddingKey: "contentVector",
    textKey: "_id",
};
const vectorStore = new AzureCosmosDBVectorStore(
    new OpenAIEmbeddings(),
    azureCosmosDBConfig
);

async function main() {
    try {
        await dbClient.connect();
        console.log("Connected to MongoDB");

        // perform a vector search using the vector store
        const results = await vectorStore.similaritySearch(
            "What all different menus you have in POS system ?",
            AzureCosmosDBSimilarityType.CosineSimilarity,
            3
        );
        console.log(results);

    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
        console.log('Disconnected from MongoDB');
    }
}

main().catch(console.error);