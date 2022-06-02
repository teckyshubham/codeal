const express = require('express');
let router = express.Router();
const passport=require('passport');

const userController = require('../controllers/user_controllers');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.post('/update/:id', passport.checkAuthentication, userController.update);
router.get('/signIn', userController.signIn);
router.get('/signUp', userController.signUp);

router.post('/create',userController.create);
router.post('/createSession',passport.authenticate(
    'local',
    {failureRedirect: '/users/signIn'},
),userController.createSession);

router.get('/sign-out', userController.destroySession);

console.log("working");
module.exports = router;