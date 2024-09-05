# Basic Prompting

:::tip What is prompt engineering?
Prompt engineering is a concept in Natural Language Processing (NLP) that involves **embedding descriptions of tasks** in input to **prompt the model** to output the **desired results**.
:::

Lets start with a few prompts and observe the response using the chat interface.

:::info
To start, select `completions` in the `Model` dropdown list on the right top corner under `Configuration`.
:::

Here are some examples to try, but get creative with your own prompts and see what happens!

```text title="Enter in the user prompt:"
What are the different types of road bikes?
```

```text title="Enter in the user prompt:"
How much does a mountain bike cost?
```

```text title="Enter in the user prompt:"
What are the top 5 mountain bike brands?
List the brand name and the country of origin.
Rank the brands from 1 to 5 in the list.
```

## Generating novel content

Even though the outputs are generated based on frequencies of similar content in the training data, generative AI models are still capable of generating novel content that has never existed before.

Try a prompt like this:

```text title="Enter in the user prompt:"
Write a limerick about a bike.
```

How was the limerick? If you didn't like it, you can always ask the chat session to generate a new one.

Next lets check out the parameters we have available: Use the Temperature field on the right column of the chat interface, and set Temperature to zero. What do you observe when you retry the prompt?

The Temperature parameter controls how "creative" the model is allowed to be. At low values of "Temperature", the model is very likely to respond with the completion with the highest weight, limiting the variability in the responses. At higher values of Temperature, low-weighted completions become more likely to be generated, allowing for more creative (but less precise) responses.

Here is another prompt to try with different Temperature values:

```text title="Enter in the user prompt:"
What is a unique and long name for a new bike brand?
```

:::info
When dealing with LLMs, the results can be unpredictable. Changing the temperature here might or might not work as expected. Also, we are using a relatively old version of GPT3.5. The temperature effect is more visible in more recent LLMs such as GPT4.
:::

**Make sure the Temperature parameter is reset to 0.7 before you continue.**

## Information extraction

The example below shows how you can combine a prompt with data to extract information using natural-language instructions. In this case, the completion extracts the bicycle model, company name, and country. Modify the prompt and the source data to extract different information.

```
Extract the bicycle model, company name, country from the text below.

Specialized Tarmac, produced by Specialized Bicycle Components, an American company based in Morgan Hill, California. First introduced in 2003, the Tarmac has become renowned for its performance and innovation in the competitive cycling world. The bike features a lightweight carbon fiber frame, advanced aerodynamics, and cutting-edge engineering designed to enhance speed and handling. Over the years, the Tarmac has undergone numerous updates and refinements, consistently earning accolades for its performance in professional racing, including several victories in prestigious events like the Tour de France. The Specialized Tarmac remains a top choice for serious road cyclists and professional racers globally.
```

## Structured data extraction

In this example, we provide freeform narrative about different bicycle types and ask the model to create a markdown table and a JSON array summarizing the information.

In this example, we "primed" the model with the desired output format: a header row, and a couple of examples.

```
Road bikes, known for their speed and efficiency on paved roads, are crafted by Italian companies like Bianchi, Pinarello, and Colnago, as well as American brands such as Trek, Specialized, and Cannondale. Mountain bikes, built for rough terrain, are produced by American firms like Specialized and Santa Cruz, Canadian brands Rocky Mountain and Norco, and German companies Canyon and Cube. Hybrid bikes, versatile for commuting and leisure, are made by American brands like Trek and Cannondale, UK companies Boardman and Raleigh, and German manufacturers Cube and Canyon. Gravel bikes, suited for mixed terrain, are crafted by American brands like Trek and Cannondale, UK companies Ribble and Genesis, and German manufacturers Canyon and Cube. Cyclocross bikes, designed for cyclocross racing, are produced by American brands Trek and Cannondale, Belgian company Ridley, and French brand Look. BMX bikes, small and robust for stunts and racing, are made by American companies Haro and Mongoose, UK brand WeThePeople, and Australian company Colony.

Please create a table summarizing the bikes in a markdown table shown as code. The header row should include the columns: Type, Company, Country.
```

Try extending the prompt by appending the following text:

```
Please also make a JSON array summarizing the bikes:
```

The model will now return a JSON array of the bikes and their attributes.

## Text Classification

In this example, we provide one example of a text classification task: classifying a piece of text as a good or bad review of a bike.

```text title="Enter in the user prompt:"

Classify the following text as a good or bad review of a bike:

"The Contoso 1482 is a fantastic bike. It's incredibly fast and responsive, with a lightweight frame that makes climbing hills a breeze. The bike is also very comfortable, even on long rides. I've been riding the Tarmac for a few months now, and I couldn't be happier with it."
Category: Good review

"The Contoso 1482 is a terrible bike. It's slow and unresponsive, with a heavy frame that makes climbing hills a nightmare."
```

```text title="Enter in the user prompt:"
"The Contoso 1482 met all my expectations. It's a great bike for the price, and I've had a lot of fun riding it."

```

## Text summarization

Text summarization is a well known capability of ChatGPT - it creates a short summary of a larger piece of text. Add tl;dr (for "too long; didn't read") to gain a summary of the article below.

```text title="Enter in the user prompt:"

Contoso Bike was found in 1999 by John Doe. The company has grown to become one of the leading bike manufacturers in the world. The company is known for its innovative designs and high-quality products.
The company uses eco-friendly materials and manufacturing processes to reduce its carbon footprint. Contoso Bike is also involved in various community projects and charities to give back to the community.

At Contoso Bikes, we're committed to providing the best cycling experience for our customers. Our bikes are designed with the latest technology and materials to ensure optimal performance and comfort. Whether you're a professional racer or a casual rider, we have the perfect bike for you. Our team of experts is dedicated to helping you find the right bike for your needs and budget. We also offer a wide range of accessories and gear to enhance your cycling experience. Visit us today to see our latest models and take a test ride. We look forward to helping you find the perfect bike for your cycling adventures.

```

## Conversation History

Natural language generative AI models like GPT-3.5 are stateless, meaning they don't have memory of prior interactions. This means that each prompt is treated as a standalone request, and the model doesn't have context from previous prompts. This can lead to inconsistent or unexpected responses, especially in a conversational context.

Try the following prompts:

```text title="Enter in the user prompt:"
What is the model of the bicycle I bought last year?
```

You will get a response like this:

```text title="Response from the model:"
I’m sorry, but I don’t have access to specific customer purchase history or personal data.
```

Now, clear the chat and try the following prompt:

```text title="Enter in the user prompt:"
I bought the Contoso 1482 last year. It's a great bike.
```

And then continue with the following prompts:

```text title="Enter in the user prompt:"
What is the model of the bicycle I bought last year?
```

What do you observe? You will now see that the model is able to respond with the model of the bike you mentioned in the previous prompt. This is because the application is sending all the previous chat history to the model as part of the prompt.

:::info
Open `Developer Tools` in Chrome and switch to `Network` tab, inspect the Http request Payloads and Responses. All of your `Conversation History` are sent to API during each chat turn.
:::

## Less-useful prompts

Natural language generative AI models have a number of limitations:

- They are limited by their training data, which was frozen at a fixed point in time in the past.
- They generate text that resembles human language, but are not capable of reasoning or cognition.
- They have no memory of prior prompts (if chat is cleared), and no capability to learn or change their behavior.

Here are some example prompts that demonstrate these weaknesses:

```text title="Enter in the user prompt:"
Where did the last Olympics take place?
```

In this case, the model is limited by training data, which is current only up to June 2021.

```text title="Enter in the user prompt:"
What is the square root of 98765?
```

The model will generate an answer to math questions, but there's no guarantee it will be correct. The correct answer here (to 3 dp) is 314.269. Try clearing the Chat and then submitting the same prompt again and see if you get the same answer. (If you do get the correct response to a math question from a foundational GPT model, it's only because the question and answer are well represented in the training data.)

But you could ask the model to write Python code to calculate the square root of 98765, and it would probably do a good job. (Try it!).

```text title="Enter in the user prompt:"
Write Python code to calculate the square root of 98765
```

## Generative AI models can't perform actions

Clear the contents of the chat box. Enter the following text:

```text title="Enter in the user prompt:"
What are the 5 stocks listed on https://finance.yahoo.com/trending-tickers with the largest market cap?
```

Although the model will respond with a plausible answer, look closely: those aren't actually the 5 largest stocks today. Foundational AI models are not capable of performing actions, so they can't actually visit the web page and read the list of stocks. Instead, they generate a plausible response based on the prompt and the training data.

:::info
To overcome this, we will discuss `Function Calling` later.
:::

## Completions are not facts

Clear the contents of the prompt box. Enter the following text, then click `Send`.

```text title="Enter in the user prompt:"
Write a short summary of the famous cyclist, Harold Bloomsbury. Please include references.
```

There has never been a cyclist (nor indeed any person, according to web search) named Harold Bloomsbury. As a result, the model will generate a fictional summary of a fictional person.
As we've seen, natural language Generative AI models can produce unexpected or unwanted responses to prompts. This can be caused by any number of factors, including:

- Insufficient information in the training data
- Insufficient context in the prompt
- Lack of capability of the model itself
- Hostile intent by the user providing the prompt ("jailbreaking")

Prompt Engineering is a complex and rapidly-evolving practice. [This article](https://learn.microsoft.com/azure/cognitive-services/openai/concepts/advanced-prompt-engineering) on Microsoft Learn provides the latest guidance.

In the next labs we are going to learn how to steer the models to create the response we want.
