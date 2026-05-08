require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/API',require("./routes/routes"));
app.use('/Profile',require("./routes/metricRoutes"));

app.listen(process.env.PORT, () => {
  console.log("Server Running");
});