const express= require('express');
const router= express.Router({mergeParams: true});
const catchAsync= require('../utils/catchAsync');
const ExpressError= require('../utils/ExpressError');
const Campground= require('../models/campground');
const Review= require('../models/review');
const { campgroundSchema, reviewSchema}= require('../schemas.js');



const validateReview= (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg= error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}


router.post('/',validateReview, catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground= await Campground.findById(id);
    const review=  new Review(req.body.review);
   // console.log(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','A new Review is Added!!');
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.delete('/:reviewId', catchAsync(async(req,res) => {
    const{ id, reviewId }= req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Successfully deleted a Review!!');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports= router;