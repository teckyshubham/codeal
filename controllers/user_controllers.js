const User=require('../models/user');

module.exports.profile = function(req, res){

    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user
        });
    });

    
}
module.exports.update = function(req, res){

    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        });
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorised');
    }

    
}



module.exports.signIn = function(req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "user_sign_in"
    });
}

module.exports.signUp = function(req, res) {

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "user_sign up"
    });
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/signIn');
            })
        }else{
            return res.redirect('back');
        }

    });
}

module.exports.createSession = function(req, res) {
//    User.findOne({email:req.body.email},function(err,user){
//        if(err){
//            console.log("error i loading",err);
//            return;
//        }
//        if(user){
//         if(user.password!=req.body.password){
//             return res.redirect('back');
//         }
//         // res.cookie('user_id',user.id);
//         res.cookie('user_id', user.id);
//         return res.redirect('/users/profile');
//        }else{
//            return res.redirect('back');
//        }}
//    )

    req.flash('success','Logged in Succesfully');
    return res.redirect('/');
};
module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','Logged OUT Succesfully');
        res.redirect('/');
      });
      
}