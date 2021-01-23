const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('./middleware');
const reviews = require('../controllers/reviews');
const catchErrorsAsync = require('../utils/catchErrorsAsync');


router.post('/', isLoggedIn, validateReview, catchErrorsAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchErrorsAsync(reviews.deleteReview))

module.exports = router;