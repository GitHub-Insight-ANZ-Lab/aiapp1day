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
        if (typeof manualData !== 'object' || Array.isArray(manualData)) {
            throw new Error('Parsed JSON data is not an object');
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
        const result = await manualCollection.insertOne(manualData);
        console.log(`Inserted document with _id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}

// Define the cleanData function (if needed)
function cleanData(product) {
    // Example cleaning process
    return {
        name: product.name.trim(),
        content: product.content.trim()
    };
}

// Run the function
loadToCosmos().catch(err => console.error(err));