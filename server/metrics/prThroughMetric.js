const PR = require("../models/PR");

const getPRThroughputMetric = async (req, res) => {
  try {
    const { developer_id } = req.params;

    const result = await PR.aggregate([
      {
        $match: {
          developer_id: developer_id,
          status: "merged",
        },
      },
      {
        $group: {
          _id: {
            developer_id: "$developer_id",
            developer_name: "$developer_name",
            month: "$month_merged",
          },
          mergedPRCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          developer_id: "$_id.developer_id",
          developer_name: "$_id.developer_name",
          month: "$_id.month",
          mergedPRCount: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating PR Throughput Metric:", error);
    res.status(500).json({ msg: "Error calculating PR Throughput Metric" });
  }
};

module.exports = getPRThroughputMetric;