const express = require("express");
const router = express.Router();

// Import the controller functions
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} = require("../controllers/inquiryController");

// Define the routes for course inquiries
router.post("/", createInquiry); // Create a new inquiry
router.get("/", getAllInquiries); // Get all inquiries
router.get("/:id", getInquiryById); // Get a single inquiry by ID
router.put("/:id", updateInquiry); // Update an inquiry by ID
router.delete("/:id", deleteInquiry); // Delete an inquiry by ID

module.exports = router;
