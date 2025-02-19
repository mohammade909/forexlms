const path = require("path");
const fs = require("fs");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database"); // Adjust according to your DB setup
const { error } = require("console");

// Create a certificate
exports.createCertificate = catchAsyncErrors(async (req, res, next) => {
  try {
    const { student_id, course_id, issued_date, status } = req.body;

    // Ensure file is uploaded
    if (!req.files || !req.files.pdf_url) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdf = req.files.pdf_url;

    // Generate a unique code for the certificate
    const certificate_code = `CERT-${Date.now()}`;

    // Define the upload path
    const uploadPath = path.join(
      __dirname,
      "../",
      "..",
      "frontend",
      "public",
      "certificates"
    );
    const pdfFileName = `${certificate_code}.pdf`;

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Move the file to the destination
    const filePath = path.join(uploadPath, pdfFileName);
    pdf.mv(filePath, (err) => {
      if (err) {
        console.log(err);

        return res
          .status(500)
          .json({ message: "File upload failed", error: err.message });
      }
    });

    // Insert into the database
    const sql = `
            INSERT INTO certificates (student_id, course_id, certificate_code, issued_date, pdf_url, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [result] = await db
      .promise()
      .execute(sql, [
        student_id,
        course_id,
        certificate_code,
        issued_date,
        `/certificates/${pdfFileName}`,
        status || "active",
      ]);

    res.status(201).json({
      message: "Certificate created",
      certificate_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Fetch all certificates
exports.getCertificates = catchAsyncErrors(async (req, res, next) => {
  try {
    const sql = `
        SELECT 
          c.certificate_id, 
          c.certificate_code, 
          c.issued_date, 
          c.status, 
          c.pdf_url, 
          s.first_name AS student_first_name, 
          s.last_name AS student_last_name,
          cr.course_name
        FROM certificates c
        JOIN students s ON c.student_id = s.user_id
        JOIN courses cr ON c.course_id = cr.course_id
      `;

    // Execute the query
    const [rows] = await db.promise().execute(sql);

    // Check if certificates exist
    if (!rows || rows.length === 0) {
      return res.status(200).json({ certificates: [] });
    }

    // Respond with certificates data
    res.status(200).json({ certificates: rows });
  } catch (error) {
    console.error("Error fetching certificates:", error);

    // Pass the error to the next middleware
    next(new ErrorHandler("Internal server error", 500));
  }
});

// Revoke a certificate
exports.revokeCertificate = catchAsyncErrors(async (req, res, next) => {
  try {
    const { certificate_id } = req.params;
    const sql = `UPDATE certificates SET status = 'revoked' WHERE certificate_id = ?`;
    await db.execute(sql, [certificate_id]);

    res.status(200).json({ message: "Certificate revoked" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Delete a certificate (and remove the file)
exports.deleteCertificate = catchAsyncErrors(async (req, res, next) => {
  try {
    const { certificate_id } = req.params;

    // Get the file path
    const sqlSelect = `SELECT pdf_url FROM certificates WHERE certificate_id = ?`;
    const [rows] = await db.execute(sqlSelect, [certificate_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const pdfUrl = rows[0].pdf_url;
    const fullPath = path.join(__dirname, "..", pdfUrl);

    // Delete the file
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete from the database
    const sqlDelete = `DELETE FROM certificates WHERE certificate_id = ?`;
    await db.execute(sqlDelete, [certificate_id]);

    res.status(200).json({ message: "Certificate deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Get certificates by user_id
exports.getCertificatesByUserId = catchAsyncErrors(async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Find the student by user_id
    // Fetch certificates for the student
    const findCertificatesQuery = `
            SELECT c.certificate_id, c.certificate_code, c.issued_date, c.status, c.pdf_url, 
                   cr.course_name, cr.course_description
            FROM certificates c
            JOIN courses cr ON c.course_id = cr.course_id
            WHERE c.student_id = ?
        `;
    const [certificates] = await db
      .promise()
      .execute(findCertificatesQuery, [user_id]);

    res.status(200).json({
      certificates,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
