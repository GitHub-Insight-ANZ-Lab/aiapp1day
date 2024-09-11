---
title: "Lab Setup Instructions"
slug: /lab-setup
---

## Lab Environment

## Source Code Repository

The source code for the labs is hosted on GitHub. You can access the repository using the following link:
https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day

The repository contains the following folders:

- Lab exercises: `~/labs`
- Node.js Backend API: `~/apps/backend`
- Frontend Web App: `~/apps/chatbot`

## Lab Setup

### Option 1: GitHub Codespaces (Recommended)

Follow the steps below to set up the lab environment using GitHub Codespaces:

1. **Create a GitHub Account**: If you don't have a GitHub account, you can create one [here](https://github.com/join).

2. **Open in Codespaces**: Navigate to the [aiapp1day](https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day) repository. Click on the "Code" button and select "Open with Codespaces". If you don't see this option, ensure you have GitHub Codespaces enabled for your account.

3. **Create a New Codespace**: Click on "New codespace" to create a new development environment. This will set up a Codespace with all the necessary tools and dependencies pre-installed.

4. The Codespace will take a few minutes to set up. It will install the following tools and dependencies for you:

   - [Node.js](https://nodejs.org/en/download/prebuilt-installer) (v20.17)
   - [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
   - [Git](https://git-scm.com/downloads)

5. **Start Coding**: Once the Codespace is ready, you can start coding and follow the lab instructions directly within the browser-based VS Code environment. The changes you make in your Codespace are saved automatically. If you stop and restart your Codespace, your changes will persist.

**Note** - You can also connect to your Codespace from your local VS Code editor by installing the [GitHub Codespaces extension](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces).

### Option 2: Local Computer

1. Install the following tools on your machine:

   - [Visual Studio Code](https://code.visualstudio.com/download)
   - [Node.js](https://nodejs.org/en/download/prebuilt-installer) (v20.17)
   - [Azure Cli (include Bicep)](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
   - [Git](https://git-scm.com/downloads)


   :::info
   If your device has restrictions, you can download the `VS Code`, `Node.js`, and `Azure CLI` zip packages. Then, add the `Node.js` and `Azure CLI\bin` folder paths to your environment variables. You will need to restart `VS Code` for the changes to take effect.

   ```bash
   set PATH=%PATH%;C:\your\path\here\;
   ```
   :::


2. Visit our [aiapp1day](https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day) repository in GitHub. This repository contains the source code and guides for completing the labs.

    ```bash
    git clone https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day.git
    ```

3. Navigate to the repository folder and open it in Visual Studio Code:

   ```bash
   cd aiapp1day
   code .
   ```

#### Windows Sandbox

If you are using Windows, you can easily start up a Windows Sandbox to keep your local machine clean. Read more https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/windows-sandbox-overview

Run the following command in PowerShell to enable Windows Sandbox feature:

```powershell
Enable-WindowsOptionalFeature -FeatureName "Containers-DisposableClientVM" -All -Online
```

Once restarted, search `Windows Sandbox` in `Start` button.


## Azure Deployment

The Azure Resources required for the labs have already been provisioned.

The details of the shared Azure resources are provided in the table below. You will need these details to connect to the Azure services during the labs.

If you have an Azure Subscription, you can provision these resources yourself using the instructions and `bicep` files provided on the `Azure Deployment Guide` page. However, this is optional.

You can also create a free Azure account with $200 credit to use on Azure services within 30 days. If you are a Visual Studio subscriber, you can activate monthly Azure credits. Refer to the links below for more information.

https://azure.microsoft.com/en-au/pricing/purchase-options/azure-account?icid=azurefreeaccount

https://azure.microsoft.com/en-au/pricing/member-offers/credit-for-visual-studio-subscribers

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

Cosmos DB is used as the database for the chatbot. During the lab exercises, you will populate the database with sample data. You are required to **create a new database with a unique name** in the shared Cosmos DB instance.

The database name could be in the format `aiapp1day_{your_name}_{your_lucky_number}` so that you have your own copy of data.
You should remove the curly brackets `{}` and replace the placeholders with your name and a lucky number.

| Variable Name              | Value                                                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MONGODB_CONNECTION_STRING  | mongodb+srv://aiapp1dayadmin:Aiapp1daypassword123@arg-syd-aiapp1day-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000&tlsInsecure=true |
| MONGODB_Name               | aiapp1day*\{your_name\}*\{your_lucky_number\}                                                                                                                                                         |
| MONGODB_Name (for example) | aiapp1day_daniel_55                                                                                                                                                                                   |

:::info
API keys and connection details will be reset after the lab session.
:::

## Configure the Lab Environment & Verify Connection

Let us test the connection to Cosmos DB instance and OpenAI service.

1.  Open VS Code and navigate to the `aiapp1day` repository folder. If you are using Codespaces, you should already be in the repository folder.

2.  Switch to VS Code `Search` tab, replace `<MONGODB_Name>` placeholder with your own database name. Search for `<MONGODB_Name>` and replace with `aiapp1day_xxxxx_xx` (for example: aiapp1day_daniel_66). Then click replace all. The placeholder string will be replaced in the whole repo so that you have a dedicated database on the shared Cosmos DB instance.

    :::info
    Make sure the `<` and `>` included in search & replace.

    if you are deploying your own Azure resources, please update above shared keys and connection string with your own.
    :::

    ![alt text](images/setup.png)

3.  Replace `<MONGODB_CONNECTION_STRING>` with `mongodb+srv://aiapp1dayadmin:Aiapp1daypassword123@arg-syd-aiapp1day-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000&tlsInsecure=true`

4.  Replace `<AZURE_OPENAI_API_INSTANCE_NAME>` with `arg-syd-aiapp1day-openai`

5.  Replace `<AZURE_OPENAI_API_KEY>` with `70563d5a57cc45999cdd80b9bf50ed4d`

6.  Navigate to the setup test folder `~/labs/01-Setup/` within the repository.

    ```bash
    npm install
    ```

7.  Test Connection to CosMos Db and OpenAI service. Run the following command in the terminal window to execute the script:

    ```bash
    node test.js
    ```

8.  If you see below message in the console, you are ready to go! otherwise, please `YELL for help`.

    ![alt text](images/setup-test.png)
