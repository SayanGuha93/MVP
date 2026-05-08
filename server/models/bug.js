const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema({
  bug_id: String,

  linked_issue_id: String,

  developer_id: String,

  developer_name: String,

  manager_id: String,

  team_name: String,

  found_at: String,

  severity: String,

  escaped_to_prod: String,

  status: String,

  month_found: String,

  root_cause_bucket: String,
});

module.exports = mongoose.model("Bug", bugSchema);