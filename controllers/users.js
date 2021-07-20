const User= require('../models/user');

module.exports.register= (req,res) => {
    res.render('users/register');
}

module.exports.postRegister=async(req,res,next) => {
    try{
    const { username,email, password } = req.body;
    const user= new User({username,email});
    const reguser= await User.register(user, password);
   // console.log(reguser);
   req.login(reguser,err => {
       if(err) return next(err);
       req.flash('success', 'Welcome to Yelp Camp!');
       res.redirect('/campgrounds');
   })
    }catch(e) {
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.login=  (req,res) => {
    res.render('users/login'); 
}

module.exports.loginAuthenticate= (req,res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl=req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout= (req,res) => {
    req.logout();
    req.flash('success','Goodbye!!');
    res.redirect('/campgrounds');
}