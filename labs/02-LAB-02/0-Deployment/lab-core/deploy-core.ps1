

Connect-AzAccount

Set-AzContext -SubscriptionId 9df3a442-42f1-40dd-8547-958c3e01597a

New-AzResourceGroup -Name aiapp1day-core-rg -Location 'eastus'

New-AzResourceGroupDeployment -ResourceGroupName arg-syd-aiapp1day-lab -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c

