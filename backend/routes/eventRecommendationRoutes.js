const express = require("express");
const router = express.Router();
const eventRecommendationController = require("../controllers/eventRecommendationController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Protected routes
router.get("/recommended", authMiddleware, eventRecommendationController.getRecommendedEvents);
router.get("/:eventId/view", authMiddleware, eventRecommendationController.viewEvent);
router.post("/:eventId/register", authMiddleware, eventRecommendationController.registerForEvent);
router.put("/preferences", authMiddleware, eventRecommendationController.updateEventPreferences);

module.exports = router;