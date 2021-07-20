const express= require('express');
const router= express.Router();
const catchAsync= require('../utils/catchAsync');
const Campground= require('../models/campground');
const campgrounds= require('../controllers/campgrounds');

const multer= require('multer');
const { storage } = require('../cloudinary');
const upload= multer( { storage });


const {isLoggedIn,isAuthor, validateCampground} =require('../middleware');


router.route('/')
      .get(catchAsync(campgrounds.index))
      .post(isLoggedIn, upload.array('image') ,validateCampground ,catchAsync(campgrounds.create));
     
      
router.get('/new', isLoggedIn, campgrounds.new);

router.route('/:id')
      .get(catchAsync(campgrounds.details))
      .put(isLoggedIn,isAuthor,upload.array('image') ,validateCampground ,catchAsync(campgrounds.update))
      .delete(isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground));




router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.edit));

module.exports= router;