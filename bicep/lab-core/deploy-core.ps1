

Connect-AzAccount

Set-AzContext -SubscriptionId <subscription-id>

New-AzResourceGroup -Name aiapp1day-core-rg -Location 'eastus'

New-AzResourceGroupDeployment -ResourceGroupName aiapp1day-core-rg -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c

