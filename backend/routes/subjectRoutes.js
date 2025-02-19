const express = require("express");
const router = express.Router();
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectsByClassId,
  getSubjectsByTeacherId
} = require("../controllers/subjectController");

// Create a subject
router.post("/", createSubject);

// Get all subjects
router.get("/", getSubjects);
router.get("/class/:classId", getSubjectsByClassId);
router.get("/teacher/:teacherId", getSubjectsByTeacherId);

// Get a subject by ID
router.get("/:id", getSubjectById);

// Update a subject by ID
router.put("/:id", updateSubject);

// Delete a subject by ID
router.delete("/:id", deleteSubject);

module.exports = router;
