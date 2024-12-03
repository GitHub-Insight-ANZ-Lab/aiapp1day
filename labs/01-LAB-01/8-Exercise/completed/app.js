const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const prompt = require("prompt-sync")({ sigint: true });

async function main() {
  let livinRoomLight = "off";
  let bedroomLight = "off";
  let kitchenLight = "off";

  const client = new OpenAIClient(
    "https://<AZURE_OPENAI_API_INSTANCE_NAME>.openai.azure.com/",
    new AzureKeyCredential("<AZURE_OPENAI_API_KEY>")
  );

  const deploymentId = "completions";
  console.log("The chatbot is ready. Type 'exit' to quit.");

  const getLightStatus = {
    name: "get_light_status",
    description: "Retrieves the status of a light",
    parameters: {
      type: "object",
      properties: {
        roomName: {
          type: "string",
          description: "The room where the light is located",
        },
      },
      required: ["roomName"],
    },
  };

  const setLightStatus = {
    name: "set_light_status",
    description: "Sets the status of a light",
    parameters: {
      type: "object",
      properties: {
        roomName: {
          type: "string",
          description: "The room where the light is located",
        },
        status: {
          type: "string",
          description: "The status of the light",
        },
      },
      required: ["roomName", "status"],
    },
  };

  const options = {
    tools: [
      {
        type: "function",
        function: getLightStatus,
      },
      {
        type: "function",
        function: setLightStatus,
      },
    ],
  };

  function applyToolCall({ function: call, id }) {
    if (call.name === "get_light_status") {
      const { room_name } = JSON.parse(call.arguments);
      let status = "off";
      if (room_name === "Living Room") {
        status = livinRoomLight;
      } else if (room_name === "Bedroom") {
        status = bedroomLight;
      } else if (room_name === "Kitchen") {
        status = kitchenLight;
      }

      return {
        role: "tool",
        content: status,
        toolCallId: id,
      };
    } else if (call.name === "set_light_status") {
      const { room_name, status } = JSON.parse(call.arguments);
      if (room_name === "Living Room") {
        livinRoomLight = status;
      } else if (room_name === "Bedroom") {
        bedroomLight = status;
      } else if (room_name === "Kitchen") {
        kitchenLight = status;
      }

      return {
        role: "tool",
        content: "ok",
        toolCallId: id,
      };
    }

    throw new Error(`Unknown tool call: ${call.name}`);
  }

  while (true) {
    var userInput = prompt("User:");
    if (userInput === "exit") {
      break;
    }

    const chatResponse = await client.getChatCompletions(
      "completions",
      [
        {
          role: "system",
          content:
            "You are a home assistant that can control lights at home. The available lights are Living Room Light`, `Bedroom Light`, and `Kitchen Light. Before changing the lights, you may need to check their current state. Avoid telling the user numbers like the saturation, brightness,and hue; instead, use adjectives like 'bright' or 'dark'.",
        },
        { role: "user", content: userInput },
      ],
      options
    );

    // console.log(chatResponse.choices);
    for (const choice of chatResponse.choices) {
      const responseMessage = choice.message;
      if (responseMessage?.role === "assistant") {
        const requestedToolCalls = responseMessage?.toolCalls;
        if (requestedToolCalls?.length) {
          const toolCallResolutionMessages = [
            responseMessage,
            ...requestedToolCalls.map(applyToolCall),
          ];

          const result = await client.getChatCompletions(
            deploymentId,
            toolCallResolutionMessages
          );

          console.log(result.choices[0].message.content);
        } else {
          console.log(responseMessage.content);
        }
      }
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
