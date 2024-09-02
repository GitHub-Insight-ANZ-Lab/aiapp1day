/* *************************************************************** 
Azure Cosmos DB + Azure OpenAI Node.js developer guide lab
******************************************************************
This Azure resource deployment template uses some of the following practices:
- [Abbrevation examples for Azure resources](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations)
*/



/* *************************************************************** */
/* Parameters */
/* *************************************************************** */

param location string = 'eastus'

@maxLength(17)
param name string = 'ai-${uniqueString(resourceGroup().id)}'

@description('Specifies the SKU for the Azure App Service plan. Defaults to **B1**')
@allowed([
  'B1'
  'S1'
  'P0v3'
])
param appServiceSku string = 'S1' //'B1'


var appServiceSettings = {
  plan: {
    name: '${name}-web'
    sku: appServiceSku
  }
  web: {
    name: '${name}-web'
    git: {
      repo: 'https://github.com/AzureCosmosDB/Azure-OpenAI-Developer-Guide-Front-End.git'
      branch: 'main'
    }
  }  
}


/* *************************************************************** */
/* Logging and instrumentation */
/* *************************************************************** */

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: '${name}-loganalytics'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}
resource appServiceWebInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${appServiceSettings.web.name}-appi'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

/* *************************************************************** */
/* App Plan Hosting - Azure App Service Plan */
/* *************************************************************** */
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${appServiceSettings.plan.name}-asp'
  location: location
  sku: {
    name: appServiceSettings.plan.sku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}


/* *************************************************************** */
/* Front-end Web App Hosting - Azure App Service */
/* *************************************************************** */

resource appServiceWeb 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceSettings.web.name
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appCommandLine: 'pm2 serve /home/site/wwwroot/dist --no-daemon --spa'
      alwaysOn: true
    }
  }
}

resource appServiceWebSettings 'Microsoft.Web/sites/config@2022-03-01' = {
  parent: appServiceWeb
  name: 'appsettings'
  kind: 'string'
  properties: {
    APPINSIGHTS_INSTRUMENTATIONKEY: appServiceWebInsights.properties.InstrumentationKey
    API_ENDPOINT: 'https://${backendApiContainerApp.properties.configuration.ingress.fqdn}'
  }
}

resource appServiceWebDeployment 'Microsoft.Web/sites/sourcecontrols@2021-03-01' = {
  parent: appServiceWeb
  name: 'web'
  properties: {
    repoUrl: appServiceSettings.web.git.repo
    branch: appServiceSettings.web.git.branch
    isManualIntegration: true
  }
}


/* *************************************************************** */
/* Container environment - Azure Container App Environment  */
/* *************************************************************** */
resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${name}-containerappenv'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
    workloadProfiles: [
      {
        name: 'Warm'
        minimumCount: 1
        maximumCount: 10
        workloadProfileType: 'E4'
      }
    ]
    infrastructureResourceGroup: 'ME_${resourceGroup().name}'
  }
}

/* *************************************************************** */
/* Back-end API App Application - Azure Container App */
/* deploys default hello world */
/* *************************************************************** */
resource backendApiContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${name}-api'
  location: location
  properties: {
    environmentId: containerAppEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 80
        allowInsecure: false
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]   
        corsPolicy: {
          allowCredentials: false
          allowedHeaders: [
            '*'
          ]
          allowedOrigins: [
            '*'
          ]
        }
      }
      // registries: [
      //   {
      //     server: containerRegistry.name
      //     username: containerRegistry.properties.loginServer
      //     passwordSecretRef: 'container-registry-password'
      //   }
      // ]
      // secrets: [
      //   {
      //     name: 'container-registry-password'
      //     value: containerRegistry.listCredentials().passwords[0].value
      //   }
      // ]
    }
    template: {
      containers: [
        {
          name: 'hello-world'
          image: 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          resources: {
            cpu: 1
            memory: '2Gi'
          }         
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}
