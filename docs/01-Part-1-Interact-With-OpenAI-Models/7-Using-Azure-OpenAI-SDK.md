# Using Azure OpenAI SDK

:::tip Azure OpenAI SDK
Azure OpenAI SDK is a set of libraries that allow you to interact with Azure OpenAI services from your code. The SDK are available for multiple programming languages, including Python, Node.js, and C#.
:::

In this lab, you will learn how to use the Azure OpenAI SDK to interact with Azure OpenAI services from your code using Node.js.

## Setup Node.js project

1. Open `Terminal` in VS code. Create a new directory `labs\openai-nodejs` and navigate to the directory:

```bash
cd labs
mkdir openai-nodejs
cd openai-nodejs
```

![alt text](images/creatfolder.png)

2. Run the following command to create a new Node.js project:

```bash
npm init -y
```

3. When integrating Azure OpenAI service in a solution written in Node.js, the OpenAI NPM client library is used.
   Install the latest openai client library using `npm`:

```bash
npm install @azure/openai@1.0.0-beta.11
```

4. Locate `openai-nodejs` folder in VS code `Explorer`. Create a new `app.js` file for the Node.js program, and add the following variable definition using `require` to use the OpenAI library.

```javascript
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
```

5. Create the Azure OpenAI client to call the Azure OpenAI Chat completion API. Have a look at Azure OpenAI service endpoint (e.g.: https://arg-syd-aiapp1day-openai.openai.azure.com), and Azure OpenAI service key in the code below. Then copy below Javascript code into `app.js`.

:::info
More information on the Azure OpenAI client methods can be found in the [@azure/openai package](https://learn.microsoft.com/en-us/javascript/api/%40azure/openai/?view=azure-node-preview) documentation. 
:::

```javascript
  const client = new OpenAIClient(
    "https://<AZURE_OPENAI_API_INSTANCE_NAME>.openai.azure.com/",
    new AzureKeyCredential("<AZURE_OPENAI_API_KEY>")
  );
```

5. Once the Azure OpenAI client has been created, the next step is to call the `.getCompletions` method on the client to perform a chat completion.

```javascript
const chatResponse = client.getChatCompletions("completions", [
  { role: "user", content: "What are the different types of road bikes?" },
]);
```

6. Print the response from Azure OpenAI to the console.

```javascript
chatResponse
  .then((result) => {
    for (const choice of result.choices) {
      console.log(choice.message.content);
    }
  })
  .catch((err) => console.log(`Error: ${err}`));
```

6. Open terminal window in VS code, and run below command. You should see the response from the Azure OpenAI service in the console.

```
node app.js
```

Try the other examples in the next sections to see how you can interact with Azure OpenAI models from your code.

## System Message

You can set the system message to provide context to the conversation. The system message can be set using the `role: "system"`. If you see an error saying `variable already exists or defined`, please replace the code in earlier step with new code block.

```javascript
const chatResponse = client.getChatCompletions("completions", [
  {
    role: "system",
    content:
      "You are a helpful, fun and friendly sales assistant for Contoso Bike Store, a bicycle and bicycle accessories store.",
  },
  { role: "user", content: "Do you sell bicycles?" },
]);
```

## Conversation History

You can send previous chat history to the model as part of the conversation. This can help the model provide more accurate responses.

```javascript
const chatResponse = client.getChatCompletions("completions", [
  {
    role: "system",
    content:
      "You are a helpful, fun and friendly sales assistant for Contoso Bike Store, a bicycle and bicycle accessories store.",
  },
  { role: "user", content: "Do you sell bicycles?" },
  {
    role: "assistant",
    content:
      "Yes, we do sell bicycles. What kind of bicycle are you looking for?",
  },
  {
    role: "user",
    content: "I'm not sure what I'm looking for. Could you help me decide?",
  },
]);
```

## Function Calling

You can call a function from the model to perform a specific task. The available functions are passed to the model. The model analyzes the conversation history and decides when and how to call the function. The model also extracts the required parameters for the function from the conversation history.

In the following example, the model calls the `search_bike` function to retrieve bikes from the search index based on the location, company, and model of the bike. 

1. Add the function `searchBikeStore` in `app.js` file:

```javascript
const searchBikeStore = {
  name: "search_bike",
  description: "Retrieves bikes from the search index based",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The location of the store (i.e. Seattle, WA)",
      },
      company: {
        type: "string",
        description: "The company of the bike",
      },
      model: {
        type: "string",
        description: "The model of the bike",
      },
    },
    required: ["location"],
  },
};
```

2. Call the chat completions API, by passing the `searchBikeStore` function.

```javascript
const options = {
    tools: [
        {
            type: "function",
            function: searchBikeStore,
        },
    ],
};

const chatResponse = client.getChatCompletions("completions", [
    {
        role: "system",
        content:
            "You are a helpful, fun and friendly sales assistant for Contoso Bike Store, a bicycle and bicycle accessories store.",
    },
    {
        role: "user",
        content:
            "I'm looking for a bike in Seattle store. Can you help me find a bike from Trek company and model Domane SLR 9?",
    },
], options);
```

3. The response message includes one or more "tool calls" that must be resolved via "tool messages". Add the following function to handle the request from the model to invoke the function.

```javascript
// Purely for convenience and clarity, this function handles tool call responses.
function applyToolCall({ function: call, id }) {
    if (call.name === "search_bike") {
        console.log('[applyToolCall] invoked');
        const { location, company, model } = JSON.parse(call.arguments);
        // In a real application, this would be a call an external service or database.
        return {
            role: "tool",
            content: `The bike from ${company} company and model ${model} is available in ${location} store.`,
            toolCallId: id,
        };
    }
    throw new Error(`Unknown tool call: ${call.name}`);
}
```

4. Print the final response from the tool call to the console. In some cases, you may need to send the response from the tool back to the model along with the original conversation history to get the final response.

```javascript

chatResponse
    .then(async (result) => {

        console.log('[chatResponse]:' + JSON.stringify(result));
        console.log('')
        console.log('[chatResponse][Message]:' + JSON.stringify(result.choices[0].message));
        console.log('')

        for (const choice of result.choices) {
            const responseMessage = choice.message;

            if (responseMessage?.role === "assistant") {
                const requestedToolCalls = responseMessage?.toolCalls;
                if (requestedToolCalls?.length) {
                    const toolCallResolutionMessages = [
                        responseMessage,
                        ...requestedToolCalls.map(applyToolCall),
                    ];

                    console.log('[toolCallResolutionMessages]:' + JSON.stringify(toolCallResolutionMessages));
                    console.log('')

                    const result = await client.getChatCompletions('completions', toolCallResolutionMessages);
                    console.log('[chatResponse_with_toolcall]:' + JSON.stringify(result));
                    console.log('')
                    console.log('[chatResponse_with_toolcall][Message]:' + JSON.stringify(result.choices[0].message));
                    console.log('')
                }
            }
        }
    })
    .catch((err) => console.log(`Error: ${err}`));
```

:::tip
Where do you think the actual `applyToolCall` execution is? on the server-side or client-side?
:::
