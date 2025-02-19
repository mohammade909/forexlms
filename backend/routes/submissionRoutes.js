const express = require("express");
const {
  createSubmission,
  getSubmissions,
  updateSubmission,
  deleteSubmission,
  getSubmissionsByAssignment
} = require("../controllers/submissionController");

const router = express.Router();

router.post("/", createSubmission);
router.get("/", getSubmissions);
router.put("/", updateSubmission);
router.delete("/:submission_id", deleteSubmission);
router.get("/:assignment_id",getSubmissionsByAssignment );

module.exports = router;
