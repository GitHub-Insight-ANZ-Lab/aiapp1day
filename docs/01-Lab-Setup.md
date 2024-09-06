---
title: "Lab Setup Instructions"
slug: /lab-setup
---

# Pre-requisites


## Tools

Install the following tools on your machine:
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Node.js](https://nodejs.org/en/download/prebuilt-installer) (v20.17)
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

   :::info
   If you don't have git installed, you can download the repo as zip file from above page.
   :::


The resources for the labs can be found in the following directories:
- Node.js Backend API: `~/apps/backend`
- Frontend Web App: `~/apps/chatbot`
- Lab Source Code: `~/labs`

<!-- If you don't have git installed, you can download code as zip from https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day
![alt text](images/gitrepo-zip.png) -->

## Deployment

The Azure Resources required for the labs have already been provisioned for you. The details of the Azure resources are provided in the table below. You will be required to use this information during the labs.

   :::info
   If you have Azure Subscription already, we suggest you to deploy these resources to your own Azure subscription using the instructions and `bicep` provided in the `Azure Deployment Guide` page.
   :::

### Azure AI Proxy Playground

| Description          | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| AI Proxy Playground  | https://arg-syd-aiapp1day-playground.azurewebsites.net |
| Azure OpenAI API Key | 70563d5a57cc45999cdd80b9bf50ed4d                       |


### Azure OpenAI Resource Configuration

| Variable Name                               | Value                                             |
| ------------------------------------------- | ------------------------------------------------- |
| AZURE_OPENAI_API_INSTANCE_NAME              | arg-syd-aiapp1day-openai                          |
| AZURE_OPENAI_API_ENDPOINT                   | https://arg-syd-aiapp1day-openai.openai.azure.com |
| AZURE_OPENAI_API_KEY                        | 70563d5a57cc45999cdd80b9bf50ed4d                  |
| AZURE_OPENAI_API_DEPLOYMENT_NAME            | completions                                       |
| AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME | embeddings                                        |
| AZURE_OPENAI_API_VERSION                    | 2023-09-01-preview                                |


### Azure Cosmos DB for MongoDB

The Cosmos DB is used as vector store for the chatbot. During the labs, you will populate the database with sample data and create vector column. It is important to note that you are required to create a new database with a unique name on the shared Cosmos DB instance provided below.

The database name should be in the format `aiapp1day_{your_name}_{your_lucky_number}`.

| Variable Name             | Value                                                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MONGODB_CONNECTION_STRING | mongodb+srv://aiapp1dayadmin:Aiapp1daypassword123@arg-syd-aiapp1day-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000&tlsInsecure=true |
| MONGODB_Name              | aiapp1day_\{your_name\}_\{your_lucky_number\}                                                                                  |

:::info
Be aware, above API keys and connection details will be reset after the workshop.
:::

## Sign up Azure Subscription

### Free Account with $200 credit
Create an free Azure account with $200 credit to use on Azure services within 30 days here. 

https://azure.microsoft.com/en-au/pricing/purchase-options/azure-account?icid=azurefreeaccount

### Visual Studio subscribers

Monthly Azure credits for Visual Studio subscribers, activate Azure credits here:

https://azure.microsoft.com/en-au/pricing/member-offers/credit-for-visual-studio-subscribers


