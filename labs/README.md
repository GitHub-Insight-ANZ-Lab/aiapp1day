
# Lab Outline

todo: i dropped original msft repo readme & license files. we need to add some readme back to declare the codes are from which original repos.



## Tech check

[go to lab](0a-tech-check/README.md)

todo: need to test end to end on a clean pc. maybe use azure windows pc?


## Lab 1 - Prompt Engineering

todo: need to double check content is enough for 2h

### Lab 1a - Deploying Azure Resource via IaC

Duration: 20 minutes demo [go to lab](1a-azure-iac/README.md)

Tenant: Insight AU Demo Pty Ltd
Sub: sub-insight-ais-sbx-01
RG: arg-syd-aiapp1day-lab

todo: this is only a presenter demo. probably record the demo to be safe?
todo: this IaC deployment is to show case how to deploy azure resource. we could have a user IaC template for anyway really want to deploy a app svc (assuming they dont have AOAI enabled).


### Lab 1b - Explore and use Azure OpenAI models from code

Duration: 30 minutes [go to lab](1b-prompt-p1/README.md)

todo: playground app is setup, it can be used for initial prompt exercise (i.e. from UI rather than code). https://arg-syd-aiapp1day-playground.azurewebsites.net/, enter AOAI sub key on top right.
todo: playground app to be adjusted to test out functions (it is a cut down version without backend, use subkey directly)
todo: to add more based on https://microsoft.github.io/Workshop-Interact-with-OpenAI-models/Part-1-labs/Basic-Prompting/

### Lab 1c - More Prompt Engineering

Duration: 30 minutes [go to lab](1c-prompt-p2/README.md)

todo: to be built based on https://microsoft.github.io/Workshop-Interact-with-OpenAI-models/Part-2-labs/System-Message/

### Lab 1d - build a Backend API

Duration: 30 minutes [go to lab](1d-backend-api/README.md)

todo: add a basic AOAI completion api call so that it can be called in swagger directly. 


## Lab 2 - RAG chatbot

### Lab 2a - Load custom data into database

Duration: 30 minutes [go to lab](2a_rag_load_data/README.md)

todo: make json file local and cut down total record count (otherwise embedding gen calc will take long)
todo: could be good to add some data engineering step. i.e. convert excel data into json based. quality of the data is important

### Lab 2b - Vector search based on embedding

Duration: 30 minutes [go to lab](2b_rag_vector_search/README.md)


### Lab 2c - integrate Azure OpenAI with LangChain RAG

Duration: 30 minutes [go to lab](2c_rag_langchain/README.md)
todo: need some clean up to get rid of keyward cosmos_works in file names etc

### Lab 2d - End to end Chatbot Time!

Duration: 30 minutes [go to lab](2d-rag_chatbot/README.md)

todo: add a section to copy 2c code into backend api 
todo: add speech service 
todo: add translation service
todo: add dall-e service


