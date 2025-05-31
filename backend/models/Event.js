const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizedBy: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String },
  googleFormLink: { type: String },
});

module.exports = mongoose.model("Event", eventSchema);
