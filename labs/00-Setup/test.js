require('dotenv').config();
const { MongoClient } = require('mongodb');
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const openai_instance = process.env.AZURE_OPENAI_API_INSTANCE_NAME;
const openai_key = process.env.AZURE_OPENAI_API_KEY;
const oaiClient = new OpenAIClient(
    `https://${openai_instance}.openai.azure.com`,
    new AzureKeyCredential(openai_key)
);

async function main() {
    var dbname = process.env.MONGODB_Name;
    var dbconn = process.env.MONGODB_CONNECTION_STRING;
    console.log(dbname);
    console.log(dbconn);

    const client = new MongoClient(dbconn);
    try {
        await client.connect();
        console.log('Connected to Cosmos DB for MongoDB');
        const db = client.db(dbname);
        await db.createCollection('products');
        console.log('Collection created: test');

        // clean up db
        // await client.db('test').dropDatabase();
        
        // const adminDb = client.db().admin();
        // const databases = await adminDb.listDatabases();
        // console.log('Databases:');
        // databases.databases.forEach(db => console.log(` await client.db('${db.name}').dropDatabase(); `));
        // await client.db('aiapp1day_daniel').dropDatabase();

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

