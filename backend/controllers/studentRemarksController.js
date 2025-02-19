const catchAsyncErrors = require('../middlewares/cathAsyncErrorsMiddleware'); // Middleware for error handling
const db = require('../config/database'); // Your database configuration

// Create a new remark
exports.createRemark = catchAsyncErrors(async (req, res) => {
    try {
        const { student_id, remark } = req.body;

        const query = 'INSERT INTO student_remarks (student_id, remark) VALUES (?, ?)';
        const values = [student_id, remark];

        const [results] = await db.promise().query(query, values);

        res.status(201).json({ 
            success: true, 
            message: 'Remark created successfully',
            remark_id: results.insertId // Send the ID of the newly created remark
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all remarks for a specific student
exports.getRemarksByStudentId = catchAsyncErrors(async (req, res) => {
    try {
        const { student_id } = req.params;

        const query = 'SELECT * FROM student_remarks WHERE student_id = ?';
        const [results] = await db.promise().query(query, [student_id]);

        res.status(200).json({ 
            success: true, 
            remarks: results 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update a remark
exports.updateRemark = catchAsyncErrors(async (req, res) => {
    try {
        const { remark_id } = req.params;
        const { remark } = req.body;

        const query = 'UPDATE student_remarks SET remark = ?, updated_at = CURRENT_TIMESTAMP WHERE remark_id = ?';
        const values = [remark, remark_id];

        const [results] = await db.promise().query(query, values);

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Remark not found' });
        }
        res.status(200).json({ success: true, message: 'Remark updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a remark
exports.deleteRemark = catchAsyncErrors(async (req, res) => {
    try {
        const { remark_id } = req.params;

        const query = 'DELETE FROM student_remarks WHERE remark_id = ?';

        const [results] = await db.promise().query(query, [remark_id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Remark not found' });
        }
        res.status(200).json({ success: true, message: 'Remark deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
