const express = require("express");
const router = express.Router();

const { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } = require("../controllers/announcementsController");

// Route to create an announcement
router.post("/", createAnnouncement);

// Route to get all announcements
router.get("/", getAnnouncements);

// Route to update an announcement by ID
router.put("/:id", updateAnnouncement);

// Route to delete an announcement by ID
router.delete("/:id", deleteAnnouncement);

module.exports = router;
