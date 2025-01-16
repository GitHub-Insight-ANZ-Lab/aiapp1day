---
title: "Challenge 5: SEO"
---

## SEO Content Generation

### Goal

Boost website traffic and search engine rankings with AI-generated content tailored to the audience.

### Challenge

Automate the creation of SEO-optimized content, including keywords, titles, and meta tags, to enhance digital visibility.

### Tips

Write a function to read a web page and convert html to text and summariese it

There is a `SEO` page on chatbot, the page have an input textbox for url, and a button to invoke AI Service and get back a generated SEO content.

Complete the `seoApi` function to send a website url and receive an SEO json.

- Use `axios` to retrieve html for a website
- Extract useful content from the html
- Define a few key SEO attribute you would like the LLM to summarise or generate
- Invoke LLM to get a structured JSON payload back for SEO
- Display the json on the page

### Answer

```
const axios = require('axios');
const cheerio = require('cheerio');
const summarize = require('summarize');

async function fetchWebPage(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching the web page: ${error}`);
        return null;
    }
}

function extractTextFromHTML(html) {
    const $ = cheerio.load(html);
    return $('body').text();
}

function summarizeText(text) {
    const summary = summarize({ text });
    return summary.summary;
}

async function main(url) {
    const html = await fetchWebPage(url);
    if (html) {
        const text = extractTextFromHTML(html);
        const summary = summarizeText(text);
        console.log('Summary:', summary);
    }
}

// Replace 'http://example.com' with the URL of the web page you want to summarize
const url = 'http://example.com';
main(url);

```