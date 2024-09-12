
/* *************************************************************** */
/* Parameters */
/* *************************************************************** */

param location string = 'eastus'

@maxLength(17)
param name string = 'ai-${uniqueString(resourceGroup().id)}'

@description('Specifies the SKU for the Azure App Service plan. Defaults to **B1**')
param appServiceSku string = 'S0'


var appServiceSettings = {
  plan: {
    name: '${name}-web'
    sku: appServiceSku
  }
  api: {
    name: '${name}-api'
  }
  chat: {
    name: '${name}-chat'
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
  name: '${name}-appi'
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

resource appServiceApi 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceSettings.api.name
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appCommandLine: 'pm2 start app.js --no-daemon'
      alwaysOn: true
    }
  }
}

resource appServiceWebSettingsApi 'Microsoft.Web/sites/config@2022-03-01' = {
  parent: appServiceApi
  name: 'appsettings'
  kind: 'string'
  properties: {
    APPINSIGHTS_INSTRUMENTATIONKEY: appServiceWebInsights.properties.InstrumentationKey
  }
}

resource appServiceChat 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceSettings.chat.name
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

resource appServiceWebSettingsChat 'Microsoft.Web/sites/config@2022-03-01' = {
  parent: appServiceChat
  name: 'appsettings'
  kind: 'string'
  properties: {
    APPINSIGHTS_INSTRUMENTATIONKEY: appServiceWebInsights.properties.InstrumentationKey
  }
}

