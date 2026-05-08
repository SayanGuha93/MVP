const mongoose = require("mongoose");

const prSchema = new mongoose.Schema({
  pr_id: String,

  issue_id: String,

  developer_id: String,

  developer_name: String,

  manager_id: String,

  team_name: String,

  opened_at: String,

  first_review_at: String,

  approved_at: String,

  merged_at: String,

  status: String,

  month_merged: String,

  review_wait_hours: String,

  merge_time_hours: String,

  lines_changed: String,

  review_rounds: String,
});

module.exports = mongoose.model("PR", prSchema);
