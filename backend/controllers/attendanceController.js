const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database"); // Adjust based on your database setup

// Controller to mark a student as absent
exports.markStudentAbsent = catchAsyncErrors(async (req, res) => {
  const { student_id, class_id, section_id, attendance_date, reason } =
    req.body;

  // Validate input
  if (!student_id || !class_id || !section_id || !attendance_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Convert attendance_date to a consistent format (if necessary)
  const formattedDate = new Date(attendance_date).toISOString().split("T")[0]; // YYYY-MM-DD

  // Query to check if the record already exists for the same student and date
  const checkQuery = `
        SELECT attendance_id FROM student_attendance 
        WHERE student_id = ? AND class_id = ? AND section_id = ? AND DATE(attendance_date) = ?
    `;

  db.query(
    checkQuery,
    [student_id, class_id, section_id, formattedDate],
    (checkError, results) => {
      if (checkError) {
        return res
          .status(500)
          .json({
            message: "Error checking attendance record",
            error: checkError,
          });
      }

      if (results.length > 0) {
        // Entry already exists for the same student and day, so delete it
        const deleteQuery = `
                DELETE FROM student_attendance 
                WHERE attendance_id = ?
            `;

        db.query(deleteQuery, [results[0].attendance_id], (deleteError) => {
          if (deleteError) {
            return res
              .status(500)
              .json({
                message: "Error deleting attendance record",
                error: deleteError,
              });
          }
          res
            .status(200)
            .json({
              message: "Attendance record deleted for the student on this day",
            });
        });
      } else {
        // No entry exists, so insert a new record
        const insertQuery = `
                INSERT INTO student_attendance (student_id, class_id, section_id, attendance_date, status, reason)
                VALUES (?, ?, ?, ?, 'absent', ?)
            `;

        db.query(
          insertQuery,
          [student_id, class_id, section_id, formattedDate, reason],
          (insertError, insertResults) => {
            if (insertError) {
              return res
                .status(500)
                .json({ message: "Error marking absence", error: insertError });
            }
            res
              .status(200)
              .json({
                message: "Student marked as absent successfully",
                attendance_id: insertResults.insertId,
              });
          }
        );
      }
    }
  );
});

// Controller to mark a teacher as absent
exports.markTeacherAbsent = catchAsyncErrors(async (req, res) => {
  const { teacher_id, attendance_date, reason } = req.body;

  // Validate input
  if (!teacher_id || !attendance_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Convert attendance_date to a consistent format (if necessary)
  const formattedDate = new Date(attendance_date).toISOString().split("T")[0]; // YYYY-MM-DD

  // Query to check if the record already exists for the same teacher and date
  const checkQuery = `
        SELECT attendance_id FROM teacher_attendance 
        WHERE teacher_id = ? AND DATE(attendance_date) = ?
    `;

  db.query(checkQuery, [teacher_id, formattedDate], (checkError, results) => {
    if (checkError) {
      return res
        .status(500)
        .json({
          message: "Error checking attendance record",
          error: checkError,
        });
    }

    if (results.length > 0) {
      // Entry already exists for the same teacher and day, so delete it
      const deleteQuery = `
                DELETE FROM teacher_attendance 
                WHERE attendance_id = ?
            `;

      db.query(deleteQuery, [results[0].attendance_id], (deleteError) => {
        if (deleteError) {
          return res
            .status(500)
            .json({
              message: "Error deleting attendance record",
              error: deleteError,
            });
        }
        res
          .status(200)
          .json({
            message: "Attendance record deleted for the teacher on this day",
          });
      });
    } else {
      // No entry exists, so insert a new record
      const insertQuery = `
                INSERT INTO teacher_attendance (teacher_id, attendance_date, status, reason)
                VALUES (?, ?, 'absent', ?)
            `;

      db.query(
        insertQuery,
        [teacher_id, formattedDate, reason],
        (insertError, insertResults) => {
          if (insertError) {
            return res
              .status(500)
              .json({ message: "Error marking absence", error: insertError });
          }
          res
            .status(200)
            .json({
              message: "Teacher marked as absent successfully",
              attendance_id: insertResults.insertId,
            });
        }
      );
    }
  });
});

// Controller to get student attendance records
exports.getStudentAttendance = catchAsyncErrors(async (req, res) => {
  const { student_id } = req.params; // Assuming you pass the student ID as a query parameter

  // Validate input
  if (!student_id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  const query = `
        SELECT * FROM student_attendance WHERE student_id = ? ORDER BY attendance_date DESC
    `;

  db.query(query, [student_id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error fetching attendance records", error });
    }
    res.status(200).json({ success: true, data: results });
  });
});
exports.getStudentAttendanceByUserId = catchAsyncErrors(async (req, res) => {
  const { user_id } = req.params; // Get the user_id from the request parameters

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Query to get the student_id from the students table using user_id
  const getStudentIdQuery = `
        SELECT student_id FROM students WHERE user_id = ?
    `;

  db.query(getStudentIdQuery, [user_id], (err, studentResult) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching student ID", error: err });
    }

    if (studentResult.length === 0) {
      return res
        .status(404)
        .json({ message: "Student not found for the given User ID" });
    }

    // Extract the student_id
    const { student_id } = studentResult[0];

    // Query to get attendance records for the student_id
    const getAttendanceQuery = `
            SELECT * FROM student_attendance WHERE student_id = ? ORDER BY attendance_date DESC
        `;

    db.query(
      getAttendanceQuery,
      [student_id],
      (attendanceErr, attendanceResults) => {
        if (attendanceErr) {
          return res
            .status(500)
            .json({
              message: "Error fetching attendance records",
              error: attendanceErr,
            });
        }

        res.status(200).json({
          success: true,
          student_id,
          attendances: attendanceResults,
        });
      }
    );
  });
});

// Controller to get teacher attendance records
exports.getTeacherAttendance = catchAsyncErrors(async (req, res) => {
  const { teacher_id } = req.params; // Assuming you pass the teacher ID as a query parameter

  // Validate input
  if (!teacher_id) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }

  const query = `
        SELECT * FROM teacher_attendance WHERE teacher_id = ? ORDER BY attendance_date DESC
    `;

  db.query(query, [teacher_id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error fetching attendance records", error });
    }
    res.status(200).json({ success: true, data: results });
  });
});
// Controller to get all student attendance records
exports.getAllStudentAttendance = catchAsyncErrors(async (req, res) => {
  const query = `
        SELECT * FROM student_attendance ORDER BY attendance_date DESC
    `;

  db.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error fetching attendance records", error });
    }
    res.status(200).json({ success: true, data: results });
  });
});

// Controller to get all teacher attendance records
exports.getAllTeacherAttendance = catchAsyncErrors(async (req, res) => {
  const query = `
        SELECT * FROM teacher_attendance ORDER BY attendance_date DESC
    `;

  db.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error fetching attendance records", error });
    }
    res.status(200).json({ success: true, data: results });
  });
});
