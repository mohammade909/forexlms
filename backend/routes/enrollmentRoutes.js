const express = require("express");
const router = express.Router();
const {
  getAllEnrollments,
  getEnrollmentsByStudentID,
  getAllEnrollmentsByCourse,
} = require("../controllers/enrollmentsController"); // Update the path to match your project structure

// Route to get all enrollments
router.get("/", getAllEnrollments);

// Route to get enrollments by student ID
router.get("/:student_id", getEnrollmentsByStudentID);
router.get("/course/:course_id", getAllEnrollmentsByCourse);

module.exports = router;
