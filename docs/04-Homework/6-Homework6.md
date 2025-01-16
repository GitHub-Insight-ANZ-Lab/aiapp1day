---
title: "Homework"
slug: /homework1
---

## Challenge #6 Enhancing the Returns Experience

Goal: (session 1, medium value)
Provide a seamless and efficient returns experience that meets customer expectations while ensuring operational accuracy.

Challenge: 
Leverage AI for product image processing to simplify and improve the returns process, including 4o vision capabilities for analyzing and verifying returned products.

Note: use 4o api call with a base64 image, the gpt model will describe the content of the image. I will create a new page on chatbot with a file selection. Participant needs to figure out how to attach image to the call.


export async function visionApi(prompt: string[]): Promise<Completions> {
    const options = {
        api_version: "2024-08-01-preview"
      };

    const client = new OpenAIClient(
        `${BACKEND_URI}/vision`,
        new AzureKeyCredential("-"),
        options
      );
      // ?api-version=2023-12-01-preview
      const deploymentName = 'completions';
      const result = await client.getChatCompletions(deploymentName, prompt, {
        maxTokens: 200,
        temperature: 0.25
      });
      return result.choices[0].message.content;
}

