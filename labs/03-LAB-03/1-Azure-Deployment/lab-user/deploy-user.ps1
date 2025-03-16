

# Log in to Azure
az login

# Set the subscription context
az account set --subscription {xxx-xxx-xxx-xxx}

# Create a new resource group
az group create --name {your_rg_name} --location eastus

#  What-If using the Bicep template and parameters file
az deployment group create --resource-group {your_rg_name} --template-file ./azuredeploy.bicep --parameters ./azuredeploy.parameters.json --what-if

# Deploy resources using the Bicep template and parameters file
az deployment group create --resource-group {your_rg_name} --template-file ./azuredeploy.bicep --parameters ./azuredeploy.parameters.json --verbose

