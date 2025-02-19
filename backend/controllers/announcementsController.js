const connection = require("../config/database"); // Adjust this path based on your project structure
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");

exports.createAnnouncement = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, content, status } = req.body;
    console.log(req.body);
    
    // Validate required fields
    if (!title || !content) {
      return next(new ErrorHandler("Title and content are required", 400));
    }

    // Prepare the SQL query
    const query = `
      INSERT INTO announcements (title, content, status) 
      VALUES (?, ?, ?)
    `;
    const values = [
      title,
      content,
      status || "active", // Default status if not provided
    ];

    // Execute the SQL query
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error creating announcement: ", err);
        
        // Handle duplicate entries or other specific database errors
        if (err.code === "ER_DUP_ENTRY") {
          return next(new ErrorHandler("Announcement already exists", 409));
        }

        return next(new ErrorHandler("Database error while creating announcement", 500));
      }

      // Respond with success
      res.status(201).json({
        message: "Announcement created successfully",
        announcementId: results.insertId,
      });
    });
  } catch (error) {
    console.error("Unexpected error: ", error);
    return next(new ErrorHandler("An unexpected error occurred", 500));
  }
});


exports.getAnnouncements = catchAsyncErrors(async (req, res, next) => {
  const query = "SELECT * FROM announcements";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving announcements: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }

    res.status(200).json({
      message: "Announcements retrieved successfully",
      announcements: results,
    });
  });
});

exports.updateAnnouncement = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, status } = req.body;

  let updatedData = { title, content, status };

  // Update the announcement in the database
  const query = `UPDATE announcements SET ? WHERE announcement_id = ?`;
  connection.query(query, [updatedData, id], (err, results) => {
    if (err) {
      console.error("Error updating announcement: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }

    res.status(200).json({
      message: "Announcement updated successfully",
    });
  });
});

exports.deleteAnnouncement = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Delete the announcement from the database
  connection.query(
    "DELETE FROM announcements WHERE announcement_id = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Error deleting announcement: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }

      res.status(200).json({
        message: "Announcement deleted successfully",
      });
    }
  );
});
