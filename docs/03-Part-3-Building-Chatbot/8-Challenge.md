# Coding Challenge 2

On Azure, there are more Azure AI service could you use. Please give it a try yourself. There are some code snippets provided below, see if you can get them working!


## Azure OpenAI Service - Dall-e 3

We can call Dall-e to generate an image, just like how we did in Playground in lab 1.

```javascript
(async () => {
    const { OpenAIClient, AzureKeyCredential } = await import("@azure/openai");

    async function dalleApi(prompt) {
        const options = {
            api_version: "2023-12-01-preview"
        };
        const size = '1024x1024';
        const n = 1;
        const client = new OpenAIClient(
            `https://arg-syd-aiapp1day-openai.openai.azure.com`,
            new AzureKeyCredential("<add key>"),
            options
        );

        const deploymentName = 'dalle3';
        const result = await client.getImages(deploymentName, prompt, { n, size });
        console.log(JSON.stringify(result, null, 2));
        return result.data[0].url;
    }

    const prompt = "A futuristic cityscape at sunset";
    const imageUrl = await dalleApi(prompt);
    console.log(`Generated image URL: ${imageUrl}`);
})();
```




## Azure OpenAI Service - Vision

Interested to ask LLM module a question about Photo? Try out the vision feature. Rather than a url, the image can be encoded and send with API call too.

```javascript

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

async function CompletionApi(prompt) {
    const options = {
        api_version: "2023-12-01-preview"
    };
    const client = new OpenAIClient(
        `https://arg-syd-aiapp1day-openai.openai.azure.com`,
        new AzureKeyCredential("<add key>"),
        options
    );

    const deploymentName = 'completions';
    const result = await client.getChatCompletions(deploymentName, prompt);
    console.log(JSON.stringify(result, null, 2));
    return ;
}

(async () => {
    const prompt = [
        { "role": "system", "content": "You are a helpful assistant." },
        {
            "role": "user", "content": [
                {
                    "type": "text",
                    "text": "Describe this picture:"
                },
                {
                    "type": "image_url",
                    "imageUrl": {
                        "url": `<image url>`
                    }
                }
            ]
        }
    ];

    const response = await CompletionApi(prompt);
    console.log(response);
})();

```


## Azure AI Translator

In order to use `Translator`, you will need to deploy cognitive service first. See if you can find out how to create the service in Azure portal. 

```javascript
(async () => {
    const { OpenAIClient, AzureKeyCredential } = await import("@azure/openai");
    const fetch = (await import('node-fetch')).default;

    async function translateApi(text) {
        const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=fr&from=en`;
        const body = [{
            "text": text
        }];
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Region": "eastus",
                "Ocp-Apim-Subscription-Key": "<add your key>"
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    }
    
    await translateApi('hey i like azure ai apps');

})();

```