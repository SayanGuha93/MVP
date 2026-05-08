const XLSX = require("xlsx");
const path = require("path");

// Workbook path
const workbookPath = path.join(
  __dirname,
  "../data/raw/intern_assignment_Data.xlsx"
);

//"W:\MVP\server\data\raw\intern_assignment_Data.xlsx.xlsx"

// Read workbook
const workbook = XLSX.readFile(workbookPath);

// Get all sheet names
const sheetNames = workbook.SheetNames;

console.log("Available Sheets:");
console.log(sheetNames);

// Loop through sheets
sheetNames.forEach((sheetName) => {
  console.log("\n====================");
  console.log(`Sheet: ${sheetName}`);
  console.log("====================");

  // Get sheet
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet into JS objects
  const data = XLSX.utils.sheet_to_json(sheet);

  // Print first 3 rows
  console.log(data.slice(0, 3));
});