require('dotenv').config();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { AzureCosmosDBVectorStore,
    AzureCosmosDBSimilarityType
} = require("@langchain/community/vectorstores/azure_cosmosdb")
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai")
// To support the LangChain LCEL RAG chain
const { PromptTemplate }  = require("@langchain/core/prompts")
const { RunnableSequence, RunnablePassthrough } = require("@langchain/core/runnables")
const { StringOutputParser } = require("@langchain/core/output_parsers")


// set up the MongoDB client
const dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
var dbname = process.env.MONGODB_Name;
var graphRagAPI = process.env.GRAPH_RAG_API;

// set up the Azure Cosmos DB vector store using the initialized MongoDB client
const azureCosmosDBConfig = {
    client: dbClient,
    databaseName: dbname,
    collectionName: "products",
    indexName: "VectorSearchIndex",
    embeddingKey: "contentVector",
    textKey: "_id"
}
const vectorStore = new AzureCosmosDBVectorStore(new OpenAIEmbeddings(), azureCosmosDBConfig);
// set up the OpenAI chat model
const chatModel = new ChatOpenAI();

async function main() {
    try {
        await dbClient.connect();
        console.log("Connected to MongoDB");

    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
        console.log('Disconnected from MongoDB');
    }
}


function formatDocuments(docs) {
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


main().catch(console.error);