const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const ErrorHandler = require("../utils/errorHandler");
const db = require("../config/database"); // Ensure to configure your database connection

// Add a new subject marks entry
exports.addSubjectMarksField = catchAsyncErrors(async (req, res, next) => {
  const { class_id, section_id, subject_id, field_name } = req.body;

  const query = `INSERT INTO subject_marks_field (class_id, section_id, subject_id, field_name)
                 VALUES (?, ?, ?, ?)`;

  db.query(
    query,
    [class_id, section_id, subject_id, field_name],
    (err, result) => {
      if (err) {
        console.log(err);
        return next(new ErrorHandler("Error adding subject marks", 500));
      }

      return res.status(201).json({
        success: true,
        message: "Subject marks added successfully",
        id: result.insertId,
      });
    }
  );
});

// Delete a subject marks entry by ID
exports.deleteSubjectMarksField = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const query = `DELETE FROM subject_marks_field WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler("Error deleting subject marks", 500));
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject marks entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject marks entry deleted successfully",
    });
  });
});

// Update a subject marks entry by ID
exports.updateSubjectMarksField = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { total_marks, field_name, field_value } = req.body;

  const query = `UPDATE subject_marks_field SET total_marks = ?, field_name = ?, field_value = ? WHERE id = ?`;

  db.query(query, [total_marks, field_name, field_value, id], (err, result) => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler("Error updating subject marks", 500));
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject marks entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject marks entry updated successfully",
    });
  });
});

// Get all subject marks entries with optional filtering by class and section
exports.getAllSubjectMarksField = catchAsyncErrors(async (req, res, next) => {
  const { class_id, section_id, subject_id } = req.query;

  // Start building the query
  let query = `
    SELECT smf.*, c.class_name, s.section_name, sub.subject_name 
    FROM subject_marks_field smf
    JOIN classes c ON smf.class_id = c.class_id
    JOIN sections s ON smf.section_id = s.section_id
    JOIN subjects sub ON smf.subject_id = sub.subject_id
  `;

  const queryParams = [];

  // Filter by class_id if provided
  if (class_id) {
    query += ` WHERE smf.class_id = ?`;
    queryParams.push(class_id);
  }

  // Filter by section_id if provided
  if (section_id) {
    query += (queryParams.length === 0 ? " WHERE " : " AND ") + `smf.section_id = ?`;
    queryParams.push(section_id);
  }

  // Filter by subject_id if provided
  if (subject_id) {
    query += (queryParams.length === 0 ? " WHERE " : " AND ") + `smf.subject_id = ?`;
    queryParams.push(subject_id);
  }

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler("Error retrieving subject marks", 500));
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  });
});
