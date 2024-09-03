require('dotenv').config();
const { MongoClient } = require('mongodb');
const DBNAME = 'aiapp1day_daniel'

// set up the MongoDB client
const dbClient = new MongoClient(process.env.MONGODB_URI);

async function main() {
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');
        const db = DBNAME;

        
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
        console.log('Disconnected from MongoDB');
    }
}

main().catch(console.error);