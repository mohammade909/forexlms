// coursesController.js
const connection = require("../config/database");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const ErrorHandler = require("../utils/errorHandler");
const path = require('path')
const fs = require('fs');


const buildInsertQuery = (tableName, data) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
  return { query, values: Object.values(data) };
};

const buildUpdateQuery = (tableName, data, idColumn, idValue) => {
  const setClause = Object.keys(data)
    .map((column) => `${column}=?`)
    .join(", ");
  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn}=?`;
  const values = [...Object.values(data), idValue];
  return { query, values };
};

// Create a new course
exports.createCourse = catchAsyncErrors(async (req, res, next) => {
  const courseData = req.body;

  // Check if a file is uploaded
  const file = req.files?.course_image;

  // Validate file type and size if needed
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new ErrorHandler("Invalid file type", 400));
    }

    // Generate a unique name for the file
    const fileName = `${Date.now()}-${file.name}`;
   
    // Define the path to save the file
    const uploadPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'courses', fileName);

    // Save the file to the specified directory
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("Error saving file: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }

      // Add the file name to the courseData
      courseData.course_image = fileName;

      // Proceed to insert the course data
      insertCourseData(courseData, res, next);
    });
  } else {
    // If no file is provided, proceed with inserting the course data
    insertCourseData(courseData, res, next);
  }
});


const generateCourseCode = (courseName) => {
  // Convert the course name to uppercase, remove non-alphanumeric characters, and take the first few characters
  const sanitizedCourseName = courseName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

  // Append a unique identifier (e.g., timestamp)
  const uniqueIdentifier = Date.now().toString().slice(-4);

  return `${sanitizedCourseName}-${uniqueIdentifier}`;
};

const insertCourseData = (courseData, res, next) => {
  // Generate course code if not provided
  if (!courseData.course_code) {
    courseData.course_code = generateCourseCode(courseData.course_name);
  }

  const { query, values } = buildInsertQuery("courses", courseData);

  // Insert the course data into the database
  connection.query(query, values, (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        // Handle duplicate entry error
        return res.status(409).json({
          message: "Duplicate entry for course_code. Please use a unique course_code.",
        });
      }
      console.error("Error creating course: " + err);
      return next(new ErrorHandler("Server Error", 500));
    }

    res.status(201).json({
      message: "Course created successfully",
      courseId: results.insertId,
      courseCode: courseData.course_code,
    });
  });
};

// Helper function to handle course data insertion
// const insertCourseData = (courseData, res, next) => {
//   const { query, values } = buildInsertQuery("courses", courseData);

//   // Insert the course data into the database
//   connection.query(query, values, (err, results) => {
//     if (err) {
//       if (err.code === "ER_DUP_ENTRY") {
//         // Handle duplicate entry error
//         return res.status(409).json({
//          message: "Duplicate entry for course_code. Please use a unique course_code.",
//         });
//       }
//       console.error("Error creating course: " + err);
//       return next(new ErrorHandler("Server Error", 500));
//     }

//     res.status(201).json({
//       message: "Course created successfully",
//       courseId: results.insertId,
//     });
//   });
// };



// Get all courses
exports.getAllCourses = catchAsyncErrors(async (req, res, next) => {
  const query = `
    SELECT 
      courses.*,
      users.user_id AS instructor_id,
      users.username AS instructor_username,
      users.email AS instructor_email,
      users.user_type AS role
    FROM courses
    LEFT JOIN users ON courses.instructor_id = users.user_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching courses with instructors: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    res.status(200).json(results);
  });
});


// Get a single course by ID
exports.getCourseById = catchAsyncErrors(async (req, res, next) => {
  const courseId = req.params.id;
  const query = "SELECT * FROM courses WHERE course_id=?";

  connection.query(query, [courseId], (err, results) => {
    if (err) {
      console.error("Error fetching course: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    if (results.length === 0) {
      return next(new ErrorHandler("Course not found", 404));
    }
    res.status(200).json(results[0]);
  });
});


exports.getStudentCourses = catchAsyncErrors(async (req, res, next) => {
  const studentId = req.params.id;

  // Query to get courses associated with the student
  const query = `
    SELECT courses.*
    FROM courses
    INNER JOIN enrollments ON enrollments.course_id = courses.course_id
    WHERE enrollments.student_id = ?
  `;

  connection.query(query, [studentId], (err, results) => {
    if (err) {
      console.error("Error fetching courses: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    if (results.length === 0) {
      return next(new ErrorHandler("No courses found for this student", 404));
    }
    res.status(200).json(results); // Return the courses found for the student
  });
});

// Update a course
// exports.updateCourse = catchAsyncErrors(async (req, res, next) => {
//   const courseId = req.params.id;
//   const courseData = req.body;

//   const { query, values } = buildUpdateQuery(
//     "courses",
//     courseData,
//     "course_id",
//     courseId
//   );

//   connection.query(query, values, (err, results) => {
//     if (err) {
//       console.error("Error updating course: " + err.stack);
//       return next(new ErrorHandler("Server Error", 500));
//     }
//     res.status(200).json({ message: "Course updated successfully" });
//   });
// });


exports.updateCourse = catchAsyncErrors(async (req, res, next) => {
  const courseId = req.params.id;
  const courseData = req.body;

  // Check if a file is uploaded
  if (req.files && req.files.course_image) {
    const file = req.files.course_image;

    // Validate file type and size if needed
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new ErrorHandler("Invalid file type", 400));
    }

    // Generate a unique name for the file
    const fileName = `${Date.now()}-${file.name}`;

    // Define the path to save the file
    const uploadPath = path.join(__dirname, '..', '..', 'cybersolvings.org', 'courses', fileName);
    console.log(uploadPath);

    // Save the file to the specified directory
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("Error saving file: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }

      // Add the file name to the courseData
      courseData.course_image = fileName;

      // Proceed with updating the course data in the database
      const { query, values } = buildUpdateQuery(
        "courses",
        courseData,
        "course_id",
        courseId
      );

      connection.query(query, values, (err, results) => {
        if (err) {
          console.error("Error updating course: " + err.stack);
          return next(new ErrorHandler("Server Error", 500));
        }
        res.status(200).json({ message: "Course updated successfully" });
      });
    });
  } else {
    // If no file is uploaded, proceed with updating the course data without changing the image
    const { query, values } = buildUpdateQuery(
      "courses",
      courseData,
      "course_id",
      courseId
    );

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error updating course: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }
      res.status(200).json({ message: "Course updated successfully" });
    });
  }
});

// Delete a course
exports.deleteCourse = catchAsyncErrors(async (req, res, next) => {
  const courseId = req.params.id;
  const query = "DELETE FROM courses WHERE course_id=?";

  connection.query(query, [courseId], (err, results) => {
    if (err) {
      console.error("Error deleting course: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    res.status(200).json({ message: "Course deleted successfully" });
  });
});

exports.getCourseByInstructor = catchAsyncErrors(async (req, res, next) => {
  const instructorId = req.params.id;
  const query = `
    SELECT 
      c.course_id, c.course_name, c.course_description, c.created_at AS course_created_at,
      cl.class_id, cl.class_name, cl.class_starting_on, cl.class_ending_on, cl.created_at AS class_created_at, cl.updated_at AS class_updated_at
    FROM 
      courses c
    LEFT JOIN 
      classes cl
    ON 
      c.course_id = cl.course_id
    WHERE 
      c.instructor_id = ?;
  `;

  connection.query(query, [instructorId], (err, results) => {
    if (err) {
      console.error("Error fetching course and class details: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }

    if (results.length === 0) {
      return next(new ErrorHandler("No courses or classes found for the instructor", 404));
    }

    // Format the data to group classes under their respective courses
    const coursesWithClasses = {};
    results.forEach((row) => {
      if (!coursesWithClasses[row.course_id]) {
        coursesWithClasses[row.course_id] = {
          course_id: row.course_id,
          course_name: row.course_name,
          course_description: row.course_description,
          course_created_at: row.course_created_at,
          course_updated_at: row.course_updated_at,
          classes: [],
        };
      }
      if (row.class_id) {
        coursesWithClasses[row.course_id].classes.push({
          class_id: row.class_id,
          class_name: row.class_name,
          class_starting_on: row.class_starting_on,
          class_ending_on: row.class_ending_on,
          class_created_at: row.class_created_at,
          class_updated_at: row.class_updated_at,
        });
      }
    });

    res.status(200).json({
      success: true,
      courses: Object.values(coursesWithClasses),
    });
  });
});



exports.assignCourseToInstructor = catchAsyncErrors(async (req, res, next) => {
  const { course_id, instructor_id } = req.body;
  console.log(req.body);
  
  const instructorCheckQuery = "SELECT * FROM users WHERE user_id=? AND user_type='instructor'";
  connection.query(instructorCheckQuery, [instructor_id], (err, results) => {
    if (err) {
      console.error("Error checking instructor: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    if (results.length === 0) {
      return next(new ErrorHandler("Instructor not found", 404));
    }

    // Update course with instructor_id
    const updateQuery = "UPDATE courses SET instructor_id=? WHERE course_id=?";
    connection.query(updateQuery, [instructor_id, course_id], (err, results) => {
      if (err) {
        console.error("Error assigning instructor to course: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }
      res.status(200).json({ message: "Course assigned to instructor successfully" });
    });
  });
});