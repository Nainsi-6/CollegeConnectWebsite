const express = require("express");
const { addAnnouncement, getAnnouncements, deleteAnnouncement } = require("../controllers/announcementController");

const router = express.Router();

router.post("/", addAnnouncement);
router.get("/", getAnnouncements);
router.delete("/:id", deleteAnnouncement);

module.exports = router;
