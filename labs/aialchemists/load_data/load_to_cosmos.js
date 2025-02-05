require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const jsonFilePath = 'POS/LUCAS_POS_Manual.json';

async function loadToCosmos() {
    // Read the JSON file
    const manualRawData = fs.readFileSync(jsonFilePath, "utf8");

    let manualData;
    try {
        manualData = JSON.parse(manualRawData);
        if (!Array.isArray(manualData)) {
            throw new Error('Parsed JSON data is not an array');
        }
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        return;
    }

    // Connect to MongoDB
    const uri = process.env.MONGODB_CONNECTION_STRING;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('aiapp1day_aialchemists_555');
        const manualCollection = database.collection('manuals');

        // Delete any existing data
        console.log("Deleting existing manual data");
        await manualCollection.deleteMany({});

        // Insert new data
        const result = await manualCollection.insertMany(manualData);
        console.log(`Inserted ${result.insertedCount} documents into the manuals collection`);
    } catch (err) {
        console.error('Error inserting documents:', err);
    } finally {
        await client.close();
    }
}

// Run the function
loadToCosmos().catch(err => console.error(err));