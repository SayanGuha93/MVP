const router = require("express").Router();

const getPR = require("../controllers/prController");
const getIssues = require("../controllers/issueController");
const getDeployments = require("../controllers/deploymentController");
const getBugs = require("../controllers/bugController");
const getDevs = require("../controllers/developerController");
const getAdvice = require("../controllers/aiAdvice");

router.get("/Developers",getDevs);
router.get("/Deployments",getDeployments);
router.get("/Bugs",getBugs);
router.get("/Issues",getIssues);
router.get("/PRs",getPR);
router.post("/AI",getAdvice);

module.exports = router;