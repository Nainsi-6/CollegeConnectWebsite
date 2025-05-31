const express = require("express");
const { getAllEvents, createEvent, deleteEvent } = require("../controllers/EventController");
const multer = require("../middleware/multer");

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", multer, createEvent);


router.delete("/:id", deleteEvent);

module.exports = router;
