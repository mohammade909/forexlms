const express = require("express");
const router = express.Router();
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  getClassBySectionId,
  getClassByInstructor
} = require("../controllers/classController");

// Route to create a new teacher
router.post("/", createClass);

// // Route to get all teachers
router.get("/", getClasses);

// // Route to get a single teacher by ID
router.get("/:id", getClassById);
router.get("/instructor/:instructorId", getClassByInstructor);

// // Route to update a teacher by ID
router.put("/:id", updateClass);

// // Route to delete a teacher by ID
router.delete("/:id", deleteClass);

module.exports = router;
