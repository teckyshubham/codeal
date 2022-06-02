const express = require('express');
const router = express.Router();

const homeController = require('../controllers/hone_controller');
// const userController = require('../controllers/user_controllers');

router.get('/', homeController.home);
router.use('/users',require('./user'));
router.use('/posts',require('./post'));
router.use('/comments', require('./comment'));

// router.post('/create',userController.create);

console.log("working");
module.exports = router;