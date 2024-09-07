# App Deployment

Let's now deploy Chatbot FrontEnd and BackEnd to Azure App Service.

## Deploy Chatbot BackEnd API to Azure App Service

1. Install `Azure App Service` extension in Vs Code

   ![alt text](images/deploy-image.png)

2. Sign in to Azure in the Azure tab

   ![alt text](images/deploy-image-1.png)

3. Expand `App Services` node in your `subscription` 

   ![alt text](images/deploy-image-2.png)

4. Right click `App Service` name and select 'Deploy to Web App..`

   ![alt text](images/deploy-image-3.png)

5. Select Browse in the dropdownlist and locate `apps\api` folder

   ![alt text](images/deploy-image-4.png)

6. Select `Deploy` if below popup shows. Check the progress in VS Code's `Azure` tab

   ![alt text](images/deploy-image-5.png)

7. Once completed, you can find api app url in your Azure Portal under the `App Service`

   ![alt text](images/deploy-image-6.png)

   :::info
   The VS Code deployment only upload code to `App Service`, there will be additional build activity running in the server side. Check progress in `Deployment Center`.
      
   ![alt text](images/deploy-image-7.png)
   :::

8. Open the Url in browser and add path `\docs` to access the swagger.


## Deploy Chatbot FrontEnd to Azure App Service

1. Repeat above steps and deploy `apps\chatbot` folder

2. Once completed, you can find chatbot app url in your Azure Portal under the `App Service`

3. Open the chatbot url in your browser and try out the prompts.

   :::info
   If you see an error in the chatbot, check if you have the backend API url configured correctly. 
   :::

4. Now, you have deployed your chatbot to Azure! Congrat !!

   :::info
   Forget to mention, there is also a CORS error. Please try and uncomment the line configuring CORS. :p
   :::

5. Now, you have **successfully** deployed your chatbot to Azure! Congrat !!