const express = require('express');
const { getAllFees,createFee, getFeesByStudentId, getCourseFeesSummary, getIndividualCourseFeesSummary } = require('../controllers/feeController');

const router = express.Router();

// Route to get all fees
router.get('/', getAllFees);
router.post('/', createFee);
// Route to get summary of all courses with fees and enrollments
router.get('/summary', getCourseFeesSummary);

// Route to get summary of a specific course by course_id
router.get('/summary/:course_id', getIndividualCourseFeesSummary);

// Route to get fees by student ID
router.get('/student/:student_id', getFeesByStudentId);

module.exports = router;
