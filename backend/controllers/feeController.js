const db = require("../config/database"); // Your database connection file
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");

// Create a new fee
exports.createFee = catchAsyncErrors(async (req, res, next) => {
  const {
    student_id,
    course_id,
    fee_amount,
    due,
    paid,
    status,
    payment_date,
    payment_method,
  } = req.body;

  if (!student_id || !course_id || !fee_amount || !status) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide all required fields: student_id, course_id, fee_amount, and status.",
    });
  }

  const query = `
      INSERT INTO fees (student_id, course_id, fee_amount, due, paid, status, payment_date, payment_method, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
  const values = [
    student_id,
    course_id,
    fee_amount,
    due || 0,
    paid || 0,
    status,
    payment_date || null,
    payment_method || null,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create fee",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Fee created successfully",
      fee_id: results.insertId,
    });
  });
});

// Get all fees
exports.getFeesByStudentId = catchAsyncErrors(async (req, res, next) => {
  const { student_id } = req.params;

  // SQL query to fetch fees along with course information
  const query = `
    SELECT 
      f.fee_id,
      f.student_id,
      f.course_id,
      c.course_name,
      c.course_price AS total_fee,
      f.fee_amount,
      f.due,
      f.paid,
      f.status,
      f.payment_date,
      f.payment_method,
      f.created_at,
      f.updated_at
    FROM 
      fees f
    JOIN 
      courses c ON f.course_id = c.course_id
    WHERE 
      f.student_id = ?`;

  db.query(query, [student_id], (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch fees for the student",
        error: error.message,
      });
    }

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No fees found for student ID: ${student_id}`,
        fees: [],
      });
    }

    res.status(200).json({
      success: true,
      message: `Fees for student ID: ${student_id} fetched successfully`,
      fees: results,
    });
  });
});

exports.getAllFees = catchAsyncErrors(async (req, res, next) => {
  // SQL query to fetch fees along with course information
  const query = `
    SELECT 
      f.fee_id,
      f.student_id,
      f.course_id,
      c.course_name,
      c.course_price AS total_fee,
      f.fee_amount,
      f.due,
      f.paid,
      f.status,
      f.payment_date,
      f.payment_method,
      f.created_at,
      f.updated_at
    FROM 
      fees f
    JOIN 
      courses c ON f.course_id = c.course_id`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch fees",
        error: error.message,
      });
    }

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No fees found",
        fees: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Fees fetched successfully",
      fees: results,
    });
  });
});

exports.getCourseFeesSummary = catchAsyncErrors(async (req, res, next) => {
  try {
    const query = `
      SELECT 
        c.course_id, 
        c.course_name,
        c.course_description,
        c.course_price,
        COUNT(e.student_id) AS enrollment_count,
        SUM(f.paid) AS total_paid,
        SUM(f.due) AS total_due,
        (COUNT(e.student_id) * c.course_price) AS total_fee
      FROM courses c
      LEFT JOIN enrollments e ON c.course_id = e.course_id
      LEFT JOIN fees f ON e.student_id = f.student_id AND e.course_id = f.course_id
      GROUP BY c.course_id, c.course_name, c.course_description, c.course_price;
    `;

    const [results] = await db.promise().execute(query);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
})

exports.getIndividualCourseFeesSummary = catchAsyncErrors( async (req, res, next) => {
  try {
    const { course_id } = req.params;

    const query = `
      SELECT 
        c.course_id, 
        c.course_name,
        c.course_description,
        c.course_fee,
        COUNT(e.student_id) AS enrollment_count,
        SUM(f.paid) AS total_paid,
        SUM(f.due) AS total_due,
        (COUNT(e.student_id) * c.course_fee) AS total_fee
      FROM courses c
      LEFT JOIN enrollments e ON c.course_id = e.course_id
      LEFT JOIN fees f ON e.student_id = f.student_id AND e.course_id = f.course_id
      WHERE c.course_id = ?
      GROUP BY c.course_id, c.course_name, c.course_description, c.course_fee;
    `;

    const [results] = await db.promise().execute(query, [course_id]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    next(error);
  }
})
