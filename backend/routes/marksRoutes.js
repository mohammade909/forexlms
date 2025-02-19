
const express = require("express");
const { 
  updateSubjectMarks,
  getClassDetails,
  getStudentDetails,
  getAllStudentsDetails

} = require("../controllers/marksController"); // Adjust the path as necessary

const router = express.Router();

// Create a new marks entry

// Get marks entry by ID


// Update a marks entry
router.post("/", updateSubjectMarks);
router.get("/", getClassDetails);
router.get("/student/:studentId", getStudentDetails);
router.get("/students", getAllStudentsDetails);

// Delete a marks entry

module.exports = router;
