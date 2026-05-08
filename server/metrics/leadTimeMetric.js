const Deployment = require("../models/Deployment");

const getLeadTimeMetric = async (req, res) => {
  try {
    const { developer_id } = req.params;

    const result = await Deployment.aggregate([
      {
        $match: {
          developer_id: developer_id,
          environment: "prod",
          status: "success",
        },
      },
      {
        $group: {
          _id: {
            developer_id: "$developer_id",
            developer_name: "$developer_name",
            month: "$month_deployed",
          },
          totalLeadTimeDays: {
            $sum: { $toDouble: "$lead_time_days" },
          },
          prodDeploymentCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          developer_id: "$_id.developer_id",
          developer_name: "$_id.developer_name",
          month: "$_id.month",
          totalLeadTimeDays: 1,
          prodDeploymentCount: 1,
          avgLeadTimeDays: {
            $cond: [
              { $eq: ["$prodDeploymentCount", 0] },
              0,
              { $divide: ["$totalLeadTimeDays", "$prodDeploymentCount"] },
            ],
          },
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating Lead Time Metric:", error);
    res.status(500).json({ msg: "Error calculating Lead Time Metric" });
  }
};

module.exports = getLeadTimeMetric;