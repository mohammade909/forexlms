const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");
const { createUser, createEntries } = require("../utils/helpers");
const { request } = require("express");
// CREATE Teacher

exports.createTeacher = catchAsyncErrors(async (req, res) => {
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
    blood_group,
    phone,
    qualification,
    address,
    // teacher data
    joining_date,
    leaving_date,
    current_position,
    employee_code,
    working_hours_per_week, // teacher_school_details data
  } = req.body;

  // Start a database transaction
  db.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", error: err });
    }

    try {
      // Step 1: Hash the password for the user
      // const hashedPassword = await bcrypt.hash(password, 10);

      // Step 2: Create the user data for the `users` table
      const userFields = {
        username,
        password,
        email,
        user_type: "teacher", // always teacher
        status,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Step 3: Insert the user into the `users` table
      const userInsertQuery = `INSERT INTO users (username, password, email, user_type, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const userValues = Object.values(userFields);
      const userResult = await new Promise((resolve, reject) => {
        db.query(userInsertQuery, userValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      const userId = userResult.insertId; // Get the newly created user_id from `users`

      // Step 4: Prepare the teacher's details for the `teachers` table
      const teacherFields = {
        user_id: userId, // The foreign key to users table
        first_name,
        middle_name,
        last_name,
        gender,
        profile_photo,
        date_of_birth,
        blood_group,
        phone,
        qualification,
        address,
        hire_date: new Date(),
        status,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Step 5: Insert the teacher data into `teachers` table
      const teacherInsertQuery = `INSERT INTO teachers (user_id, first_name, middle_name, last_name, gender, profile_photo, date_of_birth, blood_group, phone, qualification, address, hire_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const teacherValues = Object.values(teacherFields);
      const teacherResult = await new Promise((resolve, reject) => {
        db.query(teacherInsertQuery, teacherValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      const teacherId = teacherResult.insertId; // Get the newly created teacher_id

      // Step 6: Add school-related information to `teacher_school_details`
      const schoolDetails = {
        teacher_id: teacherId, // Foreign key from teacher
        joining_date,
        leaving_date,
        current_position,
        employee_code,
        working_hours_per_week,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const schoolInsertQuery = `INSERT INTO teacher_school_details (teacher_id, joining_date, leaving_date, current_position, employee_code, working_hours_per_week, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const schoolValues = Object.values(schoolDetails);
      const schoolResult = await new Promise((resolve, reject) => {
        db.query(schoolInsertQuery, schoolValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      // If all inserts are successful, commit the transaction
      db.commit((commitError) => {
        if (commitError) {
          return res.status(500).json({
            message: "Error committing transaction",
            error: commitError,
          });
        }

        // Step 7: Success response
        res.status(201).json({
          message: "Teacher and user created successfully",
          userId: userId,
          teacherId: teacherId,
          schoolDetailId: schoolResult.insertId,
        });
      });
    } catch (error) {
      console.log(error.message);

      // Rollback transaction on error
      db.rollback(() => {
        res
          .status(500)
          .json({ message: "Error creating teacher", error: error.message });
      });
    }
  });
});
// UPDATE Teacher
exports.updateTeacher = catchAsyncErrors(async (req, res) => {
  const teacherId = req.params.teacherId;
  const {
    username,
    password,
    email,
    status,
    first_name,
    middle_name,
    last_name,
    gender,
    profile_photo,
    date_of_birth,
    blood_group,
    phone,
    qualification,
    address,
    hire_date,
  } = req.body;

  // Begin transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", error: err });
    }

    // Step 1: Update user details in the `users` table (if provided)
    const userFields = {
      username,
      password, // Assumes password is hashed if provided
      email,
      status,
      updated_at: new Date(),
    };

    const updateUserFields = Object.keys(userFields).reduce((acc, key) => {
      if (userFields[key] !== undefined) {
        acc[key] = userFields[key];
      }
      return acc;
    }, {});

    if (Object.keys(updateUserFields).length > 0) {
      const userColumns = Object.keys(updateUserFields)
        .map((key) => `${key} = ?`)
        .join(", ");
      const userValues = [...Object.values(updateUserFields), teacherId];

      const userQuery = `UPDATE users SET ${userColumns} WHERE user_id = (SELECT user_id FROM teachers WHERE teacher_id = ?)`;

      db.query(userQuery, userValues, (err, userResults) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({
              message: "Error updating user details",
              error: err,
            });
          });
        }

        if (userResults.affectedRows === 0) {
          return db.rollback(() => {
            return res.status(404).json({ message: "User not found" });
          });
        }
      });
    }

    // Step 2: Update teacher details in the `teachers` table (if provided)
    const teacherFields = {
      first_name,
      middle_name,
      last_name,
      gender,
      profile_photo,
      date_of_birth,
      blood_group,
      phone,
      qualification,
      address,
      hire_date,
      status,
      updated_at: new Date(),
    };

    const updateTeacherFields = Object.keys(teacherFields).reduce(
      (acc, key) => {
        if (teacherFields[key] !== undefined) {
          acc[key] = teacherFields[key];
        }
        return acc;
      },
      {}
    );

    if (Object.keys(updateTeacherFields).length > 0) {
      const teacherColumns = Object.keys(updateTeacherFields)
        .map((key) => `${key} = ?`)
        .join(", ");
      const teacherValues = [...Object.values(updateTeacherFields), teacherId];

      const teacherQuery = `UPDATE teachers SET ${teacherColumns} WHERE teacher_id = ?`;

      db.query(teacherQuery, teacherValues, (err, teacherResults) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({
              message: "Error updating teacher details",
              error: err,
            });
          });
        }

        if (teacherResults.affectedRows === 0) {
          return db.rollback(() => {
            return res.status(404).json({ message: "Teacher not found" });
          });
        }
      });
    }

    // Commit transaction if everything was successful
    db.commit((err) => {
      if (err) {
        return db.rollback(() => {
          return res
            .status(500)
            .json({ message: "Error committing transaction", error: err });
        });
      }

      res
        .status(200)
        .json({ message: "Teacher and user details updated successfully" });
    });
  });
});

// DELETE Teacher
exports.deleteTeacher = catchAsyncErrors(async (req, res) => {
  const teacherId = req.params.teacherId;
  const query = "DELETE FROM teachers WHERE teacher_id = ?";

  db.query(query, [teacherId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res
      .status(200)
      .json({ id: teacherId, message: "Teacher deleted successfully" });
  });
});

// GET All Teachers
exports.getTeachers = catchAsyncErrors(async (req, res) => {
  const query = `
    SELECT 
      t.teacher_id, 
      t.first_name, 
      t.middle_name, 
      t.last_name, 
      t.gender, 
      t.profile_photo, 
      t.date_of_birth, 
      t.blood_group, 
      t.phone, 
      t.qualification, 
      t.address, 
      t.hire_date, 
      t.status, 
      t.created_at AS teacher_created_at, 
      t.updated_at AS teacher_updated_at,
      c.class_id, 
      c.class_name, 
      c.class_starting_on, 
      c.class_ending_on, 
      c.instructor_id,
      cr.course_id,
      cr.course_name,
      cr.course_description,
      u.user_id,
      u.username,
      u.email,
      u.user_type,
      u.created_at AS user_created_at,
      u.updated_at AS user_updated_at
    FROM 
      teachers t
    LEFT JOIN 
      classes c ON t.teacher_id = c.instructor_id
    LEFT JOIN 
      courses cr ON c.course_id = cr.course_id
    LEFT JOIN 
      users u ON t.user_id = u.user_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching teachers:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", error: err });
    }

    // Process results to group by teacher
    const teachersMap = {};

    results.forEach((row) => {
      const teacherId = row.teacher_id;

      // If teacher not already in map, initialize their data
      if (!teachersMap[teacherId]) {
        teachersMap[teacherId] = {
          teacher_id: row.teacher_id,
          first_name: row.first_name,
          middle_name: row.middle_name,
          last_name: row.last_name,
          gender: row.gender,
          profile_photo: row.profile_photo,
          date_of_birth: row.date_of_birth,
          blood_group: row.blood_group,
          phone: row.phone,
          qualification: row.qualification,
          address: row.address,
          hire_date: row.hire_date,
          status: row.status,
          teacher_created_at: row.teacher_created_at,
          teacher_updated_at: row.teacher_updated_at,
          user: {
            user_id: row.user_id,
            username: row.username,
            email: row.email,
            user_type: row.user_type,
            user_created_at: row.user_created_at,
            user_updated_at: row.user_updated_at,
          },
          classes: [],
        };
      }

      // Add class details if present
      if (row.class_id) {
        teachersMap[teacherId].classes.push({
          class_id: row.class_id,
          class_name: row.class_name,
          class_starting_on: row.class_starting_on,
          class_ending_on: row.class_ending_on,
          instructor_id: row.instructor_id,
          course: {
            course_id: row.course_id,
            course_name: row.course_name,
            course_description: row.course_description,
          },
        });
      }
    });

    // Convert map to array
    const teachersArray = Object.values(teachersMap);

    res.status(200).json({
      success: true,
      data: teachersArray,
    });
  });
});


exports.getTeacherByUserId = catchAsyncErrors(async (req, res) => {
  const { userId } = req.params; // Extract user_id from the request parameters

  const query = `
    SELECT 
      t.teacher_id, 
      t.first_name, 
      t.middle_name, 
      t.last_name, 
      t.gender, 
      t.profile_photo, 
      t.date_of_birth, 
      t.blood_group, 
      t.phone, 
      t.qualification, 
      t.address, 
      t.hire_date, 
      t.status, 
      t.created_at AS teacher_created_at, 
      t.updated_at AS teacher_updated_at,
      c.class_id, 
      c.class_name, 
      c.class_starting_on, 
      c.class_ending_on, 
      c.instructor_id,
      cr.course_id,
      cr.course_name,
      cr.course_description,
      u.user_id,
      u.username,
      u.email,
      u.user_type,
      u.created_at AS user_created_at,
      u.updated_at AS user_updated_at
    FROM 
      teachers t
    LEFT JOIN 
      classes c ON t.teacher_id = c.instructor_id
    LEFT JOIN 
      courses cr ON c.course_id = cr.course_id
    LEFT JOIN 
      users u ON t.user_id = u.user_id
    WHERE 
      t.user_id = ?
  `;
 

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching teacher details:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", error: err });
    }

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        data: [], // Return the first (and only) result as an object
      });
    }

    res.status(200).json({
      success: true,
      data: results[0], // Return the first (and only) result as an object
    });
  });
});

// GET Teacher By ID
exports.getTeacherById = catchAsyncErrors(async (req, res) => {
  const { teacherId } = req.params;

  const query = `
      SELECT 
        t.teacher_id, 
        t.first_name, 
        t.middle_name, 
        t.last_name, 
        t.gender, 
        t.profile_photo, 
        t.date_of_birth, 
        t.blood_group, 
        t.phone, 
        t.qualification, 
        t.address, 
        t.hire_date, 
        t.status, 
        t.created_at AS teacher_created_at, 
        t.updated_at AS teacher_updated_at,
        ts.detail_id,
        ts.joining_date,
        ts.leaving_date,
        ts.current_position,
        ts.employee_code,
        ts.working_hours_per_week,
        ts.created_at AS school_details_created_at,
        ts.updated_at AS school_details_updated_at,
        c.class_id,
        c.class_name,
        c.class_starting_on,
        c.class_ending_on,
        s.subject_id,
        s.subject_name,
        s.subject_code,
        s.book_name,
        sec.section_id,
        sec.section_name,
        sec.section_capacity
      FROM 
        teachers t
      LEFT JOIN 
        teacher_school_details ts ON t.teacher_id = ts.teacher_id
      LEFT JOIN 
        sections sec ON t.teacher_id = sec.teacher_id
      LEFT JOIN 
        classes c ON sec.class_id = c.class_id
      LEFT JOIN 
        subjects s ON c.class_id = s.class_id AND sec.section_id = s.section_id
      WHERE 
        t.teacher_id = ?
    `;

  db.query(query, [teacherId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Structure the response data
    const responseData = {
      teacher: {
        teacher_id: results[0].teacher_id,
        first_name: results[0].first_name,
        middle_name: results[0].middle_name,
        last_name: results[0].last_name,
        gender: results[0].gender,
        profile_photo: results[0].profile_photo,
        date_of_birth: results[0].date_of_birth,
        blood_group: results[0].blood_group,
        phone: results[0].phone,
        qualification: results[0].qualification,
        address: results[0].address,
        hire_date: results[0].hire_date,
        status: results[0].status,
        created_at: results[0].teacher_created_at,
        updated_at: results[0].teacher_updated_at,
        school_details: {
          detail_id: results[0].detail_id,
          joining_date: results[0].joining_date,
          leaving_date: results[0].leaving_date,
          current_position: results[0].current_position,
          employee_code: results[0].employee_code,
          working_hours_per_week: results[0].working_hours_per_week,
          created_at: results[0].school_details_created_at,
          updated_at: results[0].school_details_updated_at,
        },
        classes: [],
      },
    };

    // Process the results to aggregate classes, sections, and subjects
    results.forEach((row) => {
      const {
        class_id,
        class_name,
        class_starting_on,
        class_ending_on,
        section_id,
        section_name,
        section_capacity,
        subject_id,
        subject_name,
        subject_code,
        book_name,
      } = row;

      // Check if class already exists in the response
      const classIndex = responseData.teacher.classes.findIndex(
        (cls) => cls.class_id === class_id
      );

      if (classIndex === -1 && class_id) {
        // If class doesn't exist, add it
        responseData.teacher.classes.push({
          class_id,
          class_name,
          class_starting_on,
          class_ending_on,
          sections: [],
        });
      }

      // If there's a section, add it to the respective class
      if (section_id) {
        const section = {
          section_id,
          section_name,
          section_capacity,
          subjects: [],
        };

        const classItem = responseData.teacher.classes.find(
          (cls) => cls.class_id === class_id
        );

        // Only add the section if it belongs to the found class
        if (classItem) {
          classItem.sections.push(section);
        }
      }

      // If there's a subject, add it to the respective section
      if (subject_id) {
        const subject = {
          subject_id,
          subject_name,
          subject_code,
          book_name,
        };

        const classItem = responseData.teacher.classes.find(
          (cls) => cls.class_id === class_id
        );
        if (classItem) {
          const sectionItem = classItem.sections.find(
            (sec) => sec.section_id === section_id
          );
          if (sectionItem) {
            sectionItem.subjects.push(subject);
          }
        }
      }
    });

    res.status(200).json(responseData);
  });
});
