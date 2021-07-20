const express= require('express');
const router= express.Router();
const catchAsync= require('../utils/catchAsync');
const Campground= require('../models/campground');
const campgrounds= require('../controllers/campgrounds');


const {isLoggedIn,isAuthor, validateCampground} =require('../middleware');


router.route('/')
      .get(catchAsync(campgrounds.index))
      .post(isLoggedIn, validateCampground, catchAsync(campgrounds.create));
      
      
router.get('/new', isLoggedIn, campgrounds.new);

router.route('/:id')
      .get(catchAsync(campgrounds.details))
      .put(isLoggedIn,isAuthor ,validateCampground ,catchAsync(campgrounds.update))
      .delete(isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground));




router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.edit));

module.exports= router;