const db = require("../config/database"); // Adjust the path to your database configuration
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware"); // Middleware for error handling

// Create Exam
exports.createExam = catchAsyncErrors(async (req, res) => {
  const { class_id, exam_name, start_date_time, end_date_time, subjects } =
    req.body;
  console.log(req.body);

  // Check if all required fields are provided
  if (
    !class_id ||
    !exam_name ||
    !start_date_time ||
    !end_date_time ||
    !Array.isArray(subjects)
  ) {
    return res
      .status(400)
      .json({ message: "All fields, including subjects array, are required" });
  }

  // Start by inserting the exam into the exams table
  const queryInsertExam = `INSERT INTO exams (class_id, exam_name, start_date_time, end_date_time) VALUES (?, ?, ?, ?)`;

  db.query(
    queryInsertExam,
    [class_id, exam_name, start_date_time, end_date_time],
    (error, examResults) => {
      if (error) {
        return res.status(500).json({ message: "Error creating exam", error });
      }

      const exam_id = examResults.insertId; // Get the newly created exam_id

      // Prepare to insert subjects into exam_subjects
      const examSubjectValues = subjects.map((subject_id) => [
        exam_id,
        subject_id,
      ]);

      const queryInsertExamSubjects = `INSERT INTO exam_subjects (exam_id, subject_id) VALUES ?`;

      // Insert multiple rows into the exam_subjects table
      db.query(
        queryInsertExamSubjects,
        [examSubjectValues],
        (error, subjectResults) => {
          if (error) {
            return res
              .status(500)
              .json({
                message: "Error associating subjects with exam",
                error: error.message,
              });
          }

          res.status(201).json({
            message: "Exam created successfully with associated subjects",
            exam_id: exam_id,
            associated_subjects: subjects,
          });
        }
      );
    }
  );
});

// exports.getExamsWithSubjects = catchAsyncErrors(async (req, res) => {
//     const query = `
//         SELECT e.exam_id, e.class_id, c.class_name, e.exam_name, e.start_date_time, e.end_date_time,
//                GROUP_CONCAT(s.subject_name) AS subjects
//         FROM exams e
//         LEFT JOIN exam_subjects es ON e.exam_id = es.exam_id
//         LEFT JOIN subjects s ON es.subject_id = s.subject_id
//         LEFT JOIN classes c ON e.class_id = c.class_id
//         GROUP BY e.exam_id, e.class_id, c.class_name, e.exam_name, e.start_date_time, e.end_date_time
//     `;

//     db.query(query, (error, results) => {
//         if (error) {
//             return res.status(500).json({ message: 'Error fetching exams with subjects', error });
//         }
//         res.status(200).json(results);
//     });
// });

// Get Single Exam with Subjects
exports.getExamByIdWithSubjects = catchAsyncErrors(async (req, res) => {
  const { exam_id } = req.params;

  const query = `
        SELECT e.exam_id, e.class_id, e.exam_name, e.start_date_time, e.end_date_time, 
               GROUP_CONCAT(s.subject_name) AS subjects
        FROM exams e
        LEFT JOIN exam_subjects es ON e.exam_id = es.exam_id
        LEFT JOIN subjects s ON es.subject_id = s.subject_id
        WHERE e.exam_id = ?
        GROUP BY e.exam_id, e.class_id, e.exam_name, e.start_date_time, e.end_date_time
    `;

  db.query(query, [exam_id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error fetching exam with subjects", error });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(results[0]);
  });
});

exports.updateExam = catchAsyncErrors(async (req, res) => {
  const { exam_id } = req.params;
  const { class_id, exam_name, start_date_time, end_date_time, subjects } =
    req.body;

  // Check if all required fields are present
  if (
    !class_id ||
    !exam_name ||
    !start_date_time ||
    !end_date_time ||
    !subjects ||
    !Array.isArray(subjects)
  ) {
    return res
      .status(400)
      .json({
        message: "All fields are required and subjects must be an array",
      });
  }

  // Start a transaction to ensure both operations succeed together
  db.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Transaction error", error: err.message });
    }

    // Update exam details
    const updateExamQuery = `
            UPDATE exams 
            SET class_id = ?, exam_name = ?, start_date_time = ?, end_date_time = ?
            WHERE exam_id = ?
        `;
    db.query(
      updateExamQuery,
      [class_id, exam_name, start_date_time, end_date_time, exam_id],
      (examError, examResults) => {
        if (examError) {
          return db.rollback(() => {
            res
              .status(500)
              .json({
                message: "Error updating exam",
                error: examError.message,
              });
          });
        }

        if (examResults.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({ message: "Exam not found" });
          });
        }

        // Delete existing subjects for the exam
        const deleteSubjectsQuery = `DELETE FROM exam_subjects WHERE exam_id = ?`;
        db.query(
          deleteSubjectsQuery,
          [exam_id],
          (deleteError, deleteResults) => {
            // Proceed to the next step regardless of whether rows were deleted or not
            if (deleteError) {
              return db.rollback(() => {
                res
                  .status(500)
                  .json({
                    message: "Error deleting old subjects",
                    error: deleteError.message,
                  });
              });
            }

            // Insert new subjects
            const insertSubjectsQuery = `INSERT INTO exam_subjects (exam_id, subject_id) VALUES ?`;
            const subjectsData = subjects.map((subject_id) => [
              exam_id,
              subject_id,
            ]);

            db.query(
              insertSubjectsQuery,
              [subjectsData],
              (insertError, insertResults) => {
                if (insertError) {
                  return db.rollback(() => {
                    res
                      .status(500)
                      .json({
                        message: "Error inserting subjects",
                        error: insertError.message,
                      });
                  });
                }

                // Commit the transaction if everything was successful
                db.commit((commitError) => {
                  if (commitError) {
                    console.log(commitError);

                    return db.rollback(() => {
                      res
                        .status(500)
                        .json({
                          message: "Error committing transaction",
                          error: commitError.message,
                        });
                    });
                  }

                  res
                    .status(200)
                    .json({ message: "Exam updated successfully" });
                });
              }
            );
          }
        );
      }
    );
  });
});

exports.getExamsWithSubjects = catchAsyncErrors(async (req, res) => {
    const { class_id } = req.query; // Optional class_id in query params
  
    let query = `
      SELECT e.exam_id, e.class_id, c.class_name, e.exam_name, e.start_date_time, e.end_date_time, 
             JSON_ARRAYAGG(s.subject_id) AS subjects
      FROM exams e
      LEFT JOIN exam_subjects es ON e.exam_id = es.exam_id
      LEFT JOIN subjects s ON es.subject_id = s.subject_id
      LEFT JOIN classes c ON e.class_id = c.class_id
    `;
  
    const queryParams = [];
  
    // If class_id is provided, filter by class_id
    if (class_id) {
      query += " WHERE e.class_id = ?";
      queryParams.push(class_id);
    }
  
    // The GROUP BY clause must come after WHERE
    query += `
      GROUP BY e.exam_id, e.class_id, c.class_name, e.exam_name, e.start_date_time, e.end_date_time
    `;
  
    db.query(query, queryParams, (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error fetching exams with subjects", error });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No exams found" });
      }
  
      res.status(200).json(results);
    });
  });
  

// Delete Exam
exports.deleteExam = catchAsyncErrors(async (req, res) => {
  const { exam_id } = req.params;

  const query = "DELETE FROM exams WHERE exam_id = ?";

  db.query(query, [exam_id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error deleting exam", error });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted successfully", id: exam_id });
  });
});
