const router = require("express").Router();

const getLeadTimeMetric = require("../metrics/leadTimeMetric");
const getCycleTimeMetric = require("../metrics/cycleTimeMetric");
const getDeploymentFrequencyMetric = require("../metrics/deployFreMetric");
const getPRThroughputMetric = require("../metrics/prThroughMetric");
const getBugRateMetric = require("../metrics/bugRateMetric");

// Developer profile metric routes
router.get("/:developer_id/lead-time",getLeadTimeMetric);
router.get("/:developer_id/cycle-time",getCycleTimeMetric);
router.get("/:developer_id/deployment-frequency",getDeploymentFrequencyMetric);
router.get("/:developer_id/pr-throughput",getPRThroughputMetric);
router.get("/:developer_id/bug-rate",getBugRateMetric);

module.exports = router;