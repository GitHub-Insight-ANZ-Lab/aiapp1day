require('dotenv').config();
const { MongoClient } = require('mongodb');
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const oaiClient = new OpenAIClient(
    "https://<AZURE_OPENAI_API_INSTANCE_NAME>.openai.azure.com",
    new AzureKeyCredential("<AZURE_OPENAI_API_KEY>")
);

async function main() {
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    try {
        await client.connect();
        console.log('Connected to Cosmos DB for MongoDB');
        const db = client.db(process.env.MONGODB_NAME);
        await db.createCollection('test');
        console.log('Collection created: test');

        await client.db('test').dropDatabase();
        // await client.db('cosmic_works').dropDatabase();

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }


    console.log('Connected to Azure OpenAI Service');
    const chatResponse = oaiClient.getChatCompletions("completions", [
        { role: "user", content: "G'day" },
    ]);

    chatResponse
        .then((result) => {
            for (const choice of result.choices) {
                console.log('OpenAI Service:' + choice.message.content);
            }
        })
        .catch((err) => console.log(`Error: ${err}`));


}

function cleanData(obj) {
    cleaned = Object.fromEntries(
        Object.entries(obj).filter(([key, _]) => !key.startsWith('_'))
    );
    //rename id field to _id
    cleaned["_id"] = cleaned["id"];
    delete cleaned["id"];
    return cleaned;
}

main().catch(console.error);