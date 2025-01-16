---
title: "Challenge 1: Design"
---

## Product Design

### Goal

Develop visually appealing designs that align with brand values while maintaining compliance with ethical content standards.

### Challenge

Enhance product design creativity by leveraging AI-powered tools like DALL-E to create innovative artwork and ensure content safety.

### Tips

Invoke dall-e model to create an cretivity product design based on product team's description. 

There is a `Image` page on chatbot, the page have an input textbox for description, and a button to invoke AI Service and get back a generated image.

Complete the `dalleApi` function to send a prompt and receive an generated image.

- Invoke dall-e details using OpenAIClient
- Dall-e model's details are on the setup page
- Inspect the response payload of the call
- Retrieve the generated image and display on the page

### Answer

```
export async function dalleApi(prompt: string): Promise<Completions> {
    const options = {
        api_version: "2023-12-01-preview"
      };
    const size = '1024x1024';
    const n = 1;
    const client = new OpenAIClient(
        `${BACKEND_URI}/dalle`,
        new AzureKeyCredential("-"),
        options
      );
      // ?api-version=2023-12-01-preview
      const deploymentName = 'dalle3';
      const result = await client.getImages(deploymentName, prompt, { n, size });
      console.log(result);
      return result.data[0].url;
}
```
