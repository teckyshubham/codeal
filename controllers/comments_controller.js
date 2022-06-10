const Comment = require('../models/comment');
const Post = require('../models/post');
// const commentMailer=require('../mailers/comments_mailer');
// const queue = require('../config/kue');
// const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');
// module.exports.create = function(req, res){
//     Post.findById(req.body.post, function(err, post){

//         if (post){
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             }, function(err, comment ){
//                 if(err){
//                     console.log(err);
//                     return;
//                 }
//                 // handle error

//                 // post.comments.push(comment);
//                 if (!Array.isArray(post.comments)) {
//                     post.comments = [];
//                 }
//                 post.comments.push(comment._id);
//                 post.save();

//                 res.redirect('/');
//             });
//         }

//     });
// }
module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            if (!Array.isArray(post.comments)) {
                post.comments = [];
            }
            post.comments.push(comment._id);
            post.save();
            comment = await comment.populate('user');
            // commentMailer.newComment(comment);
            // let job = queue.create('emails', comment).save(function(err){
            //     if (err){
            //         console.log('Error in sending to the queue', err);
            //         return;
            //     }
            //     console.log('job enqueued', job.id);

            // })
            
            if (req.xhr){
                // Similar for comments to fetch the user's id!
      
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }

            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}


// module.exports.destroy= function(req,res){
//     Comment.findById(req.params.id,function(err,comment){
//         if(comment.user==req.user.id){
//             let postId=comment.post;
//             comment.remove();
//             Post.findByIdAndUpdate(postId, {$pull:{comments:req.params.id}},function(err,post){
//                 if(err){
//                     console.log("error in comment page -----",err);
//                 }
//                 return res.redirect('/');
//             })
//             // post.remove();
//             // Comment.deleteMany({post:req.params.id},function(err){
//                 // return res.redirect('back');
//             // });
//         }else{
//             return res.redirect('back');
//         }
//     })
// }
module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

              // CHANGE :: destroy the associated likes for this comment
              await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}