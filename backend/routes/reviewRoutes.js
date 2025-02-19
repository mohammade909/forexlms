const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create a new comment
router.post('/:courseId', reviewController.createReview);

// Get comments by course ID
router.get('/:courseId', reviewController.getReviewsByCourse);

// // Edit comment by comment ID
// router.put('/:commentId/', reviewController);

// // Delete comment by comment ID
// router.delete('/:commentId', reviewController);

module.exports = router;
