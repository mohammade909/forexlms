const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database"); // Update with your database connection file path

// Get all enrollments
// exports.getAllEnrollments = catchAsyncErrors(async (req, res) => {
//   try {
//     const query = `
//       SELECT e.enrollment_id, e.course_id, e.student_id, e.enrollment_date, e.status,
//              e.grade, e.created_at, e.updated_at,
//              s.first_name AS student_first_name, s.last_name AS student_last_name,
//              c.course_name, c.course_description
//       FROM enrollments e
//       JOIN students s ON e.student_id = s.student_id
//       JOIN courses c ON e.course_id = c.course_id
//     `;

//     const enrollments = await new Promise((resolve, reject) => {
//       db.query(query, (error, results) => {
//         if (error) return reject(error);
//         resolve(results);
//       });
//     });

//     res.status(200).json({
//       message: "Enrollments fetched successfully",
//       enrollments,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error fetching enrollments",
//       error,
//     });
//   }
// });

exports.getAllEnrollmentsByCourse = catchAsyncErrors(async (req, res) => {
  const { course_id } = req.params; // Extract course_id from request parameters

  try {
    // Query to fetch enrollments along with student details
    const query = `
      SELECT 
        e.enrollment_id, 
        e.course_id, 
        e.student_id, 
        e.enrollment_date, 
        e.status, 
        e.grade, 
        e.created_at AS enrollment_created_at, 
        e.updated_at AS enrollment_updated_at,
        s.user_id, 
        s.class_id, 
        s.first_name, 
        s.middle_name, 
        s.last_name, 
        s.gender, 
        s.profile_photo, 
        s.date_of_birth, 
        s.blood_group, 
        s.phone, 
        s.street_address, 
        s.city, 
        s.pin_code, 
        s.student_code, 
        s.created_at AS student_created_at, 
        s.updated_at AS student_updated_at
      FROM enrollments e
      JOIN students s ON e.student_id = s.user_id
      WHERE e.course_id = ?
    `;

    // Execute the query
    const enrollments = await new Promise((resolve, reject) => {
      db.query(query, [course_id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    // Send the enrollments with student details as a response
    res.status(200).json({
      message: "Enrollments with student details fetched successfully",
      enrollments,
    });
  } catch (error) {
    // Handle errors and send appropriate response
    console.error(error);
    res.status(500).json({
      message: "Error fetching enrollments with student details",
      error,
    });
  }
});


// Get enrollments by student ID
exports.getEnrollmentsByStudentID = catchAsyncErrors(async (req, res) => {
  const { student_id } = req.params;

  try {
    const query = `
      SELECT 
        e.enrollment_id,
        e.course_id,
        e.student_id,
        c.course_name,
        c.course_description,
        s.first_name AS student_first_name,
        s.last_name AS student_last_name,
        cl.class_id,
        cl.class_name,
        cl.class_starting_on,
        cl.class_ending_on,
        cl.instructor_id,
        t.first_name AS instructor_first_name,
        t.last_name AS instructor_last_name,
        t.qualification AS instructor_qualification,
        t.phone AS instructor_phone,
        cl.course_id AS class_course_id,
        cl.created_at AS class_created_at,
        cl.updated_at AS class_updated_at
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN students s ON e.student_id = s.user_id
      JOIN classes cl ON c.course_id = cl.course_id
      LEFT JOIN teachers t ON cl.instructor_id = t.teacher_id
      WHERE e.student_id = ?
    `;

    const enrollmentsWithDetails = await new Promise((resolve, reject) => {
      db.query(query, [student_id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    if (enrollmentsWithDetails.length === 0) {
      return res.status(200).json({
        message: "Enrollments fetched successfully",
        enrollments: [],
      });
    }

    res.status(200).json({
      message: "Enrollments fetched successfully",
      enrollments: enrollmentsWithDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching enrollments",
      error,
    });
  }
});

// exports.getEnrollmentsByStudentID = catchAsyncErrors(async (req, res) => {
//   const { student_id } = req.params;
//   console.log(student_id);

//   try {
//     const query = `
//       SELECT e.enrollment_id, e.course_id, e.student_id, e.enrollment_date, e.status,
//              e.grade, e.created_at, e.updated_at,
//              c.course_name, c.course_description,
//              cl.class_name, cl.class_starting_on, cl.class_ending_on, cl.instructor_id,
//              t.teacher_id, t.first_name AS instructor_first_name, t.last_name AS instructor_last_name, t.phone AS instructor_phone
//       FROM enrollments e
//       JOIN courses c ON e.course_id = c.course_id
//       JOIN classes cl ON c.course_id = cl.course_id
//       JOIN teachers t ON cl.instructor_id = t.teacher_id
//       WHERE e.student_id = ?
//     `;

//     const enrollments = await new Promise((resolve, reject) => {
//       db.query(query, [student_id], (error, results) => {

//         if (error) return reject(error);
//         resolve(results);
//       });
//     });

//     if (enrollments.length === 0) {
//       return res.status(200).json({
//         message: "Enrollments fetched successfully",
//         enrollments: [],
//       });
//     }

//     res.status(200).json({
//       message: "Enrollments fetched successfully",
//       enrollments,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error fetching enrollments",
//       error,
//     });
//   }
// });

exports.getAllEnrollments = catchAsyncErrors(async (req, res, next) => {
  try {
    const query = `
            SELECT 
                enrollments.enrollment_id,
                enrollments.enrollment_date,
                enrollments.status AS enrollment_status,
                enrollments.grade,
                courses.course_id,
                courses.course_name,
                students.student_id,
                students.first_name,
                students.last_name,
                fees.fee_id,
                fees.fee_amount,
                fees.due,
                fees.paid,
                fees.status AS fee_status,
                fees.payment_date,
                fees.payment_method
            FROM 
                enrollments
            JOIN 
                students ON enrollments.student_id = students.user_id
            JOIN 
                courses ON enrollments.course_id = courses.course_id
            LEFT JOIN 
                fees ON enrollments.student_id = fees.student_id AND enrollments.course_id = fees.course_id;
        `;

    db.query(query, (error, results) => {
      if (error) {
        return next(error); // Pass error to error handler middleware
      }

      res.status(200).json({
        success: true,
        enrollments: results,
      });
    });
  } catch (err) {
    next(err); // Pass error to error handler middleware
  }
});
