const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function extractFullTextFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    // Extracting full text content from the PDF
    const text = data.text;
    return text;
}

function extractHeadingsAndContent(text) {
    const lines = text.split('\n');
    const jsonData = [];
    let currentHeading = null;
    let currentContent = '';
    const maxTokens = 8000;

    lines.forEach((line) => {
        // Check if the line is a heading (uppercase or title case) preceded by digits
        const headingPattern = /^[0-9.]*\s*([A-Z][A-Z\s]*|[A-Z][a-z]+(?: [A-Z][a-z]+)*)$/;
        const match = line.trim().match(headingPattern);
        if (match) {
            if (currentHeading) {
                addContentToJsonData(jsonData, currentHeading, currentContent, maxTokens);
            }
            currentHeading = match[1].replace(/\s+/g, '_');
            currentContent = '';
        } else if (currentHeading) {
            currentContent += ' ' + line.trim();
        }
    });

    if (currentHeading) {
        addContentToJsonData(jsonData, currentHeading, currentContent, maxTokens);
    }

    return jsonData;
}

function addContentToJsonData(jsonData, heading, content, maxTokens) {
    const tokens = content.split(/\s+/);
    let part = 1;
    while (tokens.length > 0) {
        const chunk = tokens.splice(0, maxTokens).join(' ');
        const key = part === 1 ? heading : `${heading}_${part}`;
        const obj = {};
        obj[key] = chunk;
        jsonData.push(obj);
        part++;
    }
}

async function processAllPdfsInFolder(folderPath) {

    const outputFolderPath = 'output/'

    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const extname = path.extname(file).toLowerCase();

        // Check if the file is a PDF
        if (extname === '.pdf') {
            try {
                const fullText = await extractFullTextFromPDF(filePath);
                const jsonData = extractHeadingsAndContent(fullText);
                const jsonOutputPath = path.join(outputFolderPath, `${path.basename(file, extname)}.json`);
                fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
                console.log(`Successfully converted ${filePath} to ${jsonOutputPath}`);
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error);
            }
        }
    }
}

// Usage
const folderPath = 'input/document_data/'; // Replace with your folder path
processAllPdfsInFolder(folderPath)
    .catch(err => console.error(err));