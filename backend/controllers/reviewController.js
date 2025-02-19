const connection = require('../config/database');
const catchAsyncErrors = require('../middlewares/cathAsyncErrorsMiddleware');

// Create a new review
exports.createReview = catchAsyncErrors(async (req, res, next) => {
  const { user_id, rating, comment } = req.body;
  const course_id = req.params.courseId
  const query = 'INSERT INTO reviews (course_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
  const values = [course_id, user_id, rating, comment];
  
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating review: ' + err.stack);
      return next(new ErrorHandler('Server Error', 500));
    }
    res.status(201).json({ message: 'Review added successfully', reviewId: results.insertId });
  });
});

// Get reviews by course ID


exports.getReviewsByCourse = catchAsyncErrors(async (req, res, next) => {
  const courseId = req.params.courseId;

  // Query to get reviews
  const reviewQuery = 'SELECT * FROM reviews WHERE course_id = ?';
  connection.query(reviewQuery, [courseId], (err, reviews) => {
    if (err) {
      console.error('Error fetching reviews: ' + err.stack);
      return next(new ErrorHandler('Server Error', 500));
    }

    if (reviews.length === 0) {
      return res.status(200).json({
        average: 0,
        featured: []
      });
    }

    const userIds = reviews.map(review => review.user_id);
    const uniqueUserIds = [...new Set(userIds)];

    // Query to get user details
    const userQuery = 'SELECT user_id, username FROM users WHERE user_id IN (?)';
    connection.query(userQuery, [uniqueUserIds], (err, users) => {
      if (err) {
        console.error('Error fetching user details: ' + err.stack);
        return next(new ErrorHandler('Server Error', 500));
      }

      const userMap = users.reduce((acc, user) => {
        acc[user.user_id] = user;
        return acc;
      }, {});

      // Calculate the average rating
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      // Format the review data
      const formattedReviews = reviews.map(review => ({
        id: review.rewview_id,
        rating: review.rating,
        content: review.comment,
        date: new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        datetime: review.created_at.toISOString().split('T')[0],
        author: userMap[review.user_id].username,
        // avatarSrc: userMap[review.user_id].avatarSrc,
      }));

      // Respond with formatted data
      res.status(200).json({
        average: averageRating,
        featured: formattedReviews
      });
    });
  });
});
