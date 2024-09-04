
# Azure Deployment Guide

You have 2 options for the Azure Deployment.

- if you have all required permission on the subscription, you can deploy `all resources`
- otherwise, you can deploy only 2 `app services` for the chatbot


## Deploy All Resources

This deployment will create all service required including OpenAI services and MongoDb.

### Prerequisites

- Owner on Azure subscription
- Azure PowerShell installed
- Bicep installed
- Account subscription approved for Azure OpenAI service

If the Azure Powershell Module is not installed, please follow https://learn.microsoft.com/en-us/powershell/azure/install-azure-powershell?view=azps-12.2.0

```Powershell
Install-Module -Name Az -Repository PSGallery -Force
```


### Edit Settings

Open a terminal and navigate to `labs/02-LAB-02/6-Azure-Deployment/lab-core` folder within the repository.

Open the `azuredeploy.parameters.json` file, then edit the `mongoDbPassword` to a password you wish to use for the MongoDB Admin User:

![editing the azuredeploy.parameters.json file with mongoDBPassword parameter highlighted](images/editor-azuredeploy-parameters-json-password.png)

When the Azure Bicep template is deployed, this parameters file will be used to configure the Mongo DB Password and other parameters when provisioning the Azure resources.

### Run Deployment

Open a terminal window and log in to Azure using the following command:

1. Login

```Powershell
Connect-AzAccount
```

2. Set the desired subscription (Optional)

If you have more than one subscription associated with your account, set the desired subscription using the following command:

```Powershell
Set-AzContext -SubscriptionId <subscription-id>
```

3. Create resource group

```Powershell
New-AzResourceGroup -Name {your-rg-name} -Location 'eastus'
```

4. Deploy the solution resources using the following command (this will take a few minutes to run):

    ```Powershell
    New-AzResourceGroupDeployment -ResourceGroupName {your-rg-name} -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c
    ```

## Deploy App Service Only

This deployment will only create 2 web apps for the Chatbot Frontend and Backend.

### Run Deployment

Open a terminal and navigate to `labs/02-LAB-02/6-Azure-Deployment/lab-user` folder within the repository.

1. Login

```Powershell
Connect-AzAccount
```

2. Set the desired subscription (Optional)

If you have more than one subscription associated with your account, set the desired subscription using the following command:

```Powershell
Set-AzContext -SubscriptionId <subscription-id>
```

3. Create resource group

```Powershell
New-AzResourceGroup -Name {your-rg-name} -Location 'eastus'
```

4. Deploy the solution resources using the following command (this will take a few minutes to run):

```Powershell
New-AzResourceGroupDeployment -ResourceGroupName {your-rg-name} -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c
```

