var express = require('express');
var router = express.Router();
var User  = require('../models/user');
var passport = require('passport');

         
                
router.get('/',(req, res)=>{
   res.render('landing'); 
});


// route sign up
router.get('/register',function(req,res){
    res.render('user/register');
});

router.post('/register',function(req,res){
    User.register(new User({username: req.body.username}) , req.body.password , function(err,newUser){
       if(err){
           console.log(err.message);
           req.flash('error', err.message);
           res.redirect('back');
       } else{
            passport.authenticate('local')(req,res ,function(){
                console.log('req.user is :',req.user);
                req.flash('success',`Welcome you to join us, ${req.user.username}`);
                res.redirect('back');
                
            });
            
            // res.redirect('/login');
       }
    });
});


//route sign in 
router.get('/login',function(req,res){
    res.render('user/login');
});

router.post('/login', passport.authenticate('local',
    {
        successFlash: 'Welcome! ',
        successRedirect: '/campgrounds',
        failureFlash: 'Invalid username or password.',
        failureRedirect: '/login'
}));

//route log out
router.get('/logout',function(req,res){
    req.logout();
    req.flash('info','You have logged out');
    res.redirect('back');
});




router.get('*',(req, res)=>{
    res.send('Oops! Page is not found.');
});

module.exports = router;