

Connect-AzAccount

Set-AzContext -SubscriptionId <subscription-id>

New-AzResourceGroup -Name aiapp1day-user-rg -Location 'eastus'

New-AzResourceGroupDeployment -ResourceGroupName aiapp1day-user-rg -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c

