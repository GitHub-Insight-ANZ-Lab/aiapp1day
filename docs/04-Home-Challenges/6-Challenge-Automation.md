---
title: "Challenge 6: Automation"
---

## Store Automation

### Goal

Improve operational efficiency and minimize manual workload by implementing automation solutions that can assist with store manual processes.​

### Challenge

Leverage LLM function-calling mechanisms to automate repetitive in-store tasks, improving accuracy, reducing labor-intensive efforts, and streamlining overall operations to achieve increased productivity.​

### Tips

Create a task automation feature to replace one current manual store process. Be creative!

The `Home Automation` challege provides a good fundation of this challenge. You can start with its code and find a new idea that might help with any store operations.

   :::info
   
   More things to think about

   - Consider using Sementic Kernal framework
   - Best way to trigger the automation workflow (time trigger or events)

   :::

### Basic Solution

<details>
    <summary>Code snippet for above challenge</summary>
    <details>
    <summary>Don't Look! Have you tried to solve it yourself?</summary>
    <details>
    <summary>Your solution will be better than our sample answer!</summary>

    The basic solution is provided below. Feel free to expand on it to make it more interesting!
    
    ```
    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    const prompt = require("prompt-sync")({ sigint: true });

    async function main() {
      let livinRoomLight = "off";
      let bedroomLight = "off";
      let kitchenLight = "off";

      const client = new OpenAIClient(
        "https://arg-syd-aiapp1day-openai.openai.azure.com/",
        new AzureKeyCredential("<API_KEY>")
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
    ```

    </details>
    </details>
</details>