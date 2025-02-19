const express = require('express');
const router = express.Router();
const {markStudentAbsent, markTeacherAbsent, getStudentAttendance, getTeacherAttendance, getAllStudentAttendance, getAllTeacherAttendance, getStudentAttendanceByUserId} = require('../controllers/attendanceController');

// Route to mark student as absent
router.post('/students/absent', markStudentAbsent);

// Route to mark teacher as absent
router.post('/teachers/absent', markTeacherAbsent);

// Route to get student attendance
router.get('/students',getAllStudentAttendance);
router.get('/students/:student_id',getStudentAttendance);
router.get('/user/:user_id',getStudentAttendanceByUserId);

// Route to get teacher attendance
router.get('/teachers', getAllTeacherAttendance);
router.get('/teachers/:teacher_id', getTeacherAttendance);

module.exports = router;
