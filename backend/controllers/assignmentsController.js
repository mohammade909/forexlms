const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");

// Create a new assignment
exports.createAssignment = catchAsyncErrors(async (req, res) => {
  const {
    course_id,
    class_id,
    instructor_id,
    title,
    description,
    due_date,
    max_score,
    excerpt
  } = req.body;

  try {
    const query = `
      INSERT INTO assignments (course_id, class_id, instructor_id, title, description,excerpt, due_date, max_score) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          course_id,
          class_id,
          instructor_id,
          title,
          description,
          excerpt,
          due_date,
          max_score,
        ],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    res.status(201).json({
      message: "Assignment created successfully.",
      assignment_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Get all assignments
exports.getAssignments = catchAsyncErrors(async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, classId } = req.query;
     
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Base query with optional filters
    let query = `
      SELECT 
        a.*, 
        c.course_name, 
        c.course_description, 
        cl.class_name, 
        cl.class_starting_on, 
        cl.class_ending_on
      FROM assignments a
      LEFT JOIN classes cl ON a.class_id = cl.class_id 
      LEFT JOIN courses c ON a.course_id = c.course_id 
      WHERE 1=1
    `;

    const params = [];

 
    if (classId) {
      query += ` AND a.class_id = ?`;
      params.push(classId);
    }
    
    

    // Add optional date range filter
    if (startDate && endDate) {
      query += ` AND DATE(a.created_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    // Execute the query
    const assignments = await new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Get total count for pagination metadata
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM assignments a
      WHERE 1=1
    `;

    const countParams = [];

    if (classId) {
      countQuery += ` AND a.class_id = ?`;
      countParams.push(classId);
    }

    if (startDate && endDate) {
      countQuery += ` AND DATE(a.created_at) BETWEEN ? AND ?`;
      countParams.push(startDate, endDate);
    }

    const total = await new Promise((resolve, reject) => {
      db.query(countQuery, countParams, (err, results) => {
        if (err) return reject(err);
        resolve(results[0].total);
      });
    });

    // Send response
    res.status(200).json({
      assignments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

exports.getAssignmentWithDetailsById = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const query = `
      SELECT 
        -- Assignment details
        a.assignment_id, 
        a.title AS assignment_title, 
        a.description AS assignment_description, 
        a.due_date, 
        a.max_score,
        
        -- Course details
        c.course_id, 
        c.course_name, 
        c.course_code, 
        c.course_category, 
        c.course_level, 
        c.course_language,

        cl.class_id, 
        cl.class_name, 
        cl.class_starting_on, 
        cl.class_ending_on, 

        -- Teacher details
        t.teacher_id, 
        t.first_name, 
        t.last_name, 
        t.phone, 
        t.qualification

      FROM assignments a
      LEFT JOIN courses c ON a.course_id = c.course_id
      LEFT JOIN classes cl ON a.class_id = cl.class_id
      LEFT JOIN teachers t ON a.instructor_id = t.teacher_id
      WHERE a.assignment_id = ?;
    `;

      const [rows] = await db.promise().execute(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Assignment with ID ${id} not found`,
        });
      }

      res.status(200).json({
        success: true,
        assignment: rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the assignment details",
        error: error.message,
      });
    }
  }
);

exports.getSubmissionDetails = catchAsyncErrors(async (req, res, next) => {
  const { assignment_id, student_id } = req.params;

  try {
    const query = `
        SELECT 
          s.submission_id, 
          s.assignment_id, 
          s.student_id, 
          s.submitted_at, 
          s.file_url, 
          s.grade, 
          s.feedback, 
          s.status, 
          s.updated_at
        FROM submissions s
        WHERE s.assignment_id = ? AND s.student_id = ?;
      `;

    const [rows] = await db
      .promise()
      .execute(query, [assignment_id, student_id]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: false,
        submissions: [],
        message: `No submissions found for assignment ID ${assignment_id} and student ID ${student_id}`,
      });
    }

    res.status(200).json({
      success: true,
      submissions: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the submission details",
      error: error.message,
    });
  }
});

exports.getAssignmentsByCourse = catchAsyncErrors(async (req, res) => {
  const { id: course_id } = req.params;
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    // Ensure course_id is provided
    if (!course_id) {
      return res.status(400).json({ message: "course_id is required" });
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Base query for fetching assignments
    let query = `
      SELECT 
        a.*, 
        c.course_name, 
        c.course_description 
      FROM assignments a
      LEFT JOIN courses c ON a.course_id = c.course_id 
      WHERE a.course_id = ?
    `;

    const params = [course_id];

    // Add optional date range filter
    if (startDate && endDate) {
      query += ` AND DATE(a.created_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    // Execute the query
    const assignments = await new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Get total count for pagination metadata
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM assignments a
      WHERE a.course_id = ?
    `;

    const countParams = [course_id];

    if (startDate && endDate) {
      countQuery += ` AND DATE(a.created_at) BETWEEN ? AND ?`;
      countParams.push(startDate, endDate);
    }

    const total = await new Promise((resolve, reject) => {
      db.query(countQuery, countParams, (err, results) => {
        if (err) return reject(err);
        resolve(results[0].total);
      });
    });

    // Send response
    res.status(200).json({
      assignments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update an assignment
exports.updateAssignment = catchAsyncErrors(async (req, res) => {
  const { assignment_id, title, description, due_date, max_score } = req.body;

  try {
    const query = `
      UPDATE assignments 
      SET title = ?, description = ?, due_date = ?, max_score = ? 
      WHERE assignment_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(
        query,
        [title, description, due_date, max_score, assignment_id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    res.status(200).json({ message: "Assignment updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete an assignment
exports.deleteAssignment = catchAsyncErrors(async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const query = `DELETE FROM assignments WHERE assignment_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(query, [assignment_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(200).json({ message: "Assignment deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
