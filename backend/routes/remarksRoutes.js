const express = require('express');
const router = express.Router();
const {
    createRemark,
    getRemarksByStudentId,
    updateRemark,
    deleteRemark
} = require('../controllers/studentRemarksController');

router.post('/', createRemark);
router.get('/student/:student_id', getRemarksByStudentId);
router.put('/:remark_id', updateRemark);
router.delete('/:remark_id', deleteRemark);

module.exports = router;
