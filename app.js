'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
var flash = require('connect-flash');
const User = require('./models/user');

// const seedDB = require("./seeds");
mongoose.connect('mongodb://localhost/yelpcampdb_V8');

var app = express();

var commentRoute = require('./routes/comment');
var campgroundRoute = require('./routes/campground');
var indexRoute = require('./routes/index');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine','ejs');

app.use(methodOverride('_method'));
app.use(flash());
app.use(require('express-session')({
    secret: "can be any thing",
    resave:false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   res.locals.info  = req.flash('info');
   next();
});


app.use(campgroundRoute);
app.use(commentRoute);
app.use(indexRoute);




// seedDB();

// REST ful 

//INDEX        : /campgrounds           : GET

//NEW          : /campgrounds/new       : GET
//CREATE       : /campgrounds           : POST

//SHOW         : /campgrounds/:id       :GET

//NEW CMT      : /campgrounds/:id/comments/new  :GET
//CREATE CMT   : /campgrounds/:id/comments             :POST


       
app.listen(process.env.PORT, process.env.IP,function(){
    console.log('The yelp camp server is started !');
});


//note
// err.code = 11000 check something redundant
