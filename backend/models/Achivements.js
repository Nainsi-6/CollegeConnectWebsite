const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: Date, default: Date.now, expires: 604800 }, // Auto-delete after 7 days
});

module.exports = mongoose.model("Achievement", achievementSchema);
