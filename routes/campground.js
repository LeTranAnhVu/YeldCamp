var express = require('express');
var router = express.Router();
var Campground  = require('../models/campground');

var { isLoggedIn , isCampgroundOwnership } = require('../middleware');
// REST - index route
router.get('/campgrounds',(req, res)=>{
    Campground.find(function(err, allCampgrounds){
        if(err){
            console.log('ERR: error when loading the data from database');
            console.log(err);
        } else {
            res.render('campground/index',{campgrounds: allCampgrounds});
        }
    });
});

//REST - Create
router.post('/campgrounds',isLoggedIn ,(req , res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var desc  = req.body.description;
    var author = {
        username: req.user.username,
        id : req.user._id
    };
    var newcamp = {name: name , image: image , description: desc, author: author};
    // store the newly campground in db
    Campground.create(newcamp,function(err,newCamp){
        if(err){
            console.log(err);
            req.flash('error',err.message);
            res.redirect('/campgrounds');
        }else{
            console.log("New camp is stored in DB");
            console.log(newCamp);
            req.flash('success', 'You have created new campground');
            res.redirect('/campgrounds');
        }
    });
    
    
    
});


// REST - new
router.get('/campgrounds/new',isLoggedIn , (req, res)=>{
   res.render('campground/new'); 
});

// REST - show

router.get('/campgrounds/:id',function(req, res){
    // console.log('show heheheeeee');
    Campground.findOne({_id: req.params.id}).populate("comments").exec(function(err,foundCamp){
        if(err || !foundCamp){
            
            req.flash('error',(err && err.message) || ("Something went wrong") );
            res.redirect('/campgrounds');
        }else{
            
            // console.log(campground);
            res.render('campground/show',{campground:foundCamp});     
        }
    });
});
// REST  -edit
router.get("/campgrounds/:id/edit",isCampgroundOwnership , (req,res)=>{
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            console.log(err);
            req.flash('error',err.message);
            res.render('/campgrounds');
        }else{
            res.render('campground/edit',{campground: foundCamp});
        }
    });
   
});
// REST update
router.put("/campgrounds/:id",isCampgroundOwnership , function(req, res){
    let newCamp = {
               name: req.body.name,
               image : req.body.image,
               description: req.body.description,
               author: {
                   id: req.user._id,
                   username: req.user.username
               }
           };
    // console.log(newCamp);
    Campground.findByIdAndUpdate(req.params.id,newCamp , function(err,foundCamp){
       if(err){
        //   console.log(err);
           req.flash('error', "Something went wrong!");
           res.redirect('/campgrounds');
       } else{
           req.flash('success',"Updated!");
           res.redirect('/campgrounds/' + foundCamp._id);
       }
    });
});

//REST DELETE

router.delete('/campgrounds/:id',isCampgroundOwnership, function(req, res){
    // console.log('delete heheheeeee');
    Campground.deleteOne({_id: req.params.id},function(err){
        if(err){
            console.log('Opps! Error when delete data in database');
            console.log(err);
            req.flash('error',err.message);
            res.redirect('/campgrounds');
        }else {
            console.log('DELETE SUCCESS');
            req.flash('success',"Campground is deleted");
            res.redirect('/campgrounds');
        }
    });
});




module.exports = router;