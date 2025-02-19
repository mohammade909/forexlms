const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");
const { createUser, createEntries } = require("../utils/helpers");

// CREATE Student
exports.createStudent = catchAsyncErrors(async (req, res) => {
  console.log(req.body);

  const {
    username,
    password,
    email,
    status, // user data
    first_name,
    middle_name,
    last_name,
    gender,
    profile_photo,
    date_of_birth,
    street_address,
    city,
    pin_code,
    blood_group,
    phone,
    course_id,
    paid,
    due,
    fee_amount,

    parent_profile_photo,
    parent_gender,
    parent_first_name,
    parent_middle_name,
    parent_last_name,
    parent_blood_group,
    parent_phone,
    parent_username,
    parent_email,
    parent_password,
    education,
    profession,
  } = req.body;

  db.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", error: err });
    }

    try {
      const userFields = {
        username,
        password, // Make sure to hash this before inserting
        email,
        user_type: "student", // Set user type to 'student'
        status,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Insert user into `users` table
      const userInsertQuery = `INSERT INTO users (username, password, email, user_type, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const userValues = Object.values(userFields);
      const userResult = await new Promise((resolve, reject) => {
        db.query(userInsertQuery, userValues, (error, results) => {
          console.log(error);

          if (error) return reject(error);
          resolve(results);
        });
      });

      const userId = userResult.insertId; // Get newly created user_id
      const classQuery = `SELECT class_id FROM classes WHERE course_id = ?`;
      const classResult = await new Promise((resolve, reject) => {
        db.query(classQuery, [course_id], (error, results) => {
          if (error) return reject(error);
          if (results.length === 0) {
            return reject(new Error("Class not found for this course please create a new class first"));
          }
          resolve(results[0].class_id);
        });
      });

      const classId = classResult;

      // Insert student into `students` table
      const studentFields = {
        user_id: userId,
        first_name,
        middle_name,
        last_name,
        gender,
        profile_photo,
        date_of_birth,
        blood_group,
        phone,
        street_address,
        city,
        pin_code,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const studentInsertQuery = `INSERT INTO students (user_id, first_name, middle_name, last_name, gender, profile_photo, date_of_birth, blood_group, phone, street_address, city, pin_code, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const studentValues = Object.values(studentFields);
      const studentResult = await new Promise((resolve, reject) => {
        db.query(studentInsertQuery, studentValues, (error, results) => {
          console.log(error);

          if (error) return reject(error);
          resolve(results);
        });
      });

      const studentId = studentResult.insertId;

      // Insert into `student_class_details` table
      const studentClassDetailsFields = {
        student_id: studentId,
        class_id: classId,
        course_id,
        roll_number: 1, // Optional, if you generate it later, set it to `null`
      };

      const studentClassDetailsQuery = `INSERT INTO student_class_details (student_id, class_id, course_id, roll_number) VALUES (?, ?, ?, ?)`;
      const studentClassDetailsValues = Object.values(
        studentClassDetailsFields
      );
      await new Promise((resolve, reject) => {
        db.query(
          studentClassDetailsQuery,
          studentClassDetailsValues,
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          }
        );
      });

      // Insert parent into `parents` table
      const parentFields = {
        student_id: studentId,
        first_name: parent_first_name,
        middle_name: parent_middle_name,
        last_name: parent_last_name,
        username: parent_username,
        password: parent_password, // Make sure to hash this before inserting
        email: parent_email,
        phone: parent_phone,
        blood_group: parent_blood_group,
        gender: parent_gender,
        education,
        profession,
        profile_photo: parent_profile_photo,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const parentInsertQuery = `INSERT INTO parents (student_id, first_name, middle_name, last_name, username, password, email, phone, blood_group, gender, education, profession, profile_photo, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const parentValues = Object.values(parentFields);
      await new Promise((resolve, reject) => {
        db.query(parentInsertQuery, parentValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      // Insert fee into `fees` table
      const feeFields = {
        child_id: userId, // The `user_id` acts as `child_id`
        course_id,
        fee_amount,
        due,
        paid,
        status: due > 0 ? "partial" : "paid", // Set status based on due
        payment_date: paid > 0 ? new Date() : null,
        payment_method: paid > 0 ? "default method" : null, // Update with actual payment method if available
        created_at: new Date(),
        updated_at: new Date(),
      };

      const feeInsertQuery = `INSERT INTO fees (student_id, course_id, fee_amount, due, paid, status, payment_date, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const feeValues = Object.values(feeFields);
      await new Promise((resolve, reject) => {
        db.query(feeInsertQuery, feeValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      // Insert enrollment into `enrollments` table
      const enrollmentFields = {
        course_id,
        child_id: userId, // The `user_id` acts as `child_id`
        enrollment_date: new Date(),
      };

      const enrollmentInsertQuery = `INSERT INTO enrollments (course_id, student_id, enrollment_date) VALUES (?, ?, ?)`;
      const enrollmentValues = Object.values(enrollmentFields);
      await new Promise((resolve, reject) => {
        db.query(enrollmentInsertQuery, enrollmentValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      // Commit the transaction
      db.commit((commitError) => {
        if (commitError) {
          return res.status(500).json({
            message: "Error committing transaction",
            error: commitError,
          });
        }

        res.status(201).json({
          message:
            "Student, user, parent, fees, and enrollment created successfully",
        });
      });
    } catch (error) {
      db.rollback(() => {
        res
          .status(500)
          .json({ message: "Error creating student", error: error.message });
      });
    }
  });
});

exports.getStudents = catchAsyncErrors(async (req, res) => {
  // Pagination parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
  const offset = (page - 1) * limit;

  // Optional class_id and section_id filters
  const classId = req.query.class_id;


  // Base query for fetching students
  let query = `
    SELECT 
      s.student_id,
      s.user_id,
      s.first_name AS student_first_name,
      s.middle_name AS student_middle_name,
      s.last_name AS student_last_name,
      s.gender,
      s.profile_photo AS student_profile_photo,
      s.date_of_birth,
      s.blood_group,
      s.phone AS student_phone,
      s.street_address,
      s.city,
      s.pin_code,
      s.created_at AS student_created_at,
      s.updated_at AS student_updated_at,
      p.parent_id,
      p.first_name AS parent_first_name,
      p.middle_name AS parent_middle_name,
      p.last_name AS parent_last_name,
      p.username,
      p.email AS parent_email,
      p.phone AS parent_phone,
      p.blood_group AS parent_blood_group,
      p.education AS parent_education,
      p.profession AS parent_profession,
      p.profile_photo AS parent_profile_photo,
      p.created_at AS parent_created_at,
      p.updated_at AS parent_updated_at,
      c.class_id,
      c.class_name,
      c.class_starting_on,
      c.class_ending_on,
      f.fee_amount,
      f.due,
      f.paid,
      f.status AS fee_status,
      e.enrollment_date,
      e.status AS enrollment_status
    FROM 
      students s
    LEFT JOIN 
      parents p ON s.student_id = p.student_id
    LEFT JOIN 
      student_class_details scd ON s.student_id = scd.student_id
    LEFT JOIN 
      classes c ON scd.class_id = c.class_id
    LEFT JOIN 
      fees f ON s.user_id = f.student_id
    LEFT JOIN 
      enrollments e ON s.user_id = e.student_id
  `;

  // Add filtering conditions based on class_id and section_id
  let conditions = [];
  let values = [];

  if (classId) {
    conditions.push(`c.class_id = ?`);
    values.push(classId);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
  values.push(limit, offset);

  // Execute the query
  db.query(query, values, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error fetching students", error });
    }

    // Get the total number of students
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM students s 
      LEFT JOIN student_class_details scd ON s.student_id = scd.student_id
      LEFT JOIN classes c ON scd.class_id = c.class_id
    `;
    let countValues = [];

    // Add conditions to the count query
    if (conditions.length > 0) {
      countQuery += ` WHERE ` + conditions.join(" AND ");
      countValues = values.slice(0, -2); // Remove limit and offset from countValues
    }

    db.query(countQuery, countValues, (countError, countResults) => {
      if (countError) {
        return res
          .status(500)
          .json({ message: "Error fetching total count", error: countError });
      }

      const totalStudents = countResults[0].total;
      const totalPages = Math.ceil(totalStudents / limit);

      // Format the response
      const formattedResults = results.map((student) => ({
        student_id: student.student_id,
        user_id: student.user_id,
        first_name: student.student_first_name,
        middle_name: student.student_middle_name,
        last_name: student.student_last_name,
        gender: student.gender,
        profile_photo: student.student_profile_photo,
        date_of_birth: student.date_of_birth,
        blood_group: student.blood_group,
        phone: student.student_phone,
        street_address: student.street_address,
        pin_code: student.pin_code,
        city: student.city,
        created_at: student.student_created_at,
        updated_at: student.student_updated_at,
        parent: {
          parent_id: student.parent_id,
          first_name: student.parent_first_name,
          middle_name: student.parent_middle_name,
          last_name: student.parent_last_name,
          username: student.username,
          email: student.parent_email,
          phone: student.parent_phone,
          blood_group: student.parent_blood_group,
          education: student.parent_education,
          profession: student.parent_profession,
          profile_photo: student.parent_profile_photo,
          created_at: student.parent_created_at,
          updated_at: student.parent_updated_at,
        },
        class: {
          class_id: student.class_id,
          class_name: student.class_name,
          class_starting_on: student.class_starting_on,
          class_ending_on: student.class_ending_on,
        },
        fee: {
          fee_amount: student.fee_amount,
          due: student.due,
          paid: student.paid,
          status: student.fee_status,
        },
        enrollment: {
          enrollment_date: student.enrollment_date,
          status: student.enrollment_status,
        },
      }));

      // Send response
      res.status(200).json({
        totalStudents,
        totalPages,
        currentPage: page,
        students: formattedResults,
      });
    });
  });
});

exports.updateStudent = catchAsyncErrors(async (req, res) => {
  const { student_id } = req.params; // Get student_id from the URL
  const { username, password, email, status, ...otherFields } = req.body; // Extract common user fields, other fields for nested objects

  db.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", error: err });
    }

    try {
      // Step 1: Update `users` table (if user-related fields are provided)
      if (username || password || email || status) {
        const userFields = [];
        const userValues = [];

        if (username) {
          userFields.push("username = ?");
          userValues.push(username);
        }
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10); // Hash password if updating
          userFields.push("password = ?");
          userValues.push(hashedPassword);
        }
        if (email) {
          userFields.push("email = ?");
          userValues.push(email);
        }
        if (status) {
          userFields.push("status = ?");
          userValues.push(status);
        }
        userValues.push(new Date(), student_id);

        const userUpdateQuery = `
          UPDATE users 
          SET ${userFields.join(", ")}, updated_at = ?
          WHERE user_id = (SELECT user_id FROM students WHERE student_id = ?)`;

        await new Promise((resolve, reject) => {
          db.query(userUpdateQuery, userValues, (error, results) => {
            if (error) return reject(error);
            resolve(results);
          });
        });
      }

      // Step 2: Update `students` table (if student-related fields are provided)
      const studentFields = [];
      const studentValues = [];
      const studentData = {
        first_name: otherFields.first_name,
        middle_name: otherFields.middle_name,
        last_name: otherFields.last_name,
        gender: otherFields.gender,
        profile_photo: otherFields.profile_photo,
        date_of_birth: otherFields.date_of_birth,
        blood_group: otherFields.blood_group,
        phone: otherFields.phone,
      };

      Object.keys(studentData).forEach((key) => {
        if (studentData[key] !== undefined) {
          studentFields.push(`${key} = ?`);
          studentValues.push(studentData[key]);
        }
      });

      if (studentFields.length > 0) {
        studentValues.push(new Date(), student_id);
        const studentUpdateQuery = `
          UPDATE students
          SET ${studentFields.join(", ")}, updated_at = ?
          WHERE student_id = ?`;

        await new Promise((resolve, reject) => {
          db.query(studentUpdateQuery, studentValues, (error, results) => {
            if (error) return reject(error);
            resolve(results);
          });
        });
      }

      // Step 3: Update section and class data dynamically (if provided)
      if (
        otherFields.section ||
        otherFields.class_name ||
        otherFields.roll_number
      ) {
        const schoolFields = [];
        const schoolValues = [];

        if (otherFields.class_name) {
          schoolFields.push("class_name = ?");
          schoolValues.push(otherFields.class_name);
        }
        if (otherFields.section) {
          schoolFields.push("section = ?");
          schoolValues.push(otherFields.section);
        }
        if (otherFields.roll_number) {
          schoolFields.push("roll_number = ?");
          schoolValues.push(otherFields.roll_number);
        }

        if (schoolFields.length > 0) {
          schoolValues.push(new Date(), student_id);
          const schoolUpdateQuery = `
            UPDATE student_school_details 
            SET ${schoolFields.join(", ")}, updated_at = ?
            WHERE student_id = ?`;

          await new Promise((resolve, reject) => {
            db.query(schoolUpdateQuery, schoolValues, (error, results) => {
              if (error) return reject(error);
              resolve(results);
            });
          });
        }
      }

      // Step 4: Update `parents` table dynamically (if parent-related fields are provided)
      const parentFields = [];
      const parentValues = [];
      const parentData = {
        parent_first_name: otherFields.parent_first_name,
        parent_middle_name: otherFields.parent_middle_name,
        parent_last_name: otherFields.parent_last_name,
        parent_username: otherFields.parent_username,
        parent_password: otherFields.parent_password, // Hash if needed
        parent_email: otherFields.parent_email,
        parent_phone: otherFields.parent_phone,
        parent_blood_group: otherFields.parent_blood_group,
        parent_education: otherFields.parent_education,
        parent_profession: otherFields.parent_profession,
        parent_profile_photo: otherFields.parent_profile_photo,
      };

      Object.keys(parentData).forEach(async (key) => {
        if (parentData[key] !== undefined) {
          if (key === "parent_password" && parentData[key]) {
            // Hash password if provided
            parentFields.push("password = ?");
            parentValues.push(await bcrypt.hash(parentData[key], 10));
          } else {
            parentFields.push(`${key} = ?`);
            parentValues.push(parentData[key]);
          }
        }
      });

      if (parentFields.length > 0) {
        parentValues.push(new Date(), student_id);
        const parentUpdateQuery = `
          UPDATE parents
          SET ${parentFields.join(", ")}, updated_at = ?
          WHERE student_id = ?`;

        await new Promise((resolve, reject) => {
          db.query(parentUpdateQuery, parentValues, (error, results) => {
            if (error) return reject(error);
            resolve(results);
          });
        });
      }

      // Commit the transaction
      db.commit((commitError) => {
        if (commitError) {
          return res.status(500).json({
            message: "Error committing transaction",
            error: commitError,
          });
        }

        res.status(200).json({
          message: "Student updated successfully",
          student_id,
        });
      });
    } catch (error) {
      // Rollback the transaction if any error occurs
      db.rollback(() => {
        res.status(500).json({ message: "Error updating student", error });
      });
    }
  });
});

exports.deleteStudent = catchAsyncErrors(async (req, res) => {
  const { student_id } = req.params;

  db.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", error: err });
    }

    try {
      // Step 1: Delete from the `parents` table based on `student_id`
      const deleteParentsQuery = `DELETE FROM parents WHERE student_id = ?`;
      await new Promise((resolve, reject) => {
        db.query(deleteParentsQuery, [student_id], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      // Step 2: Delete from the `student_school_details` table based on `student_id`
      const deleteSchoolDetailsQuery = `DELETE FROM student_class_details WHERE student_id = ?`;
      await new Promise((resolve, reject) => {
        db.query(deleteSchoolDetailsQuery, [student_id], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      // Step 3: Get `user_id` from the `students` table before deleting the student
      const getUserIdQuery = `SELECT user_id FROM students WHERE student_id = ?`;
      const user_id = await new Promise((resolve, reject) => {
        db.query(getUserIdQuery, [student_id], (error, results) => {
          if (error) return reject(error);
          resolve(results[0]?.user_id);
        });
      });

      // Step 4: Delete from the `students` table based on `student_id`
      const deleteStudentQuery = `DELETE FROM students WHERE student_id = ?`;
      await new Promise((resolve, reject) => {
        db.query(deleteStudentQuery, [student_id], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      // Step 5: Delete from the `users` table based on the retrieved `user_id`
      if (user_id) {
        const deleteUserQuery = `DELETE FROM users WHERE user_id = ?`;
        await new Promise((resolve, reject) => {
          db.query(deleteUserQuery, [user_id], (error, results) => {
            if (error) return reject(error);
            resolve(results);
          });
        });
      }

      // Commit the transaction
      db.commit((commitError) => {
        if (commitError) {
          return res.status(500).json({
            message: "Error committing transaction",
            error: commitError,
          });
        }

        res.status(200).json({
          message: "Student deleted successfully",
          student_id,
        });
      });
    } catch (error) {
      // Rollback the transaction in case of any error
      db.rollback(() => {
        res.status(500).json({
          message: "Error deleting student",
          error,
        });
      });
    }
  });
});

exports.getStudentByID = catchAsyncErrors(async (req, res) => {
  const { student_id } = req.params;

  try {
    // Step 1: Fetch student details from `students` and `users` tables
    const studentQuery = `
      SELECT s.student_id, s.user_id, s.first_name, s.middle_name, s.last_name, s.gender, 
             s.profile_photo, s.date_of_birth, s.street_address, s.city, s.pin_code, s.blood_group, 
             s.phone, s.created_at, s.updated_at,
             u.username, u.email, u.user_type, u.status, u.created_at AS user_created_at, 
             u.updated_at AS user_updated_at
      FROM students s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.student_id = ?`;

    const studentResult = await new Promise((resolve, reject) => {
      db.query(studentQuery, [student_id], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });

    if (!studentResult) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Step 2: Fetch parent details from the `parents` table
    const parentQuery = `
      SELECT parent_id, student_id, first_name, middle_name, last_name, username, email, phone, 
             blood_group, education, profession, profile_photo, created_at, updated_at
      FROM parents
      WHERE student_id = ?`;

    const parentResult = await new Promise((resolve, reject) => {
      db.query(parentQuery, [student_id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    // Step 3: Fetch enrollment details
    const enrollmentQuery = `
      SELECT e.enrollment_id, e.course_id, e.enrollment_date, c.course_name, c.course_description, c.instructor_id 
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ?`;

    const enrollmentResult = await new Promise((resolve, reject) => {
      db.query(enrollmentQuery, [studentResult.user_id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    // Step 4: Format and combine the data
    const studentData = {
      student_id: studentResult.student_id,
      user: {
        user_id: studentResult.user_id,
        username: studentResult.username,
        email: studentResult.email,
        user_type: studentResult.user_type,
        status: studentResult.status,
        created_at: studentResult.user_created_at,
        updated_at: studentResult.user_updated_at,
      },
      first_name: studentResult.first_name,
      middle_name: studentResult.middle_name,
      last_name: studentResult.last_name,
      gender: studentResult.gender,
      profile_photo: studentResult.profile_photo,
      date_of_birth: studentResult.date_of_birth,
      blood_group: studentResult.blood_group,
      phone: studentResult.phone,
      street_address: studentResult.street_address,
      pin_code: studentResult.pin_code,
      city: studentResult.city,
      created_at: studentResult.created_at,
      updated_at: studentResult.updated_at,
      parents: parentResult,
      enrollments: enrollmentResult.map((enrollment) => ({
        enrollment_id: enrollment.enrollment_id,
        course_id: enrollment.course_id,
        enrollment_date: enrollment.enrollment_date,
        course: {
          course_name: enrollment.course_name,
          description: enrollment.description,
          instructor_id: enrollment.instructor_id,
        },
      })),
    };

    // Step 5: Send the response with the full student data
    res.status(200).json({
      message: "Student fetched successfully",
      student: studentData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching student",
      error,
    });
  }
});

exports.getStudentByUserId = catchAsyncErrors(async (req, res) => {
  const { user_id } = req.params;

  try {
    // Step 1: Fetch student details from `students` and `users` tables
    const studentQuery = `
      SELECT s.student_id, s.user_id, s.first_name, s.middle_name, s.last_name, s.gender, 
             s.profile_photo, s.date_of_birth, s.street_address, s.city, s.pin_code, s.blood_group, 
             s.phone, s.created_at, s.updated_at,
             u.username, u.email, u.user_type, u.status, u.created_at AS user_created_at, 
             u.updated_at AS user_updated_at
      FROM students s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.user_id = ?`;

    const studentResult = await new Promise((resolve, reject) => {
      db.query(studentQuery, [user_id], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });

    if (!studentResult) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Step 2: Fetch parent details from the `parents` table
    const parentQuery = `
      SELECT parent_id, student_id, first_name, middle_name, last_name, username, email, phone, 
             blood_group, education, profession, profile_photo, created_at, updated_at
      FROM parents
      WHERE student_id = ?`;

    const parentResult = await new Promise((resolve, reject) => {
      db.query(parentQuery, [studentResult.student_id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    // Step 3: Fetch enrollment details
    const enrollmentQuery = `
      SELECT e.enrollment_id, e.course_id, e.enrollment_date, c.course_name, c.course_description, c.instructor_id 
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ?`;

    const enrollmentResult = await new Promise((resolve, reject) => {
      db.query(enrollmentQuery, [studentResult.user_id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    // Step 4: Format and combine the data
    const studentData = {
      student_id: studentResult.student_id,
      user: {
        user_id: studentResult.user_id,
        username: studentResult.username,
        email: studentResult.email,
        user_type: studentResult.user_type,
        status: studentResult.status,
        created_at: studentResult.user_created_at,
        updated_at: studentResult.user_updated_at,
      },
      first_name: studentResult.first_name,
      middle_name: studentResult.middle_name,
      last_name: studentResult.last_name,
      gender: studentResult.gender,
      profile_photo: studentResult.profile_photo,
      date_of_birth: studentResult.date_of_birth,
      blood_group: studentResult.blood_group,
      phone: studentResult.phone,
      street_address: studentResult.street_address,
      pin_code: studentResult.pin_code,
      city: studentResult.city,
      created_at: studentResult.created_at,
      updated_at: studentResult.updated_at,
      parents: parentResult,
      enrollments: enrollmentResult.map((enrollment) => ({
        enrollment_id: enrollment.enrollment_id,
        course_id: enrollment.course_id,
        enrollment_date: enrollment.enrollment_date,
        course: {
          course_name: enrollment.course_name,
          description: enrollment.description,
          instructor_id: enrollment.instructor_id,
        },
      })),
    };

    // Step 5: Send the response with the full student data
    res.status(200).json({
      message: "Student fetched successfully",
      student: studentData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching student",
      error,
    });
  }
});

exports.getStudentsFeesAndCourses = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch all students
    const [students] = await db.promise().query("SELECT * FROM students");

    if (!students.length) {
      return res
        .status(404)
        .json({ success: false, message: "No students found" });
    }

    const result = await Promise.all(
      students.map(async (student) => {
        // Get fees details for the student
        const [fees] = await db
          .promise()
          .query("SELECT * FROM fees WHERE student_id = ?", [student.user_id]);

        // Map fees to include course details
        const feesWithCourses = await Promise.all(
          fees.map(async (fee) => {
            const [course] = await db
              .promise()
              .query("SELECT * FROM courses WHERE course_id = ?", [
                fee.course_id,
              ]);

            return {
              ...fee,
              course: course[0] || null, // Include course details if found
            };
          })
        );

        // Return student with their fees and course details
        return {
          student,
          fees: feesWithCourses,
        };
      })
    );

    res.status(200).json({
      success: true,
      fees: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
