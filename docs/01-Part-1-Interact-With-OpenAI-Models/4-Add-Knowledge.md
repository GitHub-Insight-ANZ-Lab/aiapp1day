# Add knowledge

:::tip Retrieval Augmented Generation
Retrieval-Augmented Generation (RAG) is an AI technique that retrieves relevant information from a database and then uses it to help generate more informed and contextually accurate text responses.
:::

In this lab we are going to add new knowledge to the conversation. This is to illustrate how the process of adding your own data would work in a production scenario. We are going to add the data manually, but you can use many different techniques and tools to retrieve the data and add it to the conversation with the assistant.

## Adding current information:

We are building an AI assistant for a bike store. The assistant should be able to answer questions about the products the store sells. The assistant should only provide information that is available in the store's product database.

A user can ask the assistant for a recommendation for a road bike.

```text title="Enter in the user prompt:"
Can you recommend me a road bike for long rides?
```

You will see that the model will return a lot of great suggestions, but none of them are being sold by our company.

Let's start and fix that problem by giving the model the right information on runtime and without fine-tuning.

First we start with giving the assistant a specific task.

```text title="Enter in the system message:"
You are Contoso Bike Store AI assistant.
You help users answer questions about our bike products.
You will be given search results as retrieved Documents that contain product information.
Your answer should be as precise as possible.
Your answer should only come from the retrieved Documents with product information.
If the Retrieved Documents do not contain sufficient information to answer user message completely, you do not answer the question and inform the user you do not have enough information.

## Retrieved Documents
No information found.
```

```text title="Enter in the user prompt:"
Can you recommend me a road bike for long rides?
```

Notice that the assistant will respond that it has not enough information to answer the question.

Now let's add some product information to the prompt. Imagine here that you have done a search query in a database and got the products below back.

Update the System Message with Retrieved documents:

```text title="Enter in the system message:"
You are Contoso Bike Store AI assistant.
You help users answer questions about our bike products.
You will be given search results as retrieved Documents that contain product information.
Your answer should be as precise as possible.
Your answer should only come from the retrieved Documents with product information.
If the Retrieved Documents do not contain sufficient information to answer user message completely, you do not answer the question and inform the user you do not have enough information.

## Retrieved Documents

Name: Domane SLR 9
Company: Trek
Description: The Domane SLR 9 is a high-performance road bike designed for comfort and speed over long distances. It features Trek's IsoSpeed technology for enhanced vibration dampening and a lightweight carbon frame.

Name: Stumpjumper Expert
Company: Specialized
Description: The Stumpjumper Expert is a versatile mountain bike known for its agility and capability on diverse terrains. It features a full-suspension system and a durable carbon frame, making it ideal for trail riding.

Name: Synapse Carbon 105
Company: Cannondale
Description: The Synapse Carbon 105 is an endurance road bike built for long rides and rough roads. It combines a lightweight carbon frame with endurance geometry for a comfortable and efficient ride.

Name: Bronson CC
Company: Santa Cruz
Description: The Bronson CC is a robust all-mountain bike with a focus on downhill performance. It boasts a carbon frame, advanced suspension system, and aggressive geometry to tackle challenging trails.

Name: Vado SL 4.0
Company: Specialized
Description: The Vado SL 4.0 is an electric bike designed for urban commuting and leisure rides. It features a lightweight aluminum frame, integrated motor, and a long-lasting battery for extended range.

Name: Roadmachine 01
Company: BMC
Description: The Roadmachine 01 is a premium endurance road bike that balances speed and comfort. It comes with a high-quality carbon frame and advanced compliance technologies for smooth rides over long distances.

Name: Trance Advanced Pro 29
Company: Giant
Description: The Trance Advanced Pro 29 is a high-performance trail bike featuring a carbon frame and 29-inch wheels. It's designed for versatility and excels in both climbing and descending.

Name: CrossRip+
Company: Trek
Description: The CrossRip+ is a hybrid electric bike ideal for commuting and adventure rides. It combines the efficiency of a road bike with the durability of a mountain bike, featuring an integrated motor and battery.

```

Clear the conversation and ask the question again.

```text title="Enter in the user prompt:"
Can you recommend me a road bike for long rides?
```

The assistant should recommend you the matching bike from the retrieved documents.

### Retrieval-Augmented Generation

Retrieval-Augmented Generation (RAG) combines a language model with a search system to provide more accurate and detailed information. Here are the steps needed:

1. **Ask a Question**: You start by providing the RAG system with a question or prompt that you want more information about.
2. **Find Relevant Information**: The RAG system searches a large database of texts, like Wikipedia, to find passages that contain useful information related to your question.
3. **Choose the Best Bits**: The system picks the most relevant pieces of information it found during the search to help answer the question.
4. **Generate an Answer**: Using the chosen information, the language model creates a response that includes details from the texts it found, making the answer more accurate and informative.
5. **Deliver the Response**: You receive an answer that's been enhanced with specific information from the search, giving you a better, well-informed reply to your question.
