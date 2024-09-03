# Prompt engineering techniques

:::tip Do OpenAI models learn?
OpenAI models like GPT-3 do not learn or adapt during user interactions. They generate responses based on pre-training with a large dataset and do not update their knowledge from individual conversations. Any improvements or updates to the model's capabilities are made through a controlled retraining process by OpenAI, not through real-time learning.
:::

This section discusses prompt engineering techniques that can help LLMs solve certain problems more effectively.

## Zero-shot learning

LLMs are trained on such large amounts of data they may be be able to perform some tasks with very little prompting. Try the example below and change the sentence to see what outcomes you find.

```text title="Enter in the user prompt:"
Classify the text into neutral, negative or positive.
Text: The Contoso Bike Store is a great place to buy a new bike.
Sentiment:
```

## Few-shot learning

If zero-shot learning is failing for your examples and more complex tasks, few shot prompting can provide examples that can better steer the model to the desired outcomes. Examples show the model cleanly how we want it to operate. Try the example below to see the outcome. Can you think of other examples that could leverage few-shot learning?

```text title="Enter in the user prompt:"
Headline: "Contoso Bike Store opens new location in Seattle"
Sentiment: Positive
Headline: "Contoso Bike Store announces new product line"
Sentiment: Neutral
Headline: "Contoso Bike Store recalls faulty bikes"
Sentiment: Negative
Headline: "Contoso Bike Store wins award for best customer service"
Sentiment:
```

The next two sections are very well described in the ['Meet Mr Prompty'](https://www.linkedin.com/pulse/meet-mr-prompty-break-tasks-down-chain-thought-dynamic-mario-fontana/?trackingId=%2FzJrYZ06TxWwVVLkU7rxug%3D%3D) articles on LinkedIn, thank you author, Mario Fontana, for sharing your insights.

## Chain of thought prompting

In this technique, the LLM is responsible for breaking the task down into smaller steps. The LLM uses its knowledge of the world and its ability to reason. The LLM then generates a chain of thoughts that leads to the solution of the task.

```text title="Enter in the user prompt:"
I like to ride my bike around the city, but I'm not sure if I should buy a new one or repair my old one. Can you help me decide?
Take a step-by-step approach in your response, cite sources, and give reasoning before sharing a final answer in the below format: ANSWER is: <name>
```

:::info[Assignment]
Create a prompt for the assistant that helps determine the best way of traveling between Amsterdam and London and explain why.
:::

```

```
