const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homeworkController');

// Submit Homework
router.post('/submit', homeworkController.submitHomework);

// Get Homework by Class
router.get('/class/:class_id', homeworkController.getHomeworkByClass);

// Get Homework by Student
router.get('/student/:student_id', homeworkController.getStudentHomework);

// Update Homework (Grade, Feedback, Status)
router.put('/update/:homework_id', homeworkController.updateHomework);

// Delete Homework
router.delete('/delete/:homework_id', homeworkController.deleteHomework);

module.exports = router;
