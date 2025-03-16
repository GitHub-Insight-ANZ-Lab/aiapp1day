const fs = require("fs");
const path = require("path");
const rootDir = "data";

// Read CSV file
const csvFilePath = path.join(rootDir, "product.csv");
const csvData = fs.readFileSync(csvFilePath, "utf8");

// Convert CSV to JSON
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

const json = csvToJson(csvData);

// Write JSON to file
const jsonFilePath = path.join(rootDir, "product.json");
fs.writeFileSync(jsonFilePath, json, "utf8");

console.log("CSV file has been converted to JSON file successfully.");