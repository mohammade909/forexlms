const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const sendToken = require("../utils/jwtToken");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const multer = require("multer");
const db = require("../config/database");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tubedev87@gmail.com",
    pass: "fipn xijp mame dmzj",
  },
});
const executeQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
const generateUniqueUsername = async (firstName, lastName) => {
  const baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  let username = baseUsername;
  let isUnique = false;
  let counter = 0;

  while (!isUnique) {
    const query = "SELECT * FROM users WHERE username = ?";
    const values = [username];
    const rows = await executeQuery(query, values);

    if (rows.length === 0) {
      isUnique = true;
    } else {
      counter += 1;
      username = `${baseUsername}${counter}`;
    }
  }

  return username;
};

// exports.signup = catchAsyncErrors(async (request, response, next) => {
//   const userFields = request.body;

//   if (
//     !userFields.email ||
//     !userFields.password ||
//     !userFields.first_name ||
//     !userFields.last_name
//   ) {
//     return response
//       .status(400)
//       .json({
//         message: "First name, last name, email, and password are required",
//       });
//   }

//   try {
//     // Check if the user already exists
//     const queryCheckUser = "SELECT * FROM users WHERE email = ?";
//     const valuesCheckUser = [userFields.email];
//     const rowsCheckUser = await executeQuery(queryCheckUser, valuesCheckUser);

//     if (rowsCheckUser.length > 0) {
//       return response.status(400).json({ message: "User already exists" });
//     }

//     // Generate a unique username
//     userFields.username = await generateUniqueUsername(
//       userFields.first_name,
//       userFields.last_name
//     );

//     // Hash the password
//     // userFields.password = await bcrypt.hash(userFields.password, 10);

//     // Prepare the dynamic query
//     const columns = Object.keys(userFields).join(", ");
//     const placeholders = Object.keys(userFields)
//       .map(() => "?")
//       .join(", ");
//     const values = Object.values(userFields);

//     const queryInsertUser = `
//       INSERT INTO users (${columns}, created_at, updated_at)
//       VALUES (${placeholders}, NOW(), NOW())
//     `;

//     await executeQuery(queryInsertUser, values);

//     // Get the newly created user
//     const queryGetUser = "SELECT * FROM users WHERE email = ?";
//     const rowsGetUser = await executeQuery(queryGetUser, [userFields.email]);
//     const newUser = rowsGetUser[0];

//     // Create a JWT
//     // response.status(201).json({ message: "Account Created successfully!" });

//     sendToken(newUser, 201, response);
//   } catch (error) {
//     console.error(error);
//     response.status(500).json({ message: "Internal server error" });
//   }
// });

exports.signin = catchAsyncErrors(async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    // Query to find user by email
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [email, password];

    // Function to execute the query
    const executeQuery = (query, values) => {
      return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    };

    // Execute query to fetch user data
    const rows = await executeQuery(query, values);
    if (rows.length === 0) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    } else {
      const user = rows[0];
      sendToken(user, 201, response);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//  Log Out User
exports.signout = catchAsyncErrors(async (request, response, next) => {
  response.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  response.status(200).json({
    success: true,
    message: "Logout successfully !",
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedData = req.body;
  const { ...updatedFields } = updatedData;

  const updateFieldsString = Object.keys(updatedFields)
    .map((key) => `${key}="${updatedFields[key]}"`)
    .join(", ");

  const sql = `UPDATE users SET ${updateFieldsString} WHERE user_id = ${req.user.id};`;
  console.log(sql);
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during update:", err);
      next(new ErrorHandler("Error during update", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Update successful" });
    } else {
      next(new ErrorHandler("User not found or no changes applied", 404));
    }
  });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  const ID = req.user.id;

  const sql = `SELECT * FROM users WHERE user_id = ${ID};`;
  console.log(sql);

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during profile retrieval:", err);
      return next(new ErrorHandler("Error during profile retrieval", 500));
    }

    if (result.length > 0) {
      const { password, ...rest } = result[0];
      res.status(200).json({ success: true, user: rest });
    } else {
      return next(new ErrorHandler("User not found", 404));
    }
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results, fields) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        if (results.length === 0) {
          return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];
        const resetToken = uuidv4();

        const jwtToken = jwt.sign(
          { id: user.user_id, resetToken },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        db.query(
          `UPDATE users SET reset_password_token = ?, reset_password_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE user_id = ?`,
          [jwtToken, user.user_id],
          async (error, results, fields) => {
            if (error) {
              return res.status(500).json({ message: error.message });
            }
            try {
              await transporter.sendMail({
                from: "school-managemen@gmail.com",
                to: email,
                subject: "Password Reset",
                html: `<p>Click <a href="http://localhost:3000/reset-password/${jwtToken}">here</a> to reset your password.</p>`,
              });

              res.status(200).json({
                message: "Reset token generated and sent to " + email,
              });
            } catch (error) {
              res.status(500).json({ message: error.message });
            }
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  try {
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and newPassword are required" });
    }

    const [results] = await db
      .promise()
      .query(
        "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expiry > NOW()",
        [token]
      );

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const teacher = results[0];

    await db
      .promise()
      .query(
        "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expiry = NULL WHERE user_id = ?",
        [hashedPassword, user.user_id]
      );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

exports.shutdownServer = catchAsyncErrors(async (req, res, next) => {
  const { message, status } = req.body;

  if (status === undefined) {
    return next(new ErrorHandler("Status is required", 400));
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "UPDATE server_shutdown SET message = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
        [message, status]
      );

    if (result.affectedRows === 0) {
      return next(new ErrorHandler("No entry found with the given ID", 404));
    }

    res.status(200).json({
      message: "Shutdown message updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Error updating shutdown message", 500));
  }
});

exports.getServerStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const [shutdownStatus] = await db
      .promise()
      .query("SELECT * FROM server_shutdown WHERE id = 1");
    res.status(200).json({
      shutdown: shutdownStatus[0] || {},
    });
  } catch (error) {
    return next(new ErrorHandler("Error retrieving server status", 500));
  }
});

// Controller to get the counts
exports.getMatrix = catchAsyncErrors(async (req, res, next) => {
  // Query to get all required counts
  const [teachersCount] = await db
    .promise()
    .query("SELECT COUNT(*) AS total_teachers FROM teachers");
  const [newTeachersCount] = await db
    .promise()
    .query(
      "SELECT COUNT(*) AS new_teachers FROM teachers WHERE created_at >= NOW() - INTERVAL 1 WEEK"
    );
  const [classesCount] = await db
    .promise()
    .query("SELECT COUNT(*) AS total_classes FROM classes");
  const [studentsCount] = await db
    .promise()
    .query("SELECT COUNT(*) AS total_students FROM students");
  const [newStudentsCount] = await db
    .promise()
    .query(
      "SELECT COUNT(*) AS new_students FROM students WHERE created_at >= NOW() - INTERVAL 1 WEEK"
    );
  const [classesWithSections] = await db.promise().query(`
      SELECT c.class_id, c.class_name, COUNT(s.section_id) AS sections_count
      FROM classes c
      LEFT JOIN sections s ON c.class_id = s.class_id
      GROUP BY c.class_id
  `);
  const [subjectsCount] = await db
    .promise()
    .query("SELECT COUNT(*) AS total_subjects FROM subjects");
  const [usersCount] = await db
    .promise()
    .query("SELECT COUNT(*) AS total_users FROM users");

  // Send the data as JSON response
  res.status(200).json({
    success: true,
    data: {
      total_teachers: teachersCount[0].total_teachers,
      new_teachers: newTeachersCount[0].new_teachers,
      total_classes: classesCount[0].total_classes,
      total_students: studentsCount[0].total_students,
      new_students: newStudentsCount[0].new_students,
      classes_with_sections: classesWithSections,
      total_subjects: subjectsCount[0].total_subjects,
      total_users: usersCount[0].total_users,
    },
  });
});
