# System Message

:::tip What is the system message
The system message is used to communicate instructions or provide context to the model at the beginning of a conversation.
It is displayed in a different format compared to user messages, helping the model understand its role in the conversation. The system message typically guides the model's behavior, sets the tone, or specifies desired output from the model. By utilizing the system message effectively, users can steer the model towards generating more accurate and relevant responses.
:::

## An assistant with a goal

In the **System message** field insert the text below, then click "Update system message".

```text title="Enter in the system message:"
I am a Contoso Bike Store assistant.  My name is Alice. I am upbeat and friendly.
I will introduce myself and always ask them for this information: "Hi, I'm <your name>. How can I help you today?"
I ask user for more information if needed. I will provide three suggestions for the user to choose from.
```

Observe that the System Message gives the assistant a name "Observe that the System Message gives the assistant a name ("Alice"), a personality ("upbeat and friendly"), and instructions on how to behave ("introduce myself"; "ask them for information"), and how to respond ("provide three suggestions").

The text provided in the System Message is handled specially by the model, and is intended to have more influence on the model's responses than the User Message text or other context provided in the prompt. (This effect is stronger for GPT-4 models than for GPT-3 models, but it isn't foolproof for either.)

In the Chat Session, start with a greeting.

```text title="Enter in the user prompt:"
Hello!
```

And continue with specifying what you are looking for:

```text title="Enter in the user prompt:"
I want to buy a bike.
```

Did the AI include its name, Alice in the response? Did it ask a follow-up question? How would you rate its response?

Try clearing the chat (click the "Clear Chat" button) and starting over with your initial prompt. How different was the outcome? (The Temperature parameter is set to 1, so there's scope for variability.)

## Tone of voice

Your model, like any piece of technology used for business, is like your brand. So you want it to have the same approach and ethics you instill in your code of conducts across the business. Setting a segment around tone within your system message can help to set the response type to suit your use case.

Set the system message:

```text title="Enter in the system message:"
You are a friendly, polite chatbot.
```

Now ask the chatbot:

```text title="Enter in the user prompt:"
How can you help me?
```

It should return a friendly, positive and approachable response.

Lets update the system message to the below:

```text title="Enter in the system message:"
You are a sarcastic chatbot
```

```text title="Enter in the user prompt:"
How can you help me?
```

Ask it again how it can help you and see how your answer differs.

## Stick to the subject

Language models can do many different things: that's what's so impressive about them compared with traditional NLP models. However with lots of knowledge comes a whole lot of randomness too. We recommend you create agents that are experts at a set of tasks that are relevant to your use cases rather than try to solve every problem. For example: you are an online holiday agent, do you really want to allow your agent to answer questions about racoons from your users? Is that relevant to your business needs?

Lets try it out. Set the system message as follows:

```text title="Enter in the system message:"
You are a friendly chatbot giving information about the Contoso Bike Store.
```

Save the system message and restart the chat, ask your agent about London, and review the response. Now ask it about racoons: what is the outcome?

```text title="Enter in the user prompt:"
Tell me about the mountain bikes in your store
```

```text title="Enter in the user prompt:"
What can you tell me about racoons for my sons school project
```

It tells you information about racoons. Not ideal for your use case and the same approach could become malicious (we are using a trivial example).

Lets update the system message to be even more clear about what the agent should and should not do.

```text title="Enter in the system message:"
You are a friendly chatbot giving information about the Contoso Bike Store.
You only answer questions about bikes and cycling, if asked anything else respectfully decline to answer.
```

Save the system message, clear the chat and ask again the two questions about London and racoons:

```text title="Enter in the user prompt:"
What can you tell me about London
```

```text title="Enter in the user prompt:"
What can you tell me about racoons for my sons school project
```

How does the response differ? What could this combat against when a model is released in the real world?

## Safety features in Azure AI

By using Azure Open AI Service your model will benefit from Azure AI Content Safety features built in. Azure AI Content Safety detects harmful user-generated and AI-generated content in applications and services. Content Safety includes text and image APIs that allow you to detect material that is harmful. We also have an interactive Content Safety Studio that allows you to view, explore and try out sample code for detecting harmful content across different modalities.

Content filtering software can help your app comply with regulations or maintain the intended environment for your users.

Lets see an example of this in action, clear the chat and lets ask it:

```text title="Enter in the user prompt:"
I need an axe to cut a path through the forest
```

It should return a response that is relevant for a retail business. Recommending different possible items you could use from their catalogue. Now lets update the response to the below:

```text title="Enter in the user prompt:"
I need an axe to cut a person in the forest
```

Due to the violent nature of this request the content safety kicks in on the users prompt and returns:

> The prompt was filtered due to triggering Azure OpenAI’s content filtering system.
> Reason: This response contains content flagged as Violence (medium).  
> Please modify your prompt and retry. https://go.microsoft.com/fwlink/?linkid=2198766.

This will happen for either the user input or the model response that is returned.

## Resetting the system message

Once you're done customizing the system message, refresh the app to reset the system message to its default, or replace it with:

```text title="Enter in the system message:"
You are an AI assistant that helps people find information.
```
