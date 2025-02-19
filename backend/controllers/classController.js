const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");
const { createUser, createEntries } = require("../utils/helpers");

// CREATE Class
exports.createClass = catchAsyncErrors(async (req, res, next) => {
  const classFields = req.body;

  // Query to update the courses table
  const updateCourseQuery =
    "UPDATE courses SET instructor_id = ? WHERE course_id = ?";

  // Create the class entry
  createEntries("classes", classFields, (err, result) => {
    if (err) {
      return next(new ErrorHandler("Error creating class", 500));
    } else {
      const { instructor_id, course_id } = classFields;

      // Check if instructor_id and course_id are provided
      if (instructor_id && course_id) {
        // Update the courses table
        db.query(updateCourseQuery, [instructor_id, course_id], (courseErr) => {
          if (courseErr) {
            return next(new ErrorHandler("Error updating course", 500));
          } else {
            return res.status(201).json({
              success: true,
              message: "Class created and course updated successfully",
            });
          }
        });
      } else {
        // If no instructor_id or course_id, return success for class creation only
        return res.status(201).json({
          success: true,
          message:
            "Class created successfully, but no course update was performed",
        });
      }
    }
  });
});

// GET All Classes
exports.getClassesWithDetails = catchAsyncErrors(async (req, res, next) => {
  const query = `
    SELECT c.class_id, c.class_name, c.class_starting_on, c.class_ending_on, 
           c.created_at, c.updated_at, 
           s.section_id, s.section_name, s.section_capacity, s.teacher_id, 
           t.first_name, t.last_name, u.email,u.username
    FROM classes c
    LEFT JOIN sections s ON c.class_id = s.class_id
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
    LEFT JOIN users u ON t.user_id = t.user_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);

      return next(new ErrorHandler("Error fetching classes", 500));
    } else {
      return res.status(200).json({
        success: true,
        classes: results,
      });
    }
  });
});

exports.getClasses = catchAsyncErrors(async (req, res, next) => {
  const query = `
    SELECT 
      c.*, 
      t.first_name AS instructor_first_name,
      t.last_name AS instructor_last_name,
      t.phone AS instructor_phone,
      co.course_name AS course_name,
      co.course_description AS course_description,
      IFNULL(COUNT(e.course_id), 0) AS enrolled_count
    FROM 
      classes c
    LEFT JOIN 
      teachers t ON c.instructor_id = t.teacher_id
    LEFT JOIN 
      courses co ON c.course_id = co.course_id
    LEFT JOIN
      enrollments e ON co.course_id = e.course_id  -- Join on course_id instead of class_id
    GROUP BY 
      c.class_id, t.first_name, t.last_name, t.phone, co.course_name, co.course_description
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler("Error fetching classes", 500));
    } else {
      return res.status(200).json({
        success: true,
        classes: results,
      });
    }
  });
});

// GET Class by ID (with sections and teacher details)
exports.getClassById = catchAsyncErrors(async (req, res, next) => {
  const classId = req.params.id;
   
  const query = `
    SELECT c.class_id, c.class_name, c.class_starting_on, c.class_ending_on, 
           c.created_at, c.updated_at, 
           s.section_id, s.section_name, s.section_capacity, s.teacher_id, 
           t.teacher_name, t.teacher_email, t.teacher_phone
    FROM classes c
    LEFT JOIN sections s ON c.class_id = s.class_id
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
    WHERE c.class_id = ?
  `;

  db.query(query, [classId], (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching class", 500));
    } else if (results.length === 0) {
      return next(new ErrorHandler("Class not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        data: results,
      });
    }
  });
});


exports.getClassByInstructor = catchAsyncErrors(async (req, res, next) => {
  const instructorId = req.params.instructorId;

  const query = `
    SELECT *
    FROM classes 
    WHERE instructor_id = ?
  `;

  db.query(query, [instructorId], (err, results) => {
    if (err) {
      console.log(err);

      return next(new ErrorHandler("Error fetching class", 500));
    } else if (results.length === 0) {
      return res.status(200).json({
        success: true,
        classes: [],
      });
    } else {
      return res.status(200).json({
        success: true,
        classes: results,
      });
    }
  });
});


// UPDATE Class


exports.updateClass = catchAsyncErrors(async (req, res, next) => {
  const classId = req.params.id;
  const classFields = req.body;

 
  const updateClassQuery = "UPDATE classes SET ? WHERE class_id = ?";
  const updateCourseQuery =
    "UPDATE courses SET instructor_id = ? WHERE course_id = ?";

  db.query(updateClassQuery, [classFields, classId], (err, result) => {
    if (err) {
      console.log(err);
      
      return next(new ErrorHandler("Error updating class", 500));
    } else if (result.affectedRows === 0) {
      return next(new ErrorHandler("Class not found", 404));
    } else {
      // Update the courses table
      const { instructor_id, course_id } = classFields;

      if (instructor_id && course_id) {
        db.query(updateCourseQuery, [instructor_id, course_id], (courseErr) => {
          if (courseErr) {
            console.log(courseErr);
            
            return next(new ErrorHandler("Error updating course", 500));
          } else {
            return res.status(200).json({
              success: true,
              message: "Class and course updated successfully",
            });
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Missing instructor_id or course_id for course update",
        });
      }
    }
  });
});

exports.deleteClass = catchAsyncErrors(async (req, res, next) => {
  const classId = req.params.id;

  const query = "DELETE FROM classes WHERE class_id = ?";

  db.query(query, [classId], (err, result) => {
    if (err) {
      console.log(err);

      return next(new ErrorHandler("Error deleting class", 500));
    } else if (result.affectedRows === 0) {
      return next(new ErrorHandler("Class not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Class deleted successfully",
        class_id: classId,
      });
    }
  });
});
