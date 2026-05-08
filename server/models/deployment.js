const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema({
    deployment_id: String,

  pr_id: String,

  issue_id: String,

  developer_id: String,

  developer_name: String,

  manager_id: String,

  team_name: String,

  environment: String,

  started_at: String,

  completed_at: String,

  status: String,

  month_deployed: String,

  lead_time_days: String,

  release_type: String,
});

module.exports = mongoose.model("Deployment", deploymentSchema);