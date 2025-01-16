---
title: "Challenge 2: Translation"
---

## Multilingual Review

### Goal

Derive actionable insights from customer reviews to refine product offerings and address quality issues.

### Challenge

Utilize external product reviews to enhance product quality by analyzing sentiment and summarizing key feedback with GPT-4o sentiment detection and feedback summarization.

### Tips

Create function that will take in a non-english customer review and translate it to English. 

There is a `Translation` page on chatbot, the page have an input textbox for user review, and a button to invoke AI Service and get back translated review.

Complete the `translateApi` function to send a customer review in non-english and receive its english translation.

- Invoke Azure translation service using restful call
- Translation service's details are on the setup page
- Inspest the response payload of the the call
- Retrieve translated review and display on the page


### Answer

```
export async function translateApi(text: string, from: string, to: string): Promise<Response> {
    const url = `${BACKEND_URI}/translate`;
    const body = 
    [{
        "text": `${text}`
    }];
    
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}
```
