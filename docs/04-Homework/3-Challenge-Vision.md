---
title: "Challenge 3: Vision"
---

## Vision for Product Image Processing

### Goal

Provide a seamless and efficient returns experience that meets customer expectations while ensuring operational accuracy.

### Challenge

Leverage AI for product image processing to simplify and improve the returns process, including 4o vision capabilities for analyzing and verifying returned products.

### Tips

Create a new function to ask LLM to understand and extract information from image or photo. 

There is a `Vision` page on chatbot, the page have an image upload button, and a button to invoke AI Service and get back a vision response.

Complete the `visionApi` function to send a prompt with a uploaded image and receive an response that anlysis the features on the photo. the gpt model will describe the content of the image.

- Invoke GPT-4o using OpenAIClient using `image_url` attribute
- GTP-4o's details are on the setup page
- Inspect the response payload of the call
- Retrieve the response and display on the page

### Answer

```
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
```
