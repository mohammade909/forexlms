const express = require('express');
const router = express.Router();
const {
  addSubjectMarksField,
  deleteSubjectMarksField,
  updateSubjectMarksField,
  getAllSubjectMarksField,
} = require('../controllers/subjectMarkFiledController');

// Routes
router.post('/', addSubjectMarksField);
router.delete('/:id', deleteSubjectMarksField);
router.put('/:id', updateSubjectMarksField);
router.get('/', getAllSubjectMarksField);

module.exports = router;
