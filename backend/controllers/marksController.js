const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");

// Ensure you have your db connection set up
exports.updateSubjectMarks = catchAsyncErrors(async (req, res) => {
  const { class_id, section_id, exam_id, subject_id, preparedData } = req.body;

  try {
    // Step 1: Validate input data
    if (!Array.isArray(preparedData) || preparedData.length === 0) {
      return res.status(400).json({ message: "Prepared data is required." });
    }

    // Step 2: Fetch the subject name using subject_id
    const subjectNameQuery = `SELECT subject_name FROM subjects WHERE subject_id = ?`;
    const [subjectNameResult] = await new Promise((resolve, reject) => {
      db.query(subjectNameQuery, [subject_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!subjectNameResult) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const subject_name = subjectNameResult.subject_name.toLowerCase();

    // Step 3: Process each student record in preparedData
    for (const student of preparedData) {
      const { student_id, marks, remarks, student_name, ...dynamicFields } =
        student;

      // Step 4: Update the subject_name table
      const checkRecordQuery = `SELECT * FROM ${subject_name} WHERE student_id = ?`;
      const [existingRecord] = await new Promise((resolve, reject) => {
        db.query(checkRecordQuery, [student_id], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      if (existingRecord && Object.keys(existingRecord).length > 0) {
        // If the record exists, update it
        const updateSubjectQuery = `
          UPDATE ${subject_name} 
          SET marks = ?, remarks = ? 
          WHERE student_id = ?`;

        await new Promise((resolve, reject) => {
          db.query(
            updateSubjectQuery,
            [marks, remarks, student_id],
            (err, results) => {
              if (err) return reject(err);
              resolve(results);
            }
          );
        });
      } else {
        // If the record does not exist, insert it
        const insertSubjectQuery = `
          INSERT INTO ${subject_name} (class_id, exam_id, student_id, section_id, marks, remarks) 
          VALUES (?, ?, ?, ?, ?, ?)`;

        await new Promise((resolve, reject) => {
          db.query(
            insertSubjectQuery,
            [class_id, exam_id, student_id, section_id, marks, remarks],
            (err, results) => {
              if (err) return reject(err);
              resolve(results);
            }
          );
        });
      }

      // Step 5: Update subject_marks_fields table for practical, PT, and Theory

      for (const { field_name, value } of Object.entries(dynamicFields)) {
        const updateFieldQuery = `
          UPDATE subject_marks_field 
          SET field_value = ? 
          WHERE subject_id = ? AND class_id = ? AND section_id = ? AND field_name = ?`;

        await new Promise((resolve, reject) => {
          db.query(
            updateFieldQuery,
            [value, subject_id, class_id, section_id, field_name],
            (err, results) => {
              if (err) return reject(err);
              resolve(results);
            }
          );
        });
      }
    }

    // Step 6: Return success response
    res
      .status(200)
      .json({ message: "Marks and remarks updated successfully." });
  } catch (error) {
    console.error("Error submitting marks:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Assuming you're using Express

// exports.getAllSubjectsWithMarks = catchAsyncErrors(async (req, res) => {
//   try {
//     const query = `
//       SELECT
//           s.subject_id,
//           s.subject_name,
//           s.class_id,
//           s.section_id,
//           s.subject_code,
//           s.subject_teacher,
//           s.book_name,
//           st.student_id,
//           st.first_name,
//           st.last_name,
//           GROUP_CONCAT(JSON_OBJECT(
//               'field_name', smf.field_name,
//               'field_value', smf.field_value,
//               'marks_id', smf.id,
//               'total_marks', smf.total_marks,
//               'created_at', smf.created_at,
//               'updated_at', smf.updated_at
//           )) AS field_values,
//           sec.section_name,
//           c.class_name
//       FROM
//           subjects s
//       LEFT JOIN
//           subject_marks_field smf ON s.subject_id = smf.subject_id
//       LEFT JOIN
//           sections sec ON s.section_id = sec.section_id
//       LEFT JOIN
//           classes c ON s.class_id = c.class_id
//       LEFT JOIN
//           students st ON s.student_id = st.student_id
//       GROUP BY
//           s.subject_id, st.student_id
//     `;

//     const results = await new Promise((resolve, reject) => {
//       db.query(query, (err, results) => {
//         if (err) return reject(err);
//         resolve(results);
//       });
//     });

//     // Map the results to convert field_values from string to array
//     const subjectsData = results.map(subject => ({
//       subject_id: subject.subject_id,
//       subject_name: subject.subject_name,
//       class_id: subject.class_id,
//       section_id: subject.section_id,
//       subject_code: subject.subject_code,
//       subject_teacher: subject.subject_teacher,
//       book_name: subject.book_name,
//       student_id: subject.student_id,
//       first_name: subject.first_name,
//       last_name: subject.last_name,
//       email: subject.email,
//       field_values: JSON.parse(`[${subject.field_values}]`), // Convert string to array
//       section_name: subject.section_name,
//       class_name: subject.class_name,
//     }));

//     // Send the results back to the client
//     res.status(200).json(subjectsData);
//   } catch (error) {
//     console.error("Error fetching all subjects with student field values:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

exports.getClassDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    // 1. Get all classes
    const [classes] = await db.promise().query("SELECT * FROM classes");

    // Store the results in a structured way
    let results = [];

    for (const classData of classes) {
      // 2. Get sections of the class
      const [sections] = await db
        .promise()
        .query("SELECT * FROM sections WHERE class_id = ?", [
          classData.class_id,
        ]);

      let classResult = { ...classData, sections: [] };

      for (const section of sections) {
        // 3. Get student_school_details by section
        const [studentSchoolDetails] = await db
          .promise()
          .query("SELECT * FROM student_school_details WHERE section = ?", [
            section.section_id,
          ]);

        let sectionResult = { ...section, students: [] };

        // 4. Get students by student IDs from student_school_details
        for (const schoolDetail of studentSchoolDetails) {
          const [students] = await db
            .promise()
            .query("SELECT * FROM students WHERE student_id = ?", [
              schoolDetail.student_id,
            ]);

          if (students.length) {
            sectionResult.students.push({
              ...students[0], // Assuming student_id is unique
              school_details: schoolDetail, // Include school details with the student info
            });
          }
        }

        // 5. Get all exams of the class
        const [exams] = await db
          .promise()
          .query("SELECT * FROM exams WHERE class_id = ?", [
            classData.class_id,
          ]);

        let examResult = [];

        for (const exam of exams) {
          // 6. Get exam_subjects of the exam
          const [examSubjects] = await db
            .promise()
            .query("SELECT * FROM exam_subjects WHERE exam_id = ?", [
              exam.exam_id,
            ]);

          let subjectsWithMarks = [];

          for (const subject of examSubjects) {
            // 7. Get the subject_mark_field of the subject if any
            const [subjectMarkField] = await db
              .promise()
              .query("SELECT * FROM subject_marks_field WHERE subject_id = ?", [
                subject.subject_id,
              ]);
           

            // Combine subject with its mark field if available
            subjectsWithMarks.push({
              ...subject,
              mark_field: subjectMarkField.length ? subjectMarkField[0] : null,
            });
          }

          examResult.push({
            ...exam,
            subjects: subjectsWithMarks,
          });
        }

        sectionResult.exams = examResult;
        classResult.sections.push(sectionResult);
      }

      results.push(classResult);
    }

    // Return the structured result
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error); // Pass the error to your error handling middleware
  }
});

exports.getStudentDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    // 1. Get the student ID from request parameters
    const studentId = req.params.studentId;

    // 2. Get student details
    const [student] = await db
      .promise()
      .query("SELECT * FROM students WHERE student_id = ?", [studentId]);

    if (student.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // 3. Get the school details of the student
    const [schoolDetails] = await db
      .promise()
      .query("SELECT * FROM student_school_details WHERE student_id = ?", [
        studentId,
      ]);

    // 4. Get the sections of the student
    const [sections] = await db
      .promise()
      .query("SELECT * FROM sections WHERE section_id = ?", [
        schoolDetails[0].section,
      ]);

    // 5. Get the exams of the class associated with the section
    const [exams] = await db
      .promise()
      .query("SELECT * FROM exams WHERE class_id = ?", [sections[0].class_id]);

    let examResults = [];

    for (const exam of exams) {
      // 6. Get exam_subjects of the exam
      const [examSubjects] = await db
        .promise()
        .query("SELECT * FROM exam_subjects WHERE exam_id = ?", [exam.exam_id]);

      let subjectsWithMarks = [];

      for (const subject of examSubjects) {
        // 7. Get the subject_mark_field of the subject if any
        const [subjectMarkField] = await db
          .promise()
          .query("SELECT * FROM subject_marks_field WHERE subject_id = ?", [
            subject.subject_id,
          ]);

        // Combine subject with its mark field if available
        subjectsWithMarks.push({
          ...subject,
          mark_field: subjectMarkField.length ? subjectMarkField[0] : null,
        });
      }

      examResults.push({
        ...exam,
        subjects: subjectsWithMarks,
      });
    }

    // Structure the response
    const responseData = {
      student: {
        ...student[0],
        school_details: schoolDetails[0], // Include school details with the student info
        section: sections[0],
        exams: examResults,
      },
    };

    // Return the structured result
    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error); // Pass the error to your error handling middleware
  }
});

exports.getAllStudentsDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    // 1. Get all students
    const [students] = await db.promise().query("SELECT * FROM students");

    if (students.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No students found" });
    }

    // Initialize an array to hold student details
    const results = [];

    // 2. Loop through each student to get their details
    for (const student of students) {
      // 3. Get the school details of the student
      const [schoolDetails] = await db
        .promise()
        .query("SELECT * FROM student_school_details WHERE student_id = ?", [
          student.student_id,
        ]);

      if (schoolDetails.length === 0) {
        continue; // Skip this student if no school details are found
      }

      // 4. Get the section of the student
      const [sections] = await db
        .promise()
        .query("SELECT * FROM sections WHERE section_id = ?", [
          schoolDetails[0].section,
        ]);

      // 5. Get the exams of the class associated with the section
      const [exams] = await db
        .promise()
        .query("SELECT * FROM exams WHERE class_id = ?", [
          sections[0].class_id,
        ]);

      let examResults = [];

      // 6. Loop through exams to get subjects and marks
      for (const exam of exams) {
        const [examSubjects] = await db
          .promise()
          .query("SELECT * FROM exam_subjects WHERE exam_id = ?", [
            exam.exam_id,
          ]);
        let subjectsWithDetails = [];

        for (const subject of examSubjects) {
          const [subjectDetails] = await db
            .promise()
            .query("SELECT * FROM subjects WHERE subject_id = ?", [
              subject.subject_id,
            ]);

          if (subjectDetails.length === 0) {
            continue; // Skip if no subject details are found
          }

          let allSubjects = [];

          // Loop through each subject to get additional data
          for (const subjectDetail of subjectDetails) {
            // Construct the dynamic query for the subject's specific table
            const query = `SELECT * FROM ${subjectDetail.subject_name.toLowerCase()} WHERE class_id = ? AND student_id = ?`;
            const [tableRecords] = await db
              .promise()
              .query(query, [exam.class_id, student.student_id]);

            // Fetch the subject marks field for the current subject
            let alltableRecordes = [];
            for (const record of tableRecords) {
              const [subjectMarkField] = await db
                .promise()
                .query(
                  "SELECT * FROM subject_marks_field WHERE subject_id = ? AND class_id = ?",
                  [subjectDetail.subject_id, exam.class_id]
                );

              // Combine subject with its mark field if available
              alltableRecordes.push({
                ...record,
                mark_field:
                  subjectMarkField.length > 0 ? subjectMarkField[0] : null,
              });
            }

            allSubjects.push({
              ...subjectDetail,
              tableRecords: alltableRecordes, // Records from the subject-specific table
            });
          }

          // Combine subject with its details
          subjectsWithDetails.push({
            subject_id: subject.subject_id,
            subject_name: subject.subject_name,
            subjectDetails: allSubjects,
          });
        }

        examResults.push({
          ...exam,
          subjects: subjectsWithDetails,
        });
      }

      // Structure the student detail with all related information
      results.push({
        student: {
          ...student,
          school_details: schoolDetails[0], // Include school details with the student info
          section: sections[0],
          exams: examResults,
        },
      });
    }

    // Return the structured result
    res.status(200).json({
      success: true,
      marks: results,
    });
  } catch (error) {
    next(error); // Pass the error to your error handling middleware
  }
});
