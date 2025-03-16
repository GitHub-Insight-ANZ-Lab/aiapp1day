# Azure Deployment Guide

This Azure Deployment using Bicep step is _**optional**_. You can use shared keys and connection string. If you are interested to create all the resources for the labs yourself, please continue the steps on this page. Otherwise, please use [**Option 1**](#option-1-use-shared-lab-resources).

The following describes the limitations for chosing an option other than Option 1.

- Option 2: You have limited Azure Subscription permission within your organisation, you have contributor within an Azure Resource Group and have the ability to deploy `App Service Only`. This option is highly dependent on your access and changes can be done to use the shared OpenAI services that have been deployed. It is adviceable to proceed with Option 1 in the interest of time.

- Option 3: If you are Owner or Contributor of an Azure Subscription and have approvals for Azure OpenAI access, this options allows you to deploy `all resources`. This step is also founded on the expectation that you are adept with Bicep scripting language in your day-to-day professional activities.

## Option 1: Use shared lab resources

Please continue to next lab by clicking the _**Next**_ button at the bottom of this page.

## Option 2: Deploy App Service Only

This deployment will only create 2 web apps for the Chatbot Frontend and Backend.

### Run Deployment

Open a terminal and navigate to `labs/03-LAB-03/1-Azure-Deployment/lab-user` folder within the repository.

1. Login

   ```Powershell
   az login
   ```

2. Set the desired subscription (Optional). If you have more than one subscription associated with your account, set the desired subscription using the following command:

   ```Powershell
   az account set --subscription <subscription-id>
   ```

3. Create a resource group, replace \{your-rg-name\} with the resource group name of your choosing. For example, aiapp1day-daniel-rg. You may have restricted permissions to create a resource group. In the case of restrcited resource group creation access, please skip this step. You will have to find out the name of the resource group and note it down for the next steps.

   ```Powershell
   az group create --name {your-rg-name} --location eastus
   ```

4. Do a What-If test deployment first

   ```Powershell
   az deployment group create --resource-group {your-rg-name} --template-file ./azuredeploy.bicep --parameters ./azuredeploy.parameters.json --what-if
   ```

5. Deploy the solution resources using the following command (this will take a few minutes to run):

   ```Powershell
   az deployment group create --resource-group {your-rg-name} --template-file ./azuredeploy.bicep --parameters ./azuredeploy.parameters.json
   ```

6. Go to `Resource Group`'s `Deployments` tab to check progress in the Azure Portal.


## Option 3: Deploy All Resources

This deployment will create all the resources required for the lab, including Azure OpenAI service, Azure Cosmos DB, and Azure App Services for the Chatbot Frontend and Backend.

### Prerequisites

- Azure subscription (Owner or Contributor)
- [Azure Cli](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) (Azure Cli includes Bicep)
- Access to Azure OpenAI service

### Configure Deployment

Open a terminal and navigate to `labs/03-LAB-03/1-Azure-Deployment/lab-core` folder within the repository.

Open the `azuredeploy.parameters.json` file, edit the `name` (it will be the prefix of all resources). e.g.: arg-syd-daniel

Then edit the `mongoDbPassword` to a password you wish to use for the MongoDB Admin User. When the Azure Bicep template is deployed, this parameters file will be used to configure the Mongo DB Password and other parameters when provisioning the Azure resources.

![editing the azuredeploy.parameters.json file with mongoDBPassword parameter highlighted](images/editor-azuredeploy-parameters-json-password.png)

### Run Deployment

Open a terminal window and log in to Azure using the following command:

1. Login

   ```Powershell
   az login
   ```

2. Set the desired subscription (Optional). If you have more than one subscription associated with your account, set the desired subscription using the following command:

   ```Powershell
   az account set --subscription <subscription-id>
   ```

3. Create resource group, replace \{your-rg-name\} with the resource group name you like, could be aiapp1day-daniel-rg.

   ```Powershell
   az group create --name {your-rg-name} --location eastus
   ```

4. Do a What-If test deployment first

   ```Powershell
   az deployment group create --resource-group {your-rg-name} --template-file ./azuredeploy.bicep --parameters ./azuredeploy.parameters.json --what-if
   ```

5. Deploy the solution resources using the following command (this will take a few minutes to run):

   ```Powershell
   az deployment group create --resource-group {your-rg-name} --template-file ./azuredeploy.bicep --parameters ./azuredeploy.parameters.json
   ```

6. Go to `Resource Group`'s `Deployments` tab to check progress in the Azure Portal.

## Deployed Azure Resources

### Azure Resource List

    ![alt text](images/azure-all-resources.png)

### Azure OpenAI Models

    ![alt text](images/azure-openai-models.png)
