
const Comment = require('../models/comment');
const Campground = require('../models/campground');

//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","you need to log in first");
        res.redirect('/login');
    }
}
function isCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.id_cmt,function(err,foundCmt){
            //check the owner is whether the current user or not
            if(err || !foundCmt){
                // console.log(err);
                req.flash('error',(err && err.message) || ("Something went wrong") );
                res.redirect('back');
            }else {
                let author_id = foundCmt.author.id;
                if(req.user._id.equals(author_id)){
                    // console.log('this is the ownner ship');
                    return next();
                }else{
                    // console.log('this is not ownner user');
                    req.flash('error',"You don't have permisson to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', "You have to log in to do that");
        res.redirect('back');
    }
}


function  isCampgroundOwnership(req,res,next){
    //is logged Id
    if(req.isAuthenticated()){
        //logged
        Campground.findById(req.params.id,function(err, foundCamp){
            if(err || !foundCamp){
                console.log(err);
                req.flash('error',(err && err.message) || ("Something went wrong") );
                res.redirect('/campgrounds');
            }else {
                if( req.user._id.equals(foundCamp.author.id)){
                    //owner ship is true
                    next();
                }else {
                    req.flash('error',"You don't have permission to do that");
                    res.redirect('/campgrounds');
                }
            }
        });
        
    }else {
        req.flash('error',"You have to log in to do that");
        res.redirect('/login');
    }
}


module.exports = {
    isLoggedIn: isLoggedIn,
    isCommentOwnership: isCommentOwnership,
    isCampgroundOwnership : isCampgroundOwnership
}