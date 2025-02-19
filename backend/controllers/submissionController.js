const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");
const path = require("path");
const fs = require("fs");
// Create a new submission


exports.createSubmission = catchAsyncErrors(async (req, res) => {
  const { assignment_id, student_id } = req.body;

  try {
    if (!req.files || !req.files.file_url) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Extract the uploaded file
    const file = req.files.file_url;

    // Sanitize file name: Convert to lowercase, replace spaces with underscores
    const sanitizedFileName = file.name.toLowerCase().replace(/\s+/g, "_");

    // Generate a unique filename
    const fileName = `${Date.now()}-${sanitizedFileName}`;

    // Define the upload directory (without combining __dirname with an absolute path)
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "submissions"
    );

    // Check if the directory exists; if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Define the full upload path
    const uploadPath = path.join(uploadDir, fileName);

    // Move the file to the designated folder
    await file.mv(uploadPath);

    // Generate the file URL (adjust the base URL as needed)
    const file_url = `${req.protocol}://${req.get(
      "host"
    )}/submissions/${fileName}`;
    console.log(file_url);

    // Insert submission into the database
    const query = `
      INSERT INTO submissions (assignment_id, student_id, file_url) 
      VALUES (?, ?, ?)`;

    const result = await new Promise((resolve, reject) => {
      db.query(
        query,
        [assignment_id, student_id, file_url],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    res.status(201).json({
      message: "Submission created successfully.",
      submission_id: result.insertId,
      file_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});
// Get all submissions
exports.getSubmissions = catchAsyncErrors(async (req, res) => {
  try {
    const query = `SELECT * FROM submissions`;

    const submissions = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

exports.getSubmissionsByAssignment = catchAsyncErrors(async (req, res) => {
  try {
    const { assignment_id } = req.params;

    if (!assignment_id) {
      return res.status(400).json({ message: "Assignment ID is required" });
    }

    const query = `
      SELECT 
        submissions.submission_id,
        submissions.assignment_id,
        submissions.student_id,
        submissions.submitted_at,
        submissions.file_url,
        submissions.grade,
        submissions.feedback,
        submissions.status,
        submissions.updated_at,
        students.first_name,
        students.last_name,
        students.student_code,
        students.phone
      FROM submissions
      INNER JOIN students ON submissions.student_id = students.student_id
      WHERE submissions.assignment_id = ?
    `;

    const submissions = await new Promise((resolve, reject) => {
      db.query(query, [assignment_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update a submission
exports.updateSubmission = catchAsyncErrors(async (req, res) => {
  const { submission_id, grade, feedback, status } = req.body;

  try {
    const query = `
      UPDATE submissions 
      SET grade = ?, feedback = ?, status = ? 
      WHERE submission_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(
        query,
        [grade, feedback, status, submission_id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    res.status(200).json({ message: "Submission updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a submission
exports.deleteSubmission = catchAsyncErrors(async (req, res) => {
  const { submission_id } = req.params;

  try {
    const query = `DELETE FROM submissions WHERE submission_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(query, [submission_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(200).json({ message: "Submission deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
