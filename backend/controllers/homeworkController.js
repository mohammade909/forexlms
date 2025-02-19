const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");  // Assuming you have a DB configuration module

// Submit Homework
exports.submitHomework = catchAsyncErrors(async (req, res, next) => {
  const { student_id, class_id, title, description } = req.body;
  let fileUrl = null;

  // Handle file upload
  if (req.files && req.files.file) {
    const file = req.files.file;

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new ErrorHandler("Invalid file type", 400));
    }

    // Sanitize and define file path
    const sanitizedFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "homeworks",
      sanitizedFileName
    );

    // Save file to destination
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("Error saving file: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }
    });

    fileUrl = sanitizedFileName;
  }

  // Insert into database
  const query = `
    INSERT INTO homeworks (student_id, class_id, title, description, file_url, submission_date)
    VALUES (?, ?, ?, ?, ?, NOW())`;
  const values = [student_id, class_id, title, description, fileUrl];

  db.query(query, values, (err, result) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ message: "Homework submitted successfully" });
  });
});

// Get Homework by Class
exports.getHomeworkByClass = catchAsyncErrors(async (req, res, next) => {
  const { class_id } = req.params;

  const query = `
    SELECT * FROM homeworks
    WHERE class_id = ?
    ORDER BY due_date DESC`;

  db.query(query, [class_id], (err, results) => {
    if (err) {
      return next(err);  // Pass the error to error handling middleware
    }
    res.status(200).json({ homework: results });
  });
});

// Get Homework by Student
exports.getStudentHomework = catchAsyncErrors(async (req, res, next) => {
  const { student_id } = req.params;

  const query = `
    SELECT * FROM homeworks
    WHERE student_id = ?
    ORDER BY submission_date DESC`;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      return next(err);  // Pass the error to error handling middleware
    }
    res.status(200).json({ homework: results });
  });
});

// Update Homework (Grade, Feedback, Status)
exports.updateHomework = catchAsyncErrors(async (req, res, next) => {
  const { homework_id } = req.params;
  const { grade, feedback, status } = req.body;

  const query = `
    UPDATE homeworks
    SET grade = ?, feedback = ?, status = ?, updated_at = NOW()
    WHERE homework_id = ?`;

  db.query(query, [grade, feedback, status, homework_id], (err, result) => {
    if (err) {
      return next(err);  // Pass the error to error handling middleware
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Homework not found' });
    }
    res.status(200).json({ message: 'Homework updated successfully' });
  });
});

// Delete Homework
exports.deleteHomework = catchAsyncErrors(async (req, res, next) => {
  const { homework_id } = req.params;

  const query = `
    DELETE FROM homeworks
    WHERE homework_id = ?`;

  db.query(query, [homework_id], (err, result) => {
    if (err) {
      return next(err);  // Pass the error to error handling middleware
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Homework not found' });
    }
    res.status(200).json({ message: 'Homework deleted successfully' });
  });
});
