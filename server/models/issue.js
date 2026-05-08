const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issue_id: String,

  developer_id: String,

  developer_name: String,

  manager_id: String,

  team_name: String,

  service_type: String,

  issue_type: String,

  story_points: Number,

  created_at: Date,

  in_progress_at: Date,

  code_complete_at: Date,

  done_at: Date,

  status: String,

  month_done: String,

  cycle_time_days: Number,
});

module.exports = mongoose.model("Issue", issueSchema);
