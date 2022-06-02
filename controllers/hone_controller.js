const Post =require('../models/post');
const User=require('../models/user');

module.exports.home =async function(req, res) {

    try {
        let posts= await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        let users =await User.find({});
        return res.render('home', {
            title: "Codeial | Home",
            posts:  posts,
            all_users:users
        });

        
    } catch (error) {
        console.log(error);
        return;
    }
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
    // return res.render('home', {
    //     title: "Home"
    // });

    
    // .exec(function(err, posts){

    //     User.find({},function(err,users){
            
    //     })

        
    // })
}