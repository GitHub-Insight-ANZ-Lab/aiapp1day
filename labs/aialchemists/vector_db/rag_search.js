require('dotenv').config();
const { MongoClient } = require('mongodb');
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

// set up the Azure OpenAI client
const embeddingsDeploymentName = "embeddings";
const completionsDeploymentName = "completions";

const aoaiClient = new OpenAIClient(
    "https://" +
    process.env.AZURE_OPENAI_API_INSTANCE_NAME +
    ".openai.azure.com/",
    new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
);


async function generateEmbeddings(text) {
  const embeddings = await aoaiClient.getEmbeddings(
      embeddingsDeploymentName,
      text
  );
  // Rest period to avoid rate limiting on Azure OpenAI
  await new Promise((resolve) => setTimeout(resolve, 500));
  return embeddings.data[0].embedding;
}

async function vectorSearch(db, collectionName, query, numResults = 3) {
  const collection = db.collection(collectionName);
  // generate the embedding for incoming question
  const queryEmbedding = await generateEmbeddings(query);

  const pipeline = [
    {
      $search: {
        cosmosSearch: {
          vector: queryEmbedding,
          path: "contentVector",
          k: numResults,
        },
        returnStoredSource: true,
      },
    },
    {
      $project: {
        similarityScore: { $meta: "searchScore" },
        document: "$$ROOT",
      },
    },
  ];

  //perform vector search and return the results as an array
  const results = await collection.aggregate(pipeline).toArray();
  return results;
}

async function ragWithVectorsearch(
  db,
  collectionName,
  question,
  numResults = 3
) {
  //A system prompt describes the responsibilities, instructions, and persona of the AI.
  const systemPrompt = `
        You are a helpful, fun and friendly sales assistant for a retail Store, a groceries, apparel and general merchandise store.

        Your name is YourAIBuddy .
        You are designed to answer questions about the a POS System LUCAS.
        
        Only answer questions related to the information provided in the given result string represented
        in JSON format.
        
        You only answer questions about POS systems and retail stores, if asked anything else respectfully decline to answer.
        
        Result String:
    `;
  const collection = db.collection(collectionName);
  //generate vector embeddings for the incoming question
  const queryEmbedding = await generateEmbeddings(question);
  //perform vector search and return the results
  results = await vectorSearch(db, collectionName, question, numResults);
  resultList = "";
  //remove contentVector from the results, create a string of the results for the prompt
  for (const result of results) {
    delete result["document"]["contentVector"];
    resultList += JSON.stringify(result["document"]) + "\n\n";
  }

  //assemble the prompt for the large language model (LLM)
  const formattedPrompt = systemPrompt + resultList;
  //prepare messages for the LLM call, TODO: if message history is desired, add them to this messages array
  const messages = [
    {
      role: "system",
      content: formattedPrompt,
    },
    {
      role: "user",
      content: question,
    },
  ];

  //call the Azure OpenAI model to get the completion and return the response
  const completion = await aoaiClient.getChatCompletions(
    completionsDeploymentName,
    messages
  );
  return completion.choices[0].message.content;
}


// set up the MongoDB client
const dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
var dbname = process.env.MONGODB_Name;

async function main() {
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');
        const db = dbClient.db(dbname);

        //Vector search query
        // const searchResults = await vectorSearch(
        //   db,
        //   "manuals",
        //   "How to process a transaction in POS system?"
        // );

        //RAG with vector search for the top 3 most relevant products
        console.log(
          await ragWithVectorsearch(
            db,
            "manuals",
            "How to process a transaction in POS system?",
            1
          )
        )

    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
        console.log('Disconnected from MongoDB');
    }
}


main().catch(console.error);

