# Tech Check


## Environment Setup

|Description|URL|Version|
|----|----|----|
|Visual Studio Code|https://code.visualstudio.com/download|1.92.*|
|Node.js|https://nodejs.org/en/download/prebuilt-installer|v20.17.*|


## URLs

|Description|URL|
|----|----|
|Git Repo|https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day.git|
|Prompt Playground|https://arg-syd-aiapp1day-playground.azurewebsites.net|
|Azure OpenAI Endpoint|https://arg-syd-aiapp1day-openai.openai.azure.com|

## Settings and Keys

### MongoDb

|Variable Name| Value|
|----|----|
|MONGODB_CONNECTION_STRING|mongodb+srv://aiapp1dayadmin:Aiapp1daypassword123@arg-syd-aiapp1day-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000&tlsInsecure=true|
|MONGODB_Name|aiapp1day_your_name_your_lucky_number

### Azure

|Variable Name| Value|
|----|----|
|AZURE_OPENAI_API_INSTANCE_NAME|arg-syd-aiapp1day-openai|
|AZURE_OPENAI_API_ENDPOINT|https://arg-syd-aiapp1day-openai.openai.azure.com|
|AZURE_OPENAI_API_KEY|70563d5a57cc45999cdd80b9bf50ed4d|
|AZURE_OPENAI_API_DEPLOYMENT_NAME|completions|
|AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME|embeddings|
|AZURE_OPENAI_API_VERSION|2023-09-01-preview|



## Clone Repo

Create a folder to house the repository. Open a terminal and navigate to the folder.

```bash
c:\
mkdir aiapp1day
cd aiapp1day
git clone https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day.git
```

If you don't have git installed, you can download code as zip from https://github.com/GitHub-Insight-ANZ-Lab/aiapp1day

![alt text](images/gitrepo-zip.png)


### Folder Structure

|Description|Folder|
|----|----|
|apps\chatbot|Frontend App|
|apps\api|Backend API|
|labs\00-Intro|Code for Intro|
|labs\02-Lab|Code for Lab 2|
