const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const client = new OpenAIClient(
    "https://arg-syd-aiapp1day-openai.openai.azure.com",
    new AzureKeyCredential("70563d5a57cc45999cdd80b9bf50ed4d")
);

// code block from earlier step
//   const chatResponse = client.getChatCompletions("completions", [
//     { role: "user", content: "What are the different types of road bikes?" },
//   ]);

//   const chatResponse = client.getChatCompletions("completions", [
//     {
//       role: "system",
//       content:
//         "You are a helpful, fun and friendly sales assistant for Contoso Bike Store, a bicycle and bicycle accessories store.",
//     },
//     { role: "user", content: "Do you sell bicycles?" },
//   ]);

// code block from earlier step
// const chatResponse = client.getChatCompletions("completions", [
//     {
//         role: "system",
//         content:
//             "You are a helpful, fun and friendly sales assistant for Contoso Bike Store, a bicycle and bicycle accessories store.",
//     },
//     { role: "user", content: "Do you sell bicycles?" },
//     {
//         role: "assistant",
//         content:
//             "Yes, we do sell bicycles. What kind of bicycle are you looking for?",
//     },
//     {
//         role: "user",
//         content: "I'm not sure what I'm looking for. Could you help me decide?",
//     },
// ]);

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

// code block from earlier step
//   chatResponse
//   .then((result) => {
//     for (const choice of result.choices) {
//       console.log(choice.message.content);
//     }
//   })
//   .catch((err) => console.log(`Error: ${err}`));

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

