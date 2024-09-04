# Build a Chatbot Backend

The backend api is a Node.js web application, using Express and Swagger, that will expose endpoints for the frontend application to interact with. The backend api could be deployed as containerized application that will be deployed to [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/overview) or Azure App service.


## Clone the Code Repo

Create a folder to house the repository. Open a terminal and navigate to the folder. Clone the repository, then navigate to the `Backend` folder within the repository.

```bash
git clone https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day.git

cd apps/api
```

## Run the backend api locally

When developing a backend api, it is often useful to run the application locally to test and debug. This section outlines how to run the backend api locally while watching the file system for code changes. Any detected changes will automatically restart the backend api.

1. Open the backend api folder location in VS Code.

2. Open a **Terminal** window in VS Code (<kbd>CTRL</kbd>+<kbd>`</kbd>).

3. Add the following settings to the `.env` file, populating the MongoDB connection string and replacing the values from the deployed Azure OpenAI service:

   ```bash
   AZURE_OPENAI_API_INSTANCE_NAME=<openai-service-name>
   AZURE_OPENAI_API_KEY=<azure_openai_api_key>
   AZURE_OPENAI_API_DEPLOYMENT_NAME=completions
   AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=embeddings
   AZURE_OPENAI_API_VERSION=2023-09-01-preview
   ```

   Replace `<MONGODB_CONNECTION_STRING>` with the MongoDB connection string. Replace `<openai-service-name>` with the name of the deployed OpenAI service, and `<azure_openai_api_key>` with the Azure OpenAI API key. Leave all other values untouched.

   > **Note**: The Azure OpenAI service name is not the full endpoint. Only the service name is required. For example, if the endpoint is `https://myservicename.openai.azure.com/`, then the service name is `myservicename`.


## Add LangChain Agent to Backend API

1. In the previous task, we have create a LangChain agent and it is able to RAG to response to our question. Now, lets add the code into our Backend API service.

2. Do a diff in VS code between `agent.js` and  `langchain-agent.js`. you will see there are additional code added in the function to manage chat history.
   ![alt text](images/chatbot-frontend-image-1.png)
   
3. Copy `agent.js` into `apps\api\bikestore\agent.js` so that the backend is able to connect to both CosmosDb and OpenAI service


## Test out Backend API Swagger

1. Run the following command to install any dependencies:

   ```bash
   npm install
   ```

2. Run the following command to start the backend api.

   ```bash
   npm run dev
   ```

3. Open a browser and navigate to `http://localhost:5000/docs` to view the Swagger UI.

   ![The Swagger UI displays for the locally running backend api](images/local_backend_swagger_ui.png "Local backend api Swagger UI")

4. Expand the **GET / Root** endpoint and select **Try it out**. Select **Execute** to send the request. The response should display a status of `ready`.

   ![The Swagger UI displays the GET / Root endpoint reponse that has a status of ready.](images/local_backend_swagger_ui_root_response.png "Local backend api Swagger UI Root response")

5. Expand the **POST /ai** endpoint and select **Try it out**. In the **Request body** field, enter the following JSON.

   ```json
   {
     "session_id": "abc123",
     "prompt": "hello, how are you"
   }
   ```

6. Select **Execute** to send the request. Observe that the response indicates the price as being `$1431.50`.

    ![The Swagger UI displays the POST /ai endpoint reponse that has a status of ready.](images/local_backend_swagger_ui_ai_response.png "Local backend api Swagger UI AI response")

7. In the Terminal window, press <kbd>CTRL</kbd>+<kbd>C</kbd> to stop the backend api.
