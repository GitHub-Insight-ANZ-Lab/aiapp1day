---
title: "Challenge 6: Search"
---

## Production Image Search

### Goal

Enables users to search for and retrieve similar product assets by using a product image, streamlining access and enhancing personalization and optimization across centralized resources.

### Challenge

Implementing a function that effectively matches a product image to similar assets within a centralized repository, ensuring accuracy, scalability, and ease of use.

### Tips

Create a function to search product catelogue using a product image. 

There is a `Search` page on chatbot, the page have an upload photo button, and a button to invoke backend service and get back a matched product image. Use vector image search in CosmosDb, the product table is already populated in the database. 

Complete the `searchApi` function to send a image and receive a matched image.

- Generate image ebedding for the uploaded image
- Complete the CosmosDb Mongdb vector search login
- Inspect the response payload of the call
- Retrieve the matched product and display on the page

### Answer

```
router.post('/image', async (req, res) => {
    // console.log(req)
    let agent = {};

    agent = new apiAgent();
    let result = await agent.getVector(req.files[0].path);
    res.send({ message: result });
});

async getVector(file) {
    // const content = fs.readFileSync('/usr/src/app/cosmic_works/85-6541.png');
    const content = fs.readFileSync(file);
    console.log(file);

    console.log(cvendpoint);
    var vector = '';
    await fetch(cvendpoint, {
        method: 'POST',
        body: content,
        headers: { 'Content-Type': 'application/octet-stream', "Ocp-Apim-Subscription-Key": cvapiKey }
    })
        .then((result) => result.text())
        .then((data) => {
            vector = JSON.parse(data)
            // string `{"text":"hello world"}`
        })
    console.log(vector.vector);

    this.client = new MongoClient(process.env.AZURE_COSMOSDB_MONGODB_CONNECTION_STRING);
    await this.client.connect();

    const db = this.client.db("dbname");
    const collection = db.collection("productimage");

    const documents = collection.aggregate([
        {
            "$search": {
                "cosmosSearch": { "vector": vector.vector, "path": "vectorContent", "k": 3 },
                "returnStoredSource": "true"
            }
        }
        , {
            "$project": {
                'similarityScore':
                    { '$meta': 'searchScore' }, "_id": 3, "image_file": 3, "author": 3, "title": 3, "type": 3, "description": 3
            }
        }])

    var result = []
    await documents.forEach(doc => result.push(doc));
    console.log(result)
    return result;
};
```
