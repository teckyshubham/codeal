const passport=require('passport');
const googleStrategy =require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');

passport.use(new googleStrategy({
    clientID: "1034470732355-011q32d1cinnbvsmkln0pmttpkdpelvr.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},

function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log("error in user fooglr startegy",err);
            return;
        }
        console.log(profile);
        if(user){
            return done(null,user);
        }else{
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log('error in creation user google strategy-passport',err);
                    return;
                }
                return done(null,user);
            });
        }
    });
}

));

module.exports=passport;