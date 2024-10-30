const express = require('express');
const { changePassword, getUserProfileDetails, registerUserDetails, updateUserProfileDetails } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUserProfileDetails);
router.post('/change-password', authMiddleware, changePassword);
router.post('/details', authMiddleware, registerUserDetails);
router.put('/details', authMiddleware, updateUserProfileDetails);

module.exports = router;
