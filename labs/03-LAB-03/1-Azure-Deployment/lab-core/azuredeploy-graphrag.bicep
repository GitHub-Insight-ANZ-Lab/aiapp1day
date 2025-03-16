
/* *************************************************************** */
/* Parameters */
/* *************************************************************** */

@description('Location where all resources will be deployed. This value defaults to the **East US** region.')
@allowed([  
  'eastus'  
  'francecentral'
  'southcentralus'
  'uksouth'
  'westeurope'
])
param location string = 'eastus'

@description('''
Unique name for the deployed services below. Max length 17 characters, alphanumeric only:
- Azure Cosmos DB for MongoDB vCore
- Azure OpenAI Service

The name defaults to a unique string generated from the resource group identifier. Prefixed with
**dg** 'developer guide' as the id may start with a number which is an invalid name for
many resources.
''')
@maxLength(17)
param name string = 'ai-${uniqueString(resourceGroup().id)}'


/* *************************************************************** */
/* Variables */
/* *************************************************************** */

var mongovCoreSettings = {
  cosmosDbName: '${name}-rag'
}


/* *************************************************************** */
/* Azure Cosmos DB for MongoDB vCore */
/* *************************************************************** */

resource cosmosDbRag 'Microsoft.DocumentDB/databaseAccounts@2022-11-15' = {
  name: mongovCoreSettings.cosmosDbName
  location: location
  tags: {
    defaultExperience: 'Core (SQL)'
    'hidden-cosmos-mmspecial': ''
  }
  kind: 'GlobalDocumentDB'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    publicNetworkAccess: 'Enabled'
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    isVirtualNetworkFilterEnabled: false
    virtualNetworkRules: []
    disableKeyBasedMetadataWriteAccess: false
    enableFreeTier: false
    enableAnalyticalStorage: false
    analyticalStorageConfiguration: {
      schemaType: 'WellDefined'
    }
    databaseAccountOfferType: 'Standard'
    defaultIdentity: 'FirstPartyIdentity'
    networkAclBypass: 'None'
    disableLocalAuth: false
    enablePartitionMerge: false
    minimalTlsVersion: 'Tls12'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
      maxIntervalInSeconds: 5
      maxStalenessPrefix: 100
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    cors: []
    capabilities: []
    ipRules: []
    backupPolicy: {
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: 240
        backupRetentionIntervalInHours: 8
        backupStorageRedundancy: 'Geo'
      }
    }
    networkAclBypassResourceIds: []
    capacity: {
      totalThroughputLimit: 4000
    }
  }
}

resource graphragDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-11-15' = {
  parent: cosmosDbRag
  name: 'graphrag'
  properties: {
    resource: {
      id: 'graphrag'
    }
  }
}


resource jobsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-11-15' = {
  parent: graphragDatabase
  name: 'jobs'
  properties: {
    resource: {
      id: 'jobs'
      indexingPolicy: {
        indexingMode: 'consistent'
        automatic: true
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/"_etag"/?'
          }
        ]
      }
      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
        version: 2
      }
      uniqueKeyPolicy: {
        uniqueKeys: []
      }
      conflictResolutionPolicy: {
        mode: 'LastWriterWins'
        conflictResolutionPath: '/_ts'
      }
    }
  }
}

resource containerStoreContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-11-15' = {
  parent: graphragDatabase
  name: 'container-store'
  properties: {
    resource: {
      id: 'container-store'
      indexingPolicy: {
        indexingMode: 'consistent'
        automatic: true
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/"_etag"/?'
          }
        ]
      }
      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
        version: 2
      }
      uniqueKeyPolicy: {
        uniqueKeys: []
      }
      conflictResolutionPolicy: {
        mode: 'LastWriterWins'
        conflictResolutionPath: '/_ts'
      }
    }
  }
}


resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: 'aiapp1dayst${uniqueString(resourceGroup().id)}'
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: true
    isHnsEnabled: false
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
    publicNetworkAccess: 'Enabled'
  }
  
}


resource aiSearch 'Microsoft.Search/searchServices@2024-03-01-preview' = {
  name: '${name}-ais'
  location: location
  sku: {
    name: 'standard'
  }
  properties: {
    disableLocalAuth: false
    replicaCount: 1
    partitionCount: 1
    publicNetworkAccess: 'Enabled'
    semanticSearch: 'disabled'
    authOptions: {
      apiKeyOnly: {}
    }
  }
}


resource registry 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' = {
  name: 'aiapp1dayacr'
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    adminUserEnabled: true
    encryption: {
      status: 'disabled'
    }
    dataEndpointEnabled: false
    publicNetworkAccess: 'Enabled'
    networkRuleBypassOptions: 'AzureServices'
    zoneRedundancy: 'Disabled'
    anonymousPullEnabled: true
    metadataSearch: 'Disabled'
  }
}


// Container App Environment
resource containerAppEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${name}-cae'
  location: location
  properties: {
    zoneRedundant: false
  }
}

// Managed Identity for ACR pull
resource containerAppIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${name}-identity'
  location: location
}

// Container App
resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${name}-ca'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${containerAppIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      activeRevisionsMode: 'Single'
      registries: [
        {
          server: 'aiapp1dayacr.azurecr.io'
          username: 'aiapp1dayacr'
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: 'xxx'
        }
      ]
      ingress: {
        external: true
        targetPort: 80
        transport: 'http'
      }
    }
    template: {
      containers: [
        {
          name: 'graph-rag-backend'
          image: 'aiapp1dayacr.azurecr.io/graph-rag-backend-image:v6'
          resources: {
            cpu: 1
            memory: '2Gi'
          }
          env: [
            {
              name: 'ENV_NAME'
              value: 'env_value'
            }
            {
              name: 'AI_SEARCH_AUDIENCE'
              value: ''
            }
            {
              name: 'AI_SEARCH_URL'
              value: 'https://arg-syd-aiapp1day-ais.search.windows.net'
            }
            {
              name: 'AI_SEARCH_KEY'
              value: 'XXX'
            }
            {
              name: 'APP_INSIGHTS_CONNECTION_STRING'
              value: ''
            }
            {
              name: 'COSMOS_URI_ENDPOINT'
              value: 'https://arg-syd-aiapp1day-rag.documents.azure.com:443/'
            }
            {
              name: 'COSMOS_KEY'
              value: 'XXX'
            }
            {
              name: 'GRAPHRAG_API_BASE'
              value: 'https://arg-syd-aiapp1day-openai.openai.azure.com'
            }
            {
              name: 'GRAPHRAG_API_VERSION'
              value: '2024-08-01-preview'
            }
            {
              name: 'GRAPHRAG_API_KEY'
              value: 'XXX'
            }
            {
              name: 'GRAPHRAG_COGNITIVE_SERVICES_ENDPOINT'
              value: 'https://cognitiveservices.azure.com/.default'
            }
            {
              name: 'GRAPHRAG_LLM_MODEL'
              value: 'gpt-4o'
            }
            {
              name: 'GRAPHRAG_LLM_DEPLOYMENT_NAME'
              value: 'completions'
            }
            {
              name: 'GRAPHRAG_EMBEDDING_MODEL'
              value: 'text-embedding-3-small'
            }
            {
              name: 'GRAPHRAG_EMBEDDING_DEPLOYMENT_NAME'
              value: 'embeddings'
            }
            {
              name: 'REPORTERS'
              value: 'blob,console,app_insights'
            }
            {
              name: 'STORAGE_ACCOUNT_BLOB_URL'
              value: 'https://aiapp1daystcr5qsjmhmj2kc.blob.core.windows.net'
            }
            {
              name: 'STORAGE_ACCOUNT_KEY'
              value: 'XXX'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}
