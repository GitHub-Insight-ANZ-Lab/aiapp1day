# Azure Deployment Guide

There are 3 options for the Azure Deployment:

- If you don't have Azure Subscription, you can use our shared lab resources.
- If you have Azure Subscription (Owner or Contributor), you can deploy `all resources` and use them.
- If you dont have access to Azure OpenAI service, you can deploy `App Service Only` and use the shared OpenAI service.

## Option 1: Deploy All Resources

This deployment will create all the resources required for the lab, including Azure OpenAI service, Azure Cosmos DB, and Azure App Services for the Chatbot Frontend and Backend.

### Prerequisites

- Azure subscription (Owner or Contributor)
- [PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4#installing-the-msi-package)
- [Bicep](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/install)
- Access to Azure OpenAI service

### Configure Deployment

Open a terminal and navigate to `labs/02-LAB-02/1-Azure-Deployment/lab-core` folder within the repository.

Open the `azuredeploy.parameters.json` file, edit the `name` (it will be the prefix of all resources).

Then edit the `mongoDbPassword` to a password you wish to use for the MongoDB Admin User. When the Azure Bicep template is deployed, this parameters file will be used to configure the Mongo DB Password and other parameters when provisioning the Azure resources.

![editing the azuredeploy.parameters.json file with mongoDBPassword parameter highlighted](images/editor-azuredeploy-parameters-json-password.png)

### Run Deployment

Open a terminal window and log in to Azure using the following command:

1. Login

   ```Powershell
   Connect-AzAccount
   ```

2. Set the desired subscription (Optional). If you have more than one subscription associated with your account, set the desired subscription using the following command:

   ```Powershell
   Set-AzContext -SubscriptionId <subscription-id>
   ```

3. Create resource group, replace \{your-rg-name\} with the resource group name you like, could be aiapp1day-daniel-rg.

   ```Powershell
   New-AzResourceGroup -Name {your-rg-name} -Location 'eastus'
   ```

4. Deploy the solution resources using the following command (this will take a few minutes to run):

   ```Powershell
   New-AzResourceGroupDeployment -ResourceGroupName {your-rg-name} -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c
   ```

## Option 2: Deploy App Service Only

This deployment will only create 2 web apps for the Chatbot Frontend and Backend.

### Run Deployment

Open a terminal and navigate to `labs/02-LAB-02/1-Azure-Deployment/lab-user` folder within the repository.

1. Login

   ```Powershell
   Connect-AzAccount
   ```

2. Set the desired subscription (Optional). If you have more than one subscription associated with your account, set the desired subscription using the following command:

   ```Powershell
   Set-AzContext -SubscriptionId <subscription-id>
   ```

3. Create resource group, replace \{your-rg-name\} with the resource group name you like, could be aiapp1day-daniel-rg.

   ```Powershell
   New-AzResourceGroup -Name {your-rg-name} -Location 'eastus'
   ```

4. Deploy the solution resources using the following command (this will take a few minutes to run):

   ```Powershell
   New-AzResourceGroupDeployment -ResourceGroupName {your-rg-name} -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c
   ```

## Deployed Azure Resources

### Azure Resource List

    ![alt text](images/azure-all-resources.png)

### Azure OpenAI Models

    ![alt text](images/azure-openai-models.png)
