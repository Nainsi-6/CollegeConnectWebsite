const Achievement = require("../models/Achivements");


// Add an achievement
const addAchievement = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const achievement = new Achievement({ description });
    await achievement.save();

    res.status(201).json({ message: "Achievement added successfully", achievement });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get all achievements
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an achievement
const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const achievement = await Achievement.findByIdAndDelete(id);
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    res.status(200).json({ message: "Achievement deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addAchievement, getAchievements, deleteAchievement };
