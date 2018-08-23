const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require('./models/user');
// Delete all the old campgrounds
// Create the new particular ones
// Add comments for each campground


let camps = [
    {
        name: "Rockabye", 
        image: "https://blog.nhstateparks.org/wp-content/uploads/2014/08/mooseBrook11.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Steel Mountain", 
        image: "https://static7.depositphotos.com/1248361/735/i/950/depositphotos_7352975-stock-photo-tents-at-boy-scout-camp.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Lure of the Lake", 
        image: "http://www.mountainliving.com/images/cache/cache_c/cache_3/cache_6/tent_fire-007bf63c.jpeg?ver=1469197326&aspectratio=1.3333333333333",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    ]

function seedDB() {
    Comment.remove({ /*all*/ }, function(err) {
        if (err) {
            console.log(err);
        } else {
            // deleted cmt 
            console.log("Deleted all comments");
            Campground.remove({ /*all*/ }, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    // deleted data 
                    console.log("Deleted all campgrounds");
                    //create new data after deleted 
                    camps.forEach(function(camp,index) {
                        Campground.create(camp, function(err, addedCamp) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Created new campground");
                                Comment.create({
                                        text: "this is nice place. But I wish It was internet in there",
                                    },
                                    function(err, newCmt) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            User.findOne({username: 'vule'},function(err,foundUser){
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    newCmt.author = foundUser._id;
                                                    newCmt.save(function(err){
                                                       if(err){
                                                           console.log(err);
                                                       } else{
                                                           console.log("Created new comment");
                                                            addedCamp.comments.push(newCmt);
                                                            addedCamp.save();
                                                       }
                                                    });
                                                }
                                            });
                                            
                                        }
                                    }
                                );
                            }
                        });
                    });
                }
            });
        }
    });

}

module.exports = seedDB;