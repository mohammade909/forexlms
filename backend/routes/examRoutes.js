const express = require('express');
const router = express.Router();
const {
    getExamsWithSubjects,
    getExamByIdWithSubjects,
    createExam, deleteExam,updateExam
    // Other controllers here...
} = require('../controllers/examController');

// Route to get all exams with subjects
router.get('/with-subjects', getExamsWithSubjects);
router.post('/',createExam )
router.delete('/:exam_id',deleteExam )
router.put('/:exam_id',updateExam )

// Route to get a single exam with subjects by ID
router.get('/:exam_id/with-subjects', getExamByIdWithSubjects);

module.exports = router;
