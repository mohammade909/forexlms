const express = require("express");
const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentWithDetailsById,
  getAssignmentsByCourse,
  getSubmissionDetails,
} = require("../controllers/assignmentsController");

const router = express.Router();

router.post("/", createAssignment);
router.get("/", getAssignments);
router.put("/", updateAssignment);
router.get(
  "/:assignment_id/student/:student_id/submissions",
  getSubmissionDetails
);
router.delete("/:assignment_id", deleteAssignment);
router.get("/:id", getAssignmentWithDetailsById);
router.get("/course/:id", getAssignmentsByCourse);

module.exports = router;
