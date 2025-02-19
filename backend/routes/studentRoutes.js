const express = require("express");
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentByID,
  updateStudent,
  deleteStudent,
  getStudentByUserId,
  getStudentsFeesAndCourses
} = require("../controllers/studentController");

// Route to create a new teacher
router.post("/", createStudent);

// Route to get all teachers
router.get("/", getStudents);
router.get('/fees', getStudentsFeesAndCourses);

// // Route to get a single teacher by ID
router.get("/:student_id", getStudentByID);
router.get("/user/:user_id", getStudentByUserId);

// // Route to update a teacher by ID
router.put("/:student_id", updateStudent);

// // Route to delete a teacher by ID
router.delete("/:student_id", deleteStudent);

module.exports = router;
