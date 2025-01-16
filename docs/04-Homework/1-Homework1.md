---
title: "Homework"
slug: /homework1
---

## Challenge #1 Product Design ?

Goal: (session 1, high value)
Develop visually appealing designs that align with brand values while maintaining compliance with ethical content standards.

Challenge: 
Enhance product design creativity by leveraging AI-powered tools like DALL-E to create innovative artwork and ensure content safety using advanced safeguards.

Note: invoke dall-e api to create an image based on description. I will create a new page on chatbot, the page will have a simple input box for text description, then a button to call dall-e and get back a generated image.



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


