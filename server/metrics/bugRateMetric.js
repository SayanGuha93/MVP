const Bug = require("../models/Bug");
const Issue = require("../models/Issue");

const getBugRateMetric = async (req, res) => {
  try {
    const { developer_id } = req.params;

    const bugsByMonth = await Bug.aggregate([
      {
        $match: {
          developer_id: developer_id,
          escaped_to_prod: "Yes",
        },
      },
      {
        $group: {
          _id: { month: "$month_found" },
          escapedBugCount: { $sum: 1 },
        },
      },
    ]);

    const issuesByMonth = await Issue.aggregate([
      {
        $match: {
          developer_id: developer_id,
          status: "Done",
        },
      },
      {
        $group: {
          _id: { month: "$month_done" },
          doneIssueCount: { $sum: 1 },
        },
      },
    ]);

    const issueMap = {};
    issuesByMonth.forEach(({ _id, doneIssueCount }) => {
      issueMap[_id.month] = doneIssueCount;
    });

    const result = bugsByMonth.map(({ _id, escapedBugCount }) => {
      const doneIssueCount = issueMap[_id.month] || 0;
      const bugRate =
        doneIssueCount > 0
          ? parseFloat(((escapedBugCount / doneIssueCount) * 100).toFixed(2))
          : 0;

      return {
        developer_id,
        month: _id.month,
        escapedBugCount,
        doneIssueCount,
        bugRate,
      };
    });

    result.sort((a, b) => (a.month > b.month ? 1 : -1));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating Bug Rate Metric:", error);
    res.status(500).json({ msg: "Error calculating Bug Rate Metric" });
  }
};

module.exports = getBugRateMetric;