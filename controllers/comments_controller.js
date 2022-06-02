const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){

        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment ){
                if(err){
                    console.log(err);
                    return;
                }
                // handle error

                // post.comments.push(comment);
                if (!Array.isArray(post.comments)) {
                    post.comments = [];
                }
                post.comments.push(comment._id);
                post.save();

                res.redirect('/');
            });
        }

    });
}


module.exports.destroy= function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment.user==req.user.id){
            let postId=comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId, {$pull:{comments:req.params.id}},function(err,post){
                if(err){
                    console.log("error in comment page -----",err);
                }
                return res.redirect('/');
            })
            // post.remove();
            // Comment.deleteMany({post:req.params.id},function(err){
                // return res.redirect('back');
            // });
        }else{
            return res.redirect('back');
        }
    })
}