
const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Debug - log available controller methods
console.log("Available jobController methods:", Object.keys(jobController));

// Public routes
router.get("/", jobController.getJobs);

// Protected routes
router.get("/recommended", authMiddleware, jobController.getRecommendedJobs);
router.post("/sync-external", authMiddleware, jobController.syncExternalJobs);
router.get("/:jobId", authMiddleware, jobController.viewJob);
router.post("/:jobId/apply", authMiddleware, jobController.applyForJob);
router.put("/preferences", authMiddleware, jobController.updateJobPreferences);

module.exports = router;