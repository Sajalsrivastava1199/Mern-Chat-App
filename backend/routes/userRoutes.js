const express = require('express');
const { registerUser ,authUser,allUsers} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
//any of the two ways is fine,both controllers have to be created in userController.js
router.route('/').post(registerUser).get(protect,allUsers)
router.post('/login',authUser)


// router.route('/').get(allUsers) // /api/user?search=akash

module.exports = router;