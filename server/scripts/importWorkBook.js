const path = require("path");

// Load environment variables
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const XLSX = require("xlsx");

// Models
const Developer = require("../models/Developer");
const Issue = require("../models/Issue");
const PullRequest = require("../models/PR");
const Deployment = require("../models/Deployment");
const Bug = require("../models/Bug");

// ===============================
// CONNECT MONGODB
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:");
    console.log(error);
  });

// ===============================
// WORKBOOK PATH
// ===============================

const workbookPath = path.join(
  __dirname,
  "../data/raw/intern_assignment_Data.xlsx"
);

// ===============================
// READ WORKBOOK
// ===============================

const workbook = XLSX.readFile(workbookPath);

// ===============================
// REUSABLE IMPORT FUNCTION
// ===============================

const importCollection = async (
  sheetName,
  Model
) => {
  try {
    console.log(`\nImporting ${sheetName}...`);

    // Get worksheet
    const sheet = workbook.Sheets[sheetName];

    // Check if sheet exists
    if (!sheet) {
      console.log(
        `Sheet "${sheetName}" not found`
      );

      return;
    }

    // Convert sheet to JSON
    const data =
      XLSX.utils.sheet_to_json(sheet);

    console.log(
      `${data.length} records found`
    );

    // Clear old collection data
    await Model.deleteMany();

    // Insert new data
    await Model.insertMany(data);

    console.log(
      `${sheetName} imported successfully`
    );
  } catch (error) {
    console.log(
      `Error importing ${sheetName}`
    );

    console.log(error);
  }
};

// ===============================
// MAIN IMPORT FUNCTION
// ===============================

const importWorkbook = async () => {
  try {
    console.log(
      "\nStarting Workbook Import...\n"
    );

    console.log("Available Sheets:");
    console.log(workbook.SheetNames);

    // Import collections
    await importCollection(
      "Dim_Developers",
      Developer
    );

    await importCollection(
      "Fact_Jira_Issues",
      Issue
    );

    await importCollection(
      "Fact_Pull_Requests",
      PullRequest
    );

    await importCollection(
      "Fact_CI_Deployments",
      Deployment
    );

    await importCollection(
      "Fact_Bug_Reports",
      Bug
    );

    console.log(
      "\nWorkbook Import Completed Successfully"
    );

    process.exit();
  } catch (error) {
    console.log(
      "\nWorkbook Import Failed"
    );

    console.log(error);

    process.exit(1);
  }
};

// ===============================
// RUN SCRIPT
// ===============================

importWorkbook();