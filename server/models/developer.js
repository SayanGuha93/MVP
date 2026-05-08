const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
  developer_id: String,

  developer_name: String,

  manager_id: String,

  manager_name: String,

  team_name: String,

  service_type: String,

  level: String,
});

module.exports = mongoose.model("Developer", developerSchema);