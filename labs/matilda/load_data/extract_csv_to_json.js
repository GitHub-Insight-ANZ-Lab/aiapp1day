const fs = require("fs");
const path = require("path");
const rootDir = "input/structured_data/";

// Function to convert CSV to JSON
function csvToJson(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0]
    .split(",")
    .map((header) => header.replace(/"/g, ""));
  const jsonData = lines.slice(1).map((line) => {
    const values = line
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((value) => value.replace(/"/g, ""));
    const obj = {};
    headers.forEach((header, index) => {
      if (header === "tags") {
        // Decode the JSON string
        obj[header] = JSON.parse(values[index].replace(/'/g, '"'));
      } else if (header === "price") {
        // Convert price to integer
        obj[header] = parseFloat(values[index], 10);
      } else {
        obj[header] = values[index];
      }
    });
    return obj;
  });
  return JSON.stringify(jsonData, null, 2);
}

// Function to convert all CSV files in a folder to JSON
function convertAllCsvToJson(folderPath) {
  const files = fs.readdirSync(folderPath);
  const outputFolderPath = 'output/'
  files.forEach((file) => {
    if (path.extname(file) === ".csv") {
      const csvFilePath = path.join(folderPath, file);
      const csvData = fs.readFileSync(csvFilePath, "utf8");
      const json = csvToJson(csvData);
      const jsonFilePath = path.join(outputFolderPath, path.basename(file, ".csv") + ".json");
      fs.writeFileSync(jsonFilePath, json, "utf8");
      console.log(`Converted ${file} to JSON file successfully.`);
    }
  });
}

// Convert all CSV files in the rootDir to JSON
convertAllCsvToJson(rootDir);