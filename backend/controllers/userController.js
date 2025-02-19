const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const db = require("../config/database");

dotenv.config();

exports.createUser = catchAsyncErrors(async (request, response) => {
  const userFields = request.body;
  const columns = Object.keys(userFields).join(", ");
  const values = Object.values(userFields);
  const placeholders = values.map(() => "?").join(", ");

  const query = `INSERT INTO users (${columns}) VALUES (${placeholders})`;

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);

      return response.status(500).json({ message: "Internal server error" });
    }
    response
      .status(201)
      .json({ message: "User created successfully", userId: results.insertId });
  });
});

exports.updateUser = catchAsyncErrors(async (request, response) => {
  const userId = request.params.userId;
  const userFields = request.body;
  console.log(userId, request.body);

  const columns = Object.keys(userFields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(userFields), userId];

  const query = `UPDATE users SET ${columns}, updated_at = NOW() WHERE user_id = ?`;

  db.query(query, values, (err, results) => {
    if (err) {
      return response.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return response.status(404).json({ message: "User not found" });
    }
    response.status(200).json({ message: "User updated successfully" });
  });
});

exports.deleteUser = catchAsyncErrors(async (request, response) => {
  const userId = request.params.id;
  const query = "DELETE FROM users WHERE user_id = ?";
  console.log("delete ");

  db.query(query, [userId], (err, results) => {
    if (err) {
      return response.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return response.status(404).json({ message: "User not found" });
    }
    response
      .status(200)
      .json({ id: userId, message: "User deleted successfully" });
  });
});

exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const { user_type } = req.query; // Filter by user_type if provided

  const query = user_type
    ? "SELECT * FROM users WHERE user_type = ?"
    : "SELECT * FROM users";

  db.query(query, user_type ? [user_type] : [], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users." });
    }
    res.status(200).json({ users: results });
  });
});

exports.getUserById = catchAsyncErrors(async (request, response) => {
  const { id } = request.params;
  const query = `
    SELECT users.*, stores.store_name 
    FROM users 
    LEFT JOIN stores ON users.store_id = stores.store_id
    WHERE users.user_id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      return response.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return response.status(404).json({ message: "User not found" });
    }
    response.status(200).json(results[0]);
  });
});

exports.getUserProfile = catchAsyncErrors(async (request, response) => {
  const userId = request.params.id;
  const query = "SELECT * FROM users WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      return response.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return response.status(404).json({ message: "User not found" });
    }
    response.status(200).json(results[0]);
  });
});

exports.getTotals = catchAsyncErrors(async (request, response) => {
  // Query to calculate total donations and total users
  const totalDonationsQuery =
    "SELECT SUM(amount) AS total_donations FROM donations";
  const totalUsersQuery = "SELECT COUNT(*) AS total_users FROM users";

  try {
    // Execute both queries asynchronously using Promise.all
    const [donationsResult, usersResult] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(totalDonationsQuery, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(totalUsersQuery, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }),
    ]);

    // Extract the total donations and users count
    const totalDonations = donationsResult[0].total_donations || 0;
    const totalUsers = usersResult[0].total_users || 0;

    // Respond with the totals
    response.status(200).json({
      total_donations: totalDonations,
      total_users: totalUsers,
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

exports.getNewUsers = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear(); // Get the current year
    const currentMonth = new Date().getMonth() + 1; // Get the current month (0-based in JS, so +1)

    console.log({
      currentYear, // Should be 2024
      currentMonth, // Should be 12
    });
    const page = parseInt(req.query.page, 10) || 1; // Default page is 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10 if not provided
    const offset = (page - 1) * limit; // Calculate offset for pagination

    // Validate parameters to ensure they are integers
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit value",
      });
    }

    // Query to fetch paginated users
    const dataQuery = `
SELECT user_id, username, email, user_type, status, created_at
FROM users
WHERE YEAR(created_at) =  ${currentYear} AND MONTH(created_at) = ${currentMonth} 
LIMIT ${limit} OFFSET ${offset};
    `;

    // Query to count the total number of users
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE YEAR(created_at) = ?
        AND MONTH(created_at) = ?
    `;

    // Execute queries
    const [users] = await db.promise().execute(dataQuery);
    const [countResult] = await db
      .promise()
      .execute(countQuery, [currentYear, currentMonth]);

    const total = countResult[0].total; // Total users

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit), // Calculate total pages
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
