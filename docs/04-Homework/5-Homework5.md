---
title: "Homework"
slug: /homework1
---

## Challenge #5: Content Automation for SEO

Goal: (session 3, high value)
Boost website traffic and search engine rankings with AI-generated content tailored to K audience.

Challenge: 
Automate the creation of SEO-optimized content, including keywords, titles, and meta tags, to enhance digital visibility.

Note: a new page will take a url as input and read the website content and provide seo suggestion. I will create a new page on chatbot, it will take a url as input and a button to retrieve response. 


write node code to read a web page and convert html to text and summariese it


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

