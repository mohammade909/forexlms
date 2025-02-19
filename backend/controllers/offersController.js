const path = require("path");
const connection = require("../config/database"); // Adjust this path based on your project structure
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const fs = require("fs");

exports.createOffer = catchAsyncErrors(async (req, res, next) => {
  const { title, description, regular_price, offer_price } = req.body;

  if (!title) {
    return next(
      new ErrorHandler("Title is required", 400)
    );
  }

  let imageUrl = null;

  // Handle file upload if an image is provided
  if (req.files && req.files.image) {
    const file = req.files.image;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new ErrorHandler("Invalid file type. Only JPEG, PNG, and JPG are allowed.", 400));
    }

    // Sanitize file name
    const sanitizedFileName = `${Date.now()}-${file.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Define file path
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "offers",
      sanitizedFileName
    );

    // Move file to destination
    try {
      await file.mv(uploadPath);
      imageUrl = sanitizedFileName; // Set the sanitized file name
    } catch (err) {
      console.error("Error saving file: " + err.stack);
      return next(new ErrorHandler("File upload failed. Please try again.", 500));
    }
  }

  // Prepare the SQL query
  const query = `
    INSERT INTO offers (title, description, image_url, regular_price, offer_price) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    title,
    description || null, // Handle optional description
    imageUrl,            // Optional image URL
    regular_price || null, // Handle optional regular price
    offer_price || null,  // Handle optional offer price
  ];

  // Execute the SQL query
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Error creating offer: " + err.stack);
      return next(new ErrorHandler("Database error while creating offer", 500));
    }

    // Respond with success
    res.status(201).json({
      message: "Offer created successfully",
      offerId: results.insertId,
    });
  });
});

exports.getOffers = catchAsyncErrors(async (req, res, next) => {
  const query = "SELECT * FROM offers";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving offers: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }

    res.status(200).json({
      message: "Offers retrieved successfully",
      offers: results,
    });
  });
});

exports.updateOffer = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, regular_price, offer_price } = req.body;

  let updatedData = { title, description, regular_price, offer_price };

  // Handle file upload
  if (req.files && req.files.image) {
    const file = req.files.image;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new ErrorHandler("Invalid file type", 400));
    }

    // Sanitize file name
    const sanitizedFileName = `${Date.now()}-${file.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Define file path
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "offers",
      sanitizedFileName
    );

    // Move file to destination
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("Error saving file: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }
    });

    // Add the sanitized file name to the updated data
    updatedData.image_url = sanitizedFileName;

    // Retrieve the old image URL and delete the file if it exists
    connection.query(
      "SELECT image_url FROM offers WHERE offer_id = ?",
      [id],
      (err, results) => {
        if (!err && results[0]?.image_url) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "..",
            "frontend",
            "public",
            "offers",
            results[0].image_url
          );

          // Delete old image
          fs.unlink(oldImagePath, (unlinkErr) => {
            if (unlinkErr)
              console.warn("Error deleting old file: " + unlinkErr);
          });
        }
      }
    );
  }

  // Update the offer in the database
  const query = `UPDATE offers SET ? WHERE offer_id = ?`;
  connection.query(query, [updatedData, id], (err, results) => {
    if (err) {
      console.error("Error updating offer: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }

    res.status(200).json({
      message: "Offer updated successfully",
    });
  });
});
// Delete Offer
exports.deleteOffer = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Retrieve the image URL before deleting the offer
  connection.query(
    "SELECT image_url FROM offers WHERE offer_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error retrieving offer: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }

      if (results.length === 0) {
        return next(new ErrorHandler("Offer not found", 404));
      }

      const imageUrl = results[0].image_url;

      // Delete the offer from the database
      connection.query(
        "DELETE FROM offers WHERE offer_id = ?",
        [id],
        (deleteErr) => {
          if (deleteErr) {
            console.error("Error deleting offer: " + deleteErr.stack);
            return next(new ErrorHandler("Server Error", 500));
          }

          // Delete the image file if it exists
          if (imageUrl) {
            const imagePath = path.join(
              __dirname,
              "..",
              "..",
              "frontend",
              "public",
              "offers",
              imageUrl
            );

            fs.unlink(imagePath, (unlinkErr) => {
              if (unlinkErr)
                console.warn("Error deleting file: " + unlinkErr.stack);
            });
          }

          res.status(200).json({
            message: "Offer deleted successfully",
          });
        }
      );
    }
  );
});
