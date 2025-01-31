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

async function processAllPdfsInFolder(folderPath) {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const extname = path.extname(file).toLowerCase();

        // Check if the file is a PDF
        if (extname === '.pdf') {
            try {
                const fullText = await extractFullTextFromPDF(filePath);
                const jsonData = {
                    "POS system manual": fullText
                };
                const jsonOutputPath = path.join(folderPath, `${path.basename(file, extname)}.json`);
                fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
                console.log(`Successfully converted ${filePath} to ${jsonOutputPath}`);
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error);
            }
        }
    }
}

// Usage
const folderPath = 'POS/'; // Replace with your folder path
processAllPdfsInFolder(folderPath)
    .catch(err => console.error(err));