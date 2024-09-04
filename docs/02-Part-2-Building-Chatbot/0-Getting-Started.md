---
title: Getting Started
slug: /lab2-setup
---

:::info LAB PRE-REQUISITES

- VS Code
- Node.js 18.x or later
- Azure OpenAI API Key
- Access to Azure Cosmos DB

  :::

## Introduction

For this lab, you will be building a chatbot that uses Azure Cosmos DB for MongoDB's vector search capabilities and Azure OpenAI services to create a conversational experience. The chatbot will be able to retrieve documents from Azure Cosmos DB using vector search and provide responses to user queries using Azure OpenAI services.

## Architecture Overview

![Solution Architecture Diagram](images/architecture.jpg)

The Front-end Web App is a static SPA application written in React. Since React is outside the scope of this guide, the source code for the Front-end Web App is provided for you. The Front-end Web App communicates with the Node.js backend API, which you will build in this lab.

The Node.js backend API is responsible for generating responses to user queries. It queries Azure Cosmos DB to extract relevant documents using vector search and then uses Azure OpenAI services to generate responses to user queries.

## Provision Azure resources (Optional)

:::info

The Azure resources required for this lab have already been provisioned for you.

:::

If you would like to provision the resources yourself, follow the instructions on the lab guide - [Deployment Guide](https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day/blob/main/labs/02-LAB-02/0-Deployment/README.md)



# Azure Deployment Guide

## Prerequisites

- Owner on Azure subscription
- Account approved for Azure OpenAI service
- Azure CLI installed
- Azure PowerShell installed

## Clone the repository

Open a terminal and navigate to `labs/02-LAB-02/deploy` folder within the repository.

Open the `azuredeploy.parameters.json` file, then edit the `mongoDbPassword` to a password you wish to use for the MongoDB Admin User:

![editing the azuredeploy.parameters.json file with mongoDBPassword parameter highlighted](images/editor-azuredeploy-parameters-json-password.png)

When the Azure Bicep template is deployed, this parameters file will be used to configure the Mongo DB Password and other parameters when provisioning the Azure resources.

## Login to Azure

Open a terminal window and log in to Azure using the following command:

```Powershell
Connect-AzAccount
```

### Set the desired subscription (Optional)

If you have more than one subscription associated with your account, set the desired subscription using the following command:

```Powershell
Set-AzContext -SubscriptionId <subscription-id>
```

## Create resource group

```Powershell
New-AzResourceGroup -Name mongo-devguide-rg -Location 'eastus'
```

## Deploy using bicep template

Deploy the solution resources using the following command (this will take a few minutes to run):

```Powershell
New-AzResourceGroupDeployment -ResourceGroupName mongo-devguide-rg -TemplateFile .\azuredeploy.bicep -TemplateParameterFile .\azuredeploy.parameters.json -c
```
