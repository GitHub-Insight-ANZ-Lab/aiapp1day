require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function main() {    
    var dbname = process.env.MONGODB_Name;
    var dbconn = process.env.MONGODB_CONNECTION_STRING;
    
    const client = new MongoClient(dbconn);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);

        
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