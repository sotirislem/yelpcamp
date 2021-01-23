const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchErrorsAsync = require('../utils/catchErrorsAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('./middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
	.get(catchErrorsAsync(campgrounds.index))
	.post(isLoggedIn, upload.array('image'), validateCampground, catchErrorsAsync(campgrounds.createCampground));


router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
	.get(catchErrorsAsync(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchErrorsAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, catchErrorsAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchErrorsAsync(campgrounds.renderEditForm));

module.exports = router;