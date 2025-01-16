---
title: "Homework"
slug: /homework1
---

## Challenge #2 Product Quality via Reviews

Goal: (session 1, high value)
Derive actionable insights from customer reviews to refine product offerings and address quality issues.

Challenge: 
Utilize external product reviews to enhance product quality by analyzing sentiment and summarizing key feedback with GPT-4o sentiment detection and feedback summarization.

Note: create an api endpoint that will take in a non-english customer review and access it. Return with a json structure data. More about prompt engineering.



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
