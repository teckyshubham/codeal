const express = require('express');
let router = express.Router();
const passport=require('passport');

const postController =require('../controllers/post_controller');

router.post('/create',passport.checkAuthentication ,postController.create);



module.exports=router;