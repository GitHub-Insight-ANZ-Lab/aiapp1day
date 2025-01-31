const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const client = new OpenAIClient(
    "https://arg-syd-aiapp1day-openai.openai.azure.com/",
    new AzureKeyCredential("e4e18d6e8fc44398b8571c9ba419bf84")
  );


//   const chatResponse = client.getChatCompletions("completions", [
//     { role: "user", content: "What are the different menus in POS system LUCAS?" },
//   ]);
const chatResponse = client.getChatCompletions("completions", [
    {
      role: "system",
      content:
        "You are a friendly chatbot giving information about the a POS System LUCAS. You only answer questions about POS systems and retail stores, if asked anything else respectfully decline to answer.",
    },
    { role: "user", content: "Do you know how to use POS ?" },
  ]);
  

  chatResponse
  .then((result) => {
    for (const choice of result.choices) {
      console.log(choice.message.content);
    }
  })
  .catch((err) => console.log(`Error: ${err}`));


 