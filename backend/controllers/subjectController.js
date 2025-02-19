const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");

// CREATE Subject
const sanitizeTableName = (name) => {
  return name.replace(/[^a-zA-Z0-9_]/g, '_'); // Replace non-alphanumeric characters with underscores
};

exports.createSubject = catchAsyncErrors(async (req, res, next) => {
  const subjectFields = req.body;

  const insertSubjectQuery = "INSERT INTO subjects SET ?";

  // Insert the subject details into the 'subjects' table
  db.query(insertSubjectQuery, subjectFields, (err, result) => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler("Error creating subject", 500));
    } else {
      const subject_id = result.insertId; // Get the inserted subject's ID
      const subjectTableName = sanitizeTableName(req.body.subject_name); // Sanitize the subject name

      // Create the subject-specific table with class_id, student_id, section_id, marks, and remarks
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${subjectTableName} (
          record_id INT AUTO_INCREMENT PRIMARY KEY,
          class_id INT NOT NULL,
          exam_id INT NOT NULL,
          student_id INT DEFAULT NULL,
          section_id INT NOT NULL,
          marks DECIMAL(5,2),
          remarks VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
          FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE,
          FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
        )
      `;

      // Execute the query to create the new table for the subject
      db.query(createTableQuery, (err, result) => {
        if (err) {
          console.log(err);
          return next(new ErrorHandler("Error creating subject table", 500));
        } else {
          return res.status(201).json({
            success: true,
            message: "Subject and subject table created successfully",
            subject_id: subject_id,
            table_name: subjectTableName,
          });
        }
      });
    }
  });
});


// GET All Subjects
exports.getSubjects = catchAsyncErrors(async (req, res, next) => {
  const { class_id, section_id } = req.query; // Get class_id and section_id from query params

  let query = `
    SELECT 
      s.subject_id, s.subject_name, s.subject_code, s.subject_teacher, s.book_name,
      s.class_id, s.section_id, s.created_at, s.updated_at,
      c.class_name, sec.section_name,
      t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
    FROM subjects s
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN sections sec ON s.section_id = sec.section_id
    LEFT JOIN teachers t ON s.subject_teacher = t.teacher_id
  `;

  const queryParams = [];

  // Add filtering conditions based on query parameters
  if (class_id) {
    query += ` WHERE s.class_id = ?`;
    queryParams.push(class_id);
  }

  if (section_id) {
    query += (queryParams.length === 0 ? ' WHERE ' : ' AND ') + `s.section_id = ?`;
    queryParams.push(section_id);
  }

  // Execute the query with the conditionally added filters
  db.query(query, queryParams, (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching subjects", 500));
    } else {
      return res.status(200).json({
        success: true,
        subjects: results,
      });
    }
  });
});


// GET Subject by ID
exports.getSubjectById = catchAsyncErrors(async (req, res, next) => {
  const subjectId = req.params.id;

  const query = `
    SELECT s.subject_id, s.subject_name, s.subject_code, s.subject_teacher, s.book_name,
           s.class_id, s.section_id, s.created_at, s.updated_at,
           c.class_name, sec.section_name
    FROM subjects s
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN sections sec ON s.section_id = sec.section_id
    WHERE s.subject_id = ?
  `;

  db.query(query, [subjectId], (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching subject", 500));
    } else if (results.length === 0) {
      return next(new ErrorHandler("Subject not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        data: results[0],
      });
    }
  });
});
exports.getSubjectsByClassId = catchAsyncErrors(async (req, res, next) => {
  const classId = req.params.classId; // Get classId from request params

  const query = `
    SELECT s.subject_id, s.subject_name, s.subject_code, s.subject_teacher, s.book_name,
           s.class_id, s.section_id, s.created_at, s.updated_at,
           c.class_name, sec.section_name
    FROM subjects s
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN sections sec ON s.section_id = sec.section_id
    WHERE s.class_id = ?
  `;

  db.query(query, [classId], (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching subjects", 500));
    } else if (results.length === 0) {
      return next(new ErrorHandler("No subjects found for the provided class", 404));
    } else {
      return res.status(200).json({
        success: true,
        subjects: results,
      });
    }
  });
});
exports.getSubjectsByTeacherId = catchAsyncErrors(async (req, res, next) => {
  const teacherId = req.params.teacherId; // Get classId from request params
 console.log(teacherId);
 
  const query = `
    SELECT s.subject_id, s.subject_name, s.subject_code, s.subject_teacher, s.book_name,
           s.class_id, s.section_id, s.created_at, s.updated_at,
           c.class_name, sec.section_name
    FROM subjects s
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN sections sec ON s.section_id = sec.section_id
    WHERE s.subject_teacher = ?
  `;

  db.query(query, [teacherId], (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching subjects", 500));
    } else if (results.length === 0) {
      return next(new ErrorHandler("No subjects found for the provided class", 404));
    } else {
      return res.status(200).json({
        success: true,
        subjects: results,
      });
    }
  });
});

// UPDATE Subject
exports.updateSubject = catchAsyncErrors(async (req, res, next) => {
  const subjectId = req.params.id;
  const subjectFields = req.body;

  const query = "UPDATE subjects SET ? WHERE subject_id = ?";

  db.query(query, [subjectFields, subjectId], (err, result) => {
    if (err) {
      return next(new ErrorHandler("Error updating subject", 500));
    } else if (result.affectedRows === 0) {
      return next(new ErrorHandler("Subject not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Subject updated successfully",
      });
    }
  });
});

// DELETE Subject
exports.deleteSubject = catchAsyncErrors(async (req, res, next) => {
  const subjectId = req.params.id;

  const query = "DELETE FROM subjects WHERE subject_id = ?";

  db.query(query, [subjectId], (err, result) => {
    if (err) {
      console.log(err);
      
      return next(new ErrorHandler("Error deleting subject", 500));
    } else if (result.affectedRows === 0) {
      return next(new ErrorHandler("Subject not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Subject deleted successfully",
        id: subjectId
      });
    }
  });
});
