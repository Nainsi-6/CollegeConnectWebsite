const Event = require("../models/Event");
const cloudinary = require("../utils/cloudinaryConfig");
const getDataUrl = require("../utils/urlGenerator");

// Fetch all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    console.log("Received Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { title, organizedBy, date, time, venue, googleFormLink } = req.body;
    let image = null;

    if (!title || !date || !time || !venue) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    if (req.file) {
      const dataUri = getDataUrl(req.file); // Convert file to Data URI
      const uploadResponse = await cloudinary.uploader.upload(dataUri, { folder: "events" });
      image = uploadResponse.secure_url;
    }

    const newEvent = new Event({ title, organizedBy, date, time, venue, image, googleFormLink });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};