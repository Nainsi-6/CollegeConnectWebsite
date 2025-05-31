const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({

  description: String,
  date: { type: Date, default: Date.now, expires: 604800 }, // 7 days (in seconds)
});

module.exports = mongoose.model("Announcement", announcementSchema);
