const express = require("express");
const { addAchievement, getAchievements, deleteAchievement } = require("../controllers/achievementController");

const router = express.Router();

router.post("/", addAchievement);
router.get("/", getAchievements);
router.delete("/:id", deleteAchievement);

module.exports = router;
