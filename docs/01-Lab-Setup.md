---
title: "Lab Setup Instructions"
slug: /lab-setup
---

# Pre-requisites


## Tools

Install the following tools on your machine:
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Node.js](https://nodejs.org/en/download/prebuilt-installer)
- [Git](https://git-scm.com/downloads) (Optional)

## Windows Sandbox

If you are using Windows, you can easily start up a Windows Sandbox to keep your local machine clean. Read more https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/windows-sandbox-overview

```powershell
Enable-WindowsOptionalFeature -FeatureName "Containers-DisposableClientVM" -All -Online
```

Once restarted, search `Windows Sandbox` in `Start` button. 


## Lab Resources

Clone [aiapp1day](https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day) repository from GitHub. This repository contains the source code and guides for completing the labs.

   ```bash
   git clone https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day.git
   ```

The resources for the labs can be found in the following directories:
- Node.js Backend API: `~/apps/backend`
- Frontend Web App: `~/apps/chatbot`
- Lab Source Code: `~/labs`

<!-- If you don't have git installed, you can download code as zip from https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day
![alt text](images/gitrepo-zip.png) -->

## Deployment

The Azure Resources required for the labs have already been provisioned for you. The details of the Azure resources are provided in the table below. You will be required to use this information during the labs.

You can also deploy the resources using the instructions provided in the `Azure Deployment Guide` page.

### Azure AI Proxy Playground

| Description          | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| AI Proxy Playground  | https://arg-syd-aiapp1day-playground.azurewebsites.net |
| Azure OpenAI API Key | 70563d5a57cc45999cdd80b9bf50ed4d                       |

<br/>

### Azure OpenAI Resource Configuration

| Variable Name                               | Value                                             |
| ------------------------------------------- | ------------------------------------------------- |
| AZURE_OPENAI_API_INSTANCE_NAME              | arg-syd-aiapp1day-openai                          |
| AZURE_OPENAI_API_ENDPOINT                   | https://arg-syd-aiapp1day-openai.openai.azure.com |
| AZURE_OPENAI_API_KEY                        | 70563d5a57cc45999cdd80b9bf50ed4d                  |
| AZURE_OPENAI_API_DEPLOYMENT_NAME            | completions                                       |
| AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME | embeddings                                        |
| AZURE_OPENAI_API_VERSION                    | 2023-09-01-preview                                |

<br/>

### vCore-based Cosmos DB for MongoDB

The Cosmos DB is used as a backend database for the chatbot. You will be populating the database with sample data during the labs. It is important to note that you are required to create a new database with a unique name on the Cosmos DB instance provided below.
The database name should be in the format `aiapp1day_your_name_your_lucky_number`.

| Variable Name             | Value                                                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MONGODB_CONNECTION_STRING | mongodb+srv://aiapp1dayadmin:Aiapp1daypassword123@arg-syd-aiapp1day-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000&tlsInsecure=true |
| MONGODB_Name              | aiapp1day_your_name_your_lucky_number                                                                                                                                                                 |
