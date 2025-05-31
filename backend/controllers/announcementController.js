const Announcement = require("../models/Announcement");

const addAnnouncement = async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        const announcement = new Announcement({ description });
        await announcement.save();

        return res.status(201).json({ message: "Announcement added successfully", announcement });
    } catch (error) {
        console.error("Error adding announcement:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { addAnnouncement };

  

// Get All Announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addAnnouncement, getAnnouncements, deleteAnnouncement };
