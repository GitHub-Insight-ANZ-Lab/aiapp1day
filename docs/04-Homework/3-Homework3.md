---
title: "Homework"
slug: /homework1
---

## Challenge #3 Product Content Search Using Visual

Goal: (session 2, high value)
Enables users to search for and retrieve similar product assets by using a product image, streamlining access and enhancing personalization and optimization across centralized resources.

Challenge: 
Implementing a function that effectively matches a product image to similar assets within a centralized repository, ensuring accuracy, scalability, and ease of use.

Note: vector image search in cosmos db. Basically, I will prepare a table with image vectors. The participant needs to figure out how to create a function to search images using an image input.



router.post('/image', async (req, res) => {
    // console.log(req)
    let agent = {};

    agent = new legoAgent();
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

        const db = this.client.db("legoaibot");
        const collection = db.collection("legoimage");

        // Query for similar documents.
        // const documents = collection.aggregate([
        //     { "$group": { "_id": "$image_file", "count": { "$sum": "1" } } }
        // ]);     

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

};