const Campground= require('../models/campground');

module.exports.index=async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.new= (req,res) => {
    res.render('campgrounds/new');
}

module.exports.create= async(req,res,next) => {

    const campground= new Campground(req.body.campground);
    campground.author= req.user._id;
    await campground.save();
    req.flash('success', 'Successfully posted a new Campground!!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.details=async(req,res) => {
    const campground= await (await Campground.findById(req.params.id).populate({
        path:'reviews',
    populate: {
        path:'author'
    }}).populate('author'));
    if(!campground) {
        req.flash('error','Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.edit=async(req,res) => {
    const {id}= req.params;
    const campground= await Campground.findById(id);
    if(!campground) {
        req.flash('error','Cannot find that campground');
        res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', {campground});
}

module.exports.update=async(req,res) => {
    const { id }= req.params;
    const campground= await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that!!');
        res.redirect(`/campgrounds/${campground._id}`);
    }
    const camp= await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success','Succesfully Updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
    
}

module.exports.deleteCampground=async(req,res) => {
    const { id }= req.params;
    const campground= await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that!!');
        res.redirect(`/campgrounds/${campground._id}`);

    }
    req.flash('success','Successfully deleted a Campground!!');
    res.redirect('/campgrounds');
}