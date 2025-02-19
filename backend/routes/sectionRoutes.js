const express = require("express");
const router = express.Router();
const {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
  getSectionsByClassId,
  getSectionDetails
} = require("../controllers/sectionController");

// Create a section
router.post("/", createSection);

// Get all sections
router.get("/", getSections);
router.get("/:section_id", getSectionDetails);

// Get a section by ID
// router.get("/:id", getSectionById);
// router.get("/:class_id", getSectionsByClassId);

// Update a section by ID
router.put("/:id", updateSection);

// Delete a section by ID
router.delete("/:id", deleteSection);

module.exports = router;
