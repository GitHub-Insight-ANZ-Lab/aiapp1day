# Load data into Cosmos DB

This lab demonstrates bulk loading of data from the Contoso Bike Store JSON files into Cosmos DB for MongoDB.

## Setup the lab environment

1. Navigate to the lab folder [~/labs/02-LAB/1-load-data/start](https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day/tree/main/labs/02-LAB/1-Load-Data/start) within the repository.

   ```bash
   cd  labs/02-LAB/1-load-data/start
   code .
   ```

:::info
The `~/labs/02-LAB/1-load-data/completed` folder contains the completed solution for this lab.
:::

2. In the lab folder, create a `.env` file and add the following environment variables, replace `<MONGODB_CONNECTION_STRING>` with your Cosmos DB for MongoDB API service connection string:

   ```text
   MONGODB_CONNECTION_STRING=mongodb+srv://aiapp1dayadmin:Aiapp1daypassword123@arg-syd-aiapp1day-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000&tlsInsecure=true
   ```

3. Choose a unique name for your CosmosDB database. While everyone in the workshop will share the same CosmosDB instance, you can select your own database name. Modify `MONGODB_Name` in `.env` file.

   ```text
   MONGODB_Name = 'aiapp1day_daniel_55'

   MONGODB_Name = 'aiapp1day_{your_name}_{your_lucky_number}'
   ```

4. In Visual Studio Code, open a terminal window and navigate to the lab folder `start` .

5. To install the required packages, execute the following command in the terminal window:

   ```bash
   npm install
   ```

## Prepare the data set

The qualitfy of the dataset feeding into the LLM model makes big different. Maybe it is usually the job of data team, but there could be various convertion and integration required to format the data set. Lets do a quick excerise on preparing the data set. No 'Rubbish in & Rubbish out' for our chatbot.

The product data set is located in data\product.csv, the data set has multiple columns. but the tags column is a json string.

1. this is the csv file
   ![alt text](images/rag_load_data_image.png)

2. create a `convert.js` file to parse the text into json format that is better for vector search.

   ```javascript
   const fs = require("fs");
   const path = require("path");
   const rootDir = "data";

   // Read CSV file
   const csvFilePath = path.join(rootDir, "product.csv");
   const csvData = fs.readFileSync(csvFilePath, "utf8");

   // Convert CSV to JSON
   function csvToJson(csv) {
     const lines = csv.trim().split("\n");
     const headers = lines[0]
       .split(",")
       .map((header) => header.replace(/"/g, ""));
     const jsonData = lines.slice(1).map((line) => {
       const values = line
         .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
         .map((value) => value.replace(/"/g, ""));
       const obj = {};
       headers.forEach((header, index) => {
         if (header === "tags") {
           // Decode the JSON string
           obj[header] = JSON.parse(values[index].replace(/'/g, '"'));
         } else {
           obj[header] = values[index];
         }
       });
       return obj;
     });
     return JSON.stringify(jsonData, null, 2);
   }

   const json = csvToJson(csvData);

   // Write JSON to file
   const jsonFilePath = path.join(rootDir, "product.json");
   fs.writeFileSync(jsonFilePath, json, "utf8");

   console.log("CSV file has been converted to JSON file successfully.");
   ```

3. Save the `convert.js` file. To run the application, execute the following command in the terminal window:

   ```bash
   node convert.js
   ```

4. Open the generated `product.json` file and see if any format issues stands out?
   ![alt text](images/rag_load_data_image-1.png)

5. Use the "Differ" feature in Visual Studio Code to compare `product.json` and `product-original.json` for any discrepancies. We noticed that `price` is a string rather than a float.

6. To convert the price tag to a float in the JSON file, modify the code as follows:

   ```javascript
   if (header === "tags") {
     // Decode the JSON string
     obj[header] = JSON.parse(values[index].replace(/'/g, '"'));
   } else if (header === "price") {
     // Convert price to integer
     obj[header] = parseFloat(values[index], 10);
   } else {
     obj[header] = values[index];
   }
   ```

7. Run the code and compare the two JSON files again. We noticed that the description field seems to be missing quotation marks in certain parts.

> **Challenge**: Can you suggest a modification to the code that would preserve the quotation marks in the description field?

## Bulk load product data

There is more than one option when performing bulk operations in Cosmos DB for MongoDB. In this section, data will be loaded using the `bulkWrite` method. The `bulkWrite` method is used to perform multiple write operations in a single batch, write operations can include a mixture of insert, update, and delete operations.

1. Open the `import.js` file, and directly beneath the `const db = client.db('DBName');` line, add the following code to fetch the product data from the Contoso Bike Store repository:

   ```javascript
   // Load product data
   console.log("Loading product data");
   // Initialize the product collection pointer (will automatically be created if it doesn't exist)
   const productCollection = db.collection("products");

   // Define the path to the local JSON file
   const jsonFilePath = path.join("data", "product.json");

   // Read the JSON file
   const productRawData = fs.readFileSync(jsonFilePath, "utf8");
   const productData = (await (await fetch(productRawData)).json()).map(
     (prod) => cleanData(prod)
   );
   ```

2. Optionally, append the following code (to the code in the previous step) to delete any existing products in the collection. This helps if the application is run multiple times so there is no duplicates.

   ```javascript
   // Delete any existing products
   console.log("Deleting existing products");
   await productCollection.deleteMany({});
   ```

3. Append the following code (to the code in the previous step) to bulk load the product data into the collection:

   ```javascript
   var result = await productCollection.bulkWrite(
     productData.map((product) => ({
       insertOne: {
         document: product,
       },
     }))
   );
   console.log(`${result.insertedCount} products inserted`);
   ```

4. Save the `import.js` file.

5. Run the application by executing the following command in the terminal window:

   ```bash
   node import.js
   ```

   ![A console window displays indicating products have been inserted into the products collection](images/rag_load_data_products_loaded.png "Products loaded")

## Bulk load of customer and sales data

In this section, data will be loaded using the `insertMany` method. The `insertMany` method is used to insert multiple documents into a collection, it differs from the `bulkWrite` method in that it only supports insert operations.

Customer data and sales data are also combined in a single JSON source, some pre-processing is required to separate the data into two separate collections.

1. Open the `import.js` file, and directly beneath the code for adding products, append the following code to fetch the customer and sales data from the Contoso Bike Store repository:

   ```javascript
   // Load customer and sales data
   console.log("Retrieving combined Customer/Sales data");
   const customerCollection = db.collection("customers");
   const salesCollection = db.collection("sales");

   const custSalesRawData = fs.readFileSync(
     path.join("data", "custSalesData.json"),
     "utf8"
   );
   const custSalesData = JSON.parse(custSalesRawData).map((custSales) =>
     cleanData(custSales)
   );
   ```

2. Split the customer data from the sales data by appending the following code (to the code in the previous step):

   ```javascript
   console.log("Split customer and sales data");
   const customerData = custSalesData.filter(
     (cust) => cust["type"] === "customer"
   );
   const salesData = custSalesData.filter(
     (sales) => sales["type"] === "salesOrder"
   );
   ```

3. Append the following code (to the code in the previous step) to bulk load the customer data into the collection using the `insertMany` method:

   ```javascript
   console.log("Loading customer data");
   await customerCollection.deleteMany({});
   result = await customerCollection.insertMany(customerData);
   console.log(`${result.insertedCount} customers inserted`);
   ```

4. Append the following code (to the code in the previous step) to bulk load the sales data into the collection using the `insertMany` method:

   ```javascript
   console.log("Loading sales data");
   await salesCollection.deleteMany({});
   result = await salesCollection.insertMany(salesData);
   console.log(`${result.insertedCount} sales inserted`);
   ```

5. Save the `import.js` file.

6. Run the application by executing the following command in the terminal window:

   ```bash
   node import.js
   ```

   ![A console window displays indicating customers and sales have been inserted into the customers and sales collections](images/rag_load_data_customers_sales_loaded.png "Customers and sales loaded")

## Browse the data in the Cosmos DB (MongoDB)

1. Install MongoDb extension in VS code : MongoDB for VS code
   ![alt text](images/rag_load_data_image-6.png)

2. then add a connection to the data.
   ![alt text](images/rag_load_data_image-2.png)

3. Browse the json records in the product and customer table.
   ![alt text](images/rag_load_data_image-7.png)

In this section bulk load operations were used to load product, customer, and sales data into Cosmos DB for MongoDB. Keep the database and its loaded data for use in subsequent labs.
