const express = require('express');
let router = express.Router();

const homeController = require('../controllers/hone_controller');
const userController = require('../controllers/user_controllers');

router.get('/', homeController.home);
router.use('/users',require('./user'));

// router.post('/create',userController.create);

console.log("working");
module.exports = router;