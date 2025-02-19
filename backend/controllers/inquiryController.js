const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");

// Create a new course inquiry
exports.createInquiry = catchAsyncErrors(async (req, res) => {
  const { firstName, lastName, email, phone, course, message } = req.body;
  const student_name = firstName + " " + lastName;
  console.log(req.body);
  
  const insertQuery = `
    INSERT INTO course_inquiries (student_name, student_email, student_phone, course_id, inquiry_message, status) 
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;

  const values = [student_name, email, phone, course, message];

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(insertQuery, values, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    res.status(201).json({
      message: "Inquiry created successfully",
      inquiry_id: result.insertId,
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Error creating inquiry", error: error.message });
  }
});

// Get all inquiries
exports.getAllInquiries = catchAsyncErrors(async (req, res) => {
  const selectQuery = `
    SELECT 
      ci.inquiry_id,  
      ci.student_name, 
      ci.student_email, 
      ci.student_phone, 
      ci.inquiry_message, 
      ci.inquiry_date, 
      ci.course_id,
      c.course_name, 
      c.course_price, 
      c.course_description 
    FROM 
      course_inquiries ci
    LEFT JOIN 
      courses c 
    ON 
      ci.course_id = c.course_id
  `;

  try {
    const inquiries = await new Promise((resolve, reject) => {
      db.query(selectQuery, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    res.status(200).json(inquiries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inquiries", error: error.message });
  }
});


// Get a single inquiry by ID
exports.getInquiryById = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const selectQuery = "SELECT * FROM course_inquiries WHERE inquiry_id = ?";

  try {
    const inquiry = await new Promise((resolve, reject) => {
      db.query(selectQuery, [id], (error, results) => {
        if (error) return reject(error);
        if (results.length === 0) {
          return res.status(404).json({ message: "Inquiry not found" });
        }
        resolve(results[0]);
      });
    });

    res.status(200).json(inquiry);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inquiry", error: error.message });
  }
});

// Update an inquiry (status, etc.)
exports.updateInquiry = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // For example, updating status

  const updateQuery =
    "UPDATE course_inquiries SET status = ? WHERE inquiry_id = ?";

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(updateQuery, [status, id], (error, results) => {
        if (error) return reject(error);
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Inquiry not found" });
        }
        resolve(results);
      });
    });

    res.status(200).json({ message: "Inquiry updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating inquiry", error: error.message });
  }
});

// Delete an inquiry
exports.deleteInquiry = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM course_inquiries WHERE inquiry_id = ?";

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(deleteQuery, [id], (error, results) => {
        if (error) return reject(error);
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Inquiry not found" });
        }
        resolve(results);
      });
    });

    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting inquiry", error: error.message });
  }
});
