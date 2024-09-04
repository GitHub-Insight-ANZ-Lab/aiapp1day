
https://learn.microsoft.com/en-us/powershell/azure/install-azure-powershell?view=azps-12.2.0
Install-Module -Name Az -Repository PSGallery -Force


Connect-AzAccount

Set-AzContext -SubscriptionId <subscription-id>

New-AzResourceGroup -Name aiapp1day-user2-rg -Location 'eastus'

New-AzResourceGroupDeployment -ResourceGroupName aiapp1day-user2-rg -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c

