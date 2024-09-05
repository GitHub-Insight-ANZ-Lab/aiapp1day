require('dotenv').config();
const { MongoClient } = require('mongodb');
const { OpenAIClient, AzureKeyCredential} = require("@azure/openai");

// set up the MongoDB client
const dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
// set up the Azure OpenAI client 
const embeddingsDeploymentName = "embeddings";
const aoaiClient = new OpenAIClient("https://" + process.env.AZURE_OPENAI_API_INSTANCE_NAME + ".openai.azure.com/", 
                    new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY));

async function main() {
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');
        const db = dbClient.db(process.env.MONGODB_NAME);

        
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
        console.log('Disconnected from MongoDB');
    }
}

main().catch(console.error);