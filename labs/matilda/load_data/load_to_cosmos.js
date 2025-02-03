require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const outputFolderPath = 'output/';

async function loadToCosmos() {
    // Connect to MongoDB
    const uri = process.env.MONGODB_CONNECTION_STRING;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('aiapp1day_aialchemists_555');

        // Function to recursively read files from a directory
        async function readFilesRecursively(dir) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    await readFilesRecursively(filePath);
                } else if (path.extname(file) === '.json') {
                    await loadJsonFileToCollection(filePath, path.basename(dir));
                }
            }
        }

        // Function to load a JSON file to a MongoDB collection
        async function loadJsonFileToCollection(filePath, collectionName) {
            // Read the JSON file
            const rawData = fs.readFileSync(filePath, "utf8");

            let data;
            try {
                data = JSON.parse(rawData);
                if (!Array.isArray(data)) {
                    throw new Error('Parsed JSON data is not an array');
                }
            } catch (error) {
                console.error(`Error parsing JSON data from file ${filePath}:`, error);
                return;
            }

            const collection = database.collection(collectionName);

            // Delete any existing data
            console.log(`Deleting existing data in collection ${collectionName}`);
            await collection.deleteMany({});

            // Insert new data
            const result = await collection.insertMany(data);
            console.log(`Inserted ${result.insertedCount} documents into the ${collectionName} collection`);
        }

        // Read and process all JSON files in the output folder
        await readFilesRecursively(outputFolderPath);

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } finally {
        await client.close();
    }
}

// Run the function
loadToCosmos().catch(err => console.error(err));