require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function main() {    
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(process.env.MONGODB_NAME);

        
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