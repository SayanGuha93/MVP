const Issue = require("../models/Issue");

const getCycleTimeMetric = async (req, res) => {
  try {
    const { developer_id } = req.params;

    const result = await Issue.aggregate([
      {
        $match: {
          developer_id: developer_id,
          status: "Done",
        },
      },
      {
        $group: {
          _id: {
            developer_id: "$developer_id",
            developer_name: "$developer_name",
            month: "$month_done",
          },
          totalCycleTimeDays: { $sum: "$cycle_time_days" },
          doneIssueCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          developer_id: "$_id.developer_id",
          developer_name: "$_id.developer_name",
          month: "$_id.month",
          totalCycleTimeDays: 1,
          doneIssueCount: 1,
          avgCycleTimeDays: {
            $cond: [
              { $eq: ["$doneIssueCount", 0] },
              0,
              { $divide: ["$totalCycleTimeDays", "$doneIssueCount"] },
            ],
          },
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating Cycle Time Metric:", error);
    res.status(500).json({ msg: "Error calculating Cycle Time Metric" });
  }
};

module.exports = getCycleTimeMetric;