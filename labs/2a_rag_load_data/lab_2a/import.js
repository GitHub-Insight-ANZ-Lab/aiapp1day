require('dotenv').config();
const { MongoClient } = require('mongodb');
const DBNAME = 'aiapp1day_daniel'

async function main() {    
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(DBNAME);

        
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

function cleanData(obj) {
    cleaned =  Object.fromEntries(
        Object.entries(obj).filter(([key, _]) => !key.startsWith('_'))
    );
    //rename id field to _id
    cleaned["_id"] = cleaned["id"];
    delete cleaned["id"];
    return cleaned;
}

main().catch(console.error);