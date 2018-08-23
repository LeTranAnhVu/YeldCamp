var express = require('express');
var router = express.Router();
var Campground  = require('../models/campground');
var Comment  = require('../models/comment');
var { isLoggedIn , isCommentOwnership } = require('../middleware');


// route NEW comment
router.get('/campgrounds/:id/comments/new',isLoggedIn,function(req,res){
    Campground.findById({_id:req.params.id},function(err,foundCamp){
        if(err || !foundCamp){
            console.log(err);
            req.flash('error',(err && err.message) || ("Something went wrong") );
        }else{
            res.render("comment/new",{campground: foundCamp});
        }
    });
});
//route CREATE comment
router.post('/campgrounds/:id/comments',isLoggedIn,function(req,res){
   Campground.findById({_id:req.params.id},function(err,foundCamp){
        if(err || !foundCamp){
            console.log(err);
            req.flash('error',(err && err.message) || ("Something went wrong") );
            res.redirect('/campgrounds');
        }else{
            let newCmt = {
                 text: req.body.text,
            };      
            Comment.create(newCmt,function(err,createdCmt){
                if(err){
                    console.log(err);
                    req.flash('error',err.message);
                    res.redirect('back');
                }else{
                    createdCmt.author.id = req.user._id;
                    createdCmt.author.username = req.user.username;
                    createdCmt.save(function(err){
                        if(err){
                            console.log(err);
                            req.flash('error',err.message);
                            res.redirect('back');
                        }else {
                            foundCamp.comments.push(createdCmt);
                            foundCamp.save(function(err){
                                if(err){
                                    req.flash('error',err.message);
                                    res.redirect('back');
                                }else {
                                 console.log("Added new comment");
                                 req.flash('success',"Your comment is posted");
                                 let makeUrl = '/campgrounds/' + foundCamp._id;
                                 res.redirect(makeUrl);
                                }
                            });
                        }
                    });
                }
            });
            
        }
    });
});

//edit
router.get('/campgrounds/:id/comments/:id_cmt/edit',isCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
       if(err || !foundCamp){
           console.log(err);
           req.flash('error',(err && err.message) || ("Something went wrong") );
           res.redirect('back');
       } else {
           Comment.findById(req.params.id_cmt , function(err,foundCmt){
              if(err || !foundCmt){
                  console.log(err);
                  req.flash('error',(err && err.message) || ("Something went wrong") );
                  res.redirect('back');
              } else {
                //   console.log('test success');
                //   console.log('==============================');
                //   console.log('foundCamp:',foundCamp);
                //   console.log('foundCmt:',foundCmt);
                  res.render('comment/edit',{campground: foundCamp, comment: foundCmt}); 
              }
           });
       }
    });
   
});

//update
router.put('/campgrounds/:id/comments/:id_cmt',isCommentOwnership,function(req,res){
    let newCmt = req.body.text;
    Comment.findByIdAndUpdate(req.params.id_cmt, {text : newCmt} , {overwrite: false , new : true } , function(err,updatedCmt){
      if(err){
          console.log(err);
          req.flash('error',err.message);
          res.redirect('back');
      } else {
          req.flash('success', "Your comment is updated");
          res.redirect('/campgrounds/'+req.params.id);
      }
    });
});

// delete
router.delete('/campgrounds/:id/comments/:id_cmt',isCommentOwnership,function(req,res){
   Comment.findByIdAndRemove(req.params.id_cmt,function(err){
      if(err){
          console.log('Oops! can not delete the comment');
          console.log(err);
          req.flash('error',err.message);
          res.redirect('back');
      } else {
        //   console.log("delete successfully");
        req.flash('success',"Comment is deleted!");
          res.redirect("/campgrounds/"+req.params.id);
      }
   });
    
});



module.exports = router;