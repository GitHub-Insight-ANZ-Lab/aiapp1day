# Function Calling

:::tip What is function calling?
GPT-3.5 and GPT-4 models can take user-defined functions as input and generate structured output.
:::

The latest versions of gpt-35-turbo and gpt-4o are fine-tuned to work with functions and are able to both determine when and how a function should be called. If one or more functions are included in your request, the model determines if any of the functions should be called based on the context of the prompt. When the model determines that a function should be called, it responds with a JSON object including the arguments for the function.

The models formulate API calls and structure data outputs, all based on the functions you specify. It's important to note that while the models can generate these calls, it's up to you to execute them, ensuring you remain in control.

At a high level you can break down working with functions into three steps:

- Call the chat completions API with your functions and the user’s input
- Use the model’s response to call your API or function
- Call the chat completions API again, including the response from your function to get a final response

### System Message

First update the system message.

- In this system message explain the goal of the assistant
- Explain the information that needs to be gathered
- Which function to all if all information is gathered

```text title="System Message"
You are Contoso Bike Store AI assistant that helps users with finding the available bikes in the store.
In the conversation with the user, your goal is to retrieve the required fields for the function search_bike.
```

### OpenAI Function

Second paste the json below in the OpenAI Functions functions field.

A function has three main parameters: name, description, and parameters.

Description: The model is to determine when and how to call the function so it's important to give a meaningful description of what the function does.

Parameters: is a JSON schema object that describes the parameters that the function accepts.

```json title="Functions"
[
  {
    "name": "search_bike",
    "description": "Retrieves bikes from the search index based",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "The location of the store (i.e. Seattle, WA)"
        },
        "company": {
          "type": "string",
          "description": "The company of the bike"
        },
        "model": {
          "type": "string",
          "description": "The model of the bike"
        }
      },
      "required": ["location", "company", "model"]
    }
  }
]
```

### Conversation

Now let's start a conversation with the agent.

Ask:

```text title="User Message"
I'm looking for a bike in Seattle store. Can you help me find a bike from Trek company and model Domane SLR 9?
```

The Model has determined that the function `search_bike` should be called based on the user's input. The response will include the arguments for the function `search_bike`. You would use this response and glue the data to function to get the final response.

```json title="Response"
{
  "function": "search_bike",
  "arguments": {
    "location": "Seattle",
    "company": "Trek",
    "model": "Domane SLR 9"
  }
}
```
