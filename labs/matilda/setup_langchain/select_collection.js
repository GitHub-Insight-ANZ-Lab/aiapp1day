require('dotenv').config();
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const client = new OpenAIClient(
    "https://" + process.env.AZURE_OPENAI_API_INSTANCE_NAME + ".openai.azure.com/",
    new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
);

// Function to route the question to the appropriate collection using Azure OpenAI
async function routeQuestion(question) {

    const SystemPrompt = `
        You are an intelligent assistant. Based on the following question, determine the most appropriate collection to query from the following options:
        - documents: for user manuals and POS system documentation
        - products: for product information including price, stock, and aisle location
        - transactions: for store transactions including purchases and sales
        - training_topics: for mandatory training information for employees
        - store_tasks: for store processes and steps to follow for tasks
        - asile_location: for giving hints from the collection, near which place we can find the aisle 
        
        give one word answer as collection name for this
    `;


    try {
        const response = await client.getChatCompletions(
            "completions",
            [{ role: "system", content: SystemPrompt }
            ,{ role: "user", content: question }
            ]);

        if (response.choices && response.choices.length > 0) {
            const collection = response.choices[0].message.content.trim().toLowerCase();
            console.log('Determined collection:', collection); // Log the determined collection
            return collection;
        } else {
            console.error('No choices returned in the response');
            return null;
        }
    } catch (error) {
        console.error('Error in routeQuestion:', error);
        return null;
    }
}

module.exports = { routeQuestion };