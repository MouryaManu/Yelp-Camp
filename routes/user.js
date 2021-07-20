const express= require('express');
const router= express.Router();
const catchAsync= require('../utils/catchAsync');
const passport= require('passport');

const usersController= require('../controllers/users');



router.route('/register')
      .get(usersController.register)
      .post(catchAsync(usersController.postRegister));

router.route('/login')
      .get(usersController.login)
      .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), usersController.loginAuthenticate);


router.get('/logout',usersController.logout);



module.exports= router;