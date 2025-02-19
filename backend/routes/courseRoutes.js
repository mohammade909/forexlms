// routes/courses.js
const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courseController');

router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getCourseById);
router.get('/student/:id', coursesController.getStudentCourses);
router.get('/instructor/:id', coursesController.getCourseByInstructor);
router.post('/', coursesController.createCourse);
router.put('/:id', coursesController.updateCourse);
router.delete('/:id', coursesController.deleteCourse);
router.post('/assign', coursesController.assignCourseToInstructor);

module.exports = router;
