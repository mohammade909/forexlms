const express = require("express");
const router = express.Router();
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherByUserId
} = require("../controllers/teacherController");

// Route to create a new teacher
router.post("/", createTeacher);

// Route to get all teachers
router.get("/", getTeachers);

// Route to get a single teacher by ID
router.get("/:teacherId", getTeacherById);
router.get("/user/:userId",getTeacherByUserId);

// Route to update a teacher by ID
router.put("/:teacherId", updateTeacher);

// Route to delete a teacher by ID
router.delete("/:teacherId", deleteTeacher);

module.exports = router;
