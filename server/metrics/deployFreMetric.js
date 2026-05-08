const Deployment = require("../models/Deployment");

const getDeploymentFrequencyMetric = async (req, res) => {
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
          deploymentCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          developer_id: "$_id.developer_id",
          developer_name: "$_id.developer_name",
          month: "$_id.month",
          deploymentCount: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating Deployment Frequency Metric:", error);
    res.status(500).json({ msg: "Error calculating Deployment Frequency Metric" });
  }
};

module.exports = getDeploymentFrequencyMetric;