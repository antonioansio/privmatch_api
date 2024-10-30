const express = require('express');
const { getUsers, follow, unfollow, like, unlike, getUserFollowers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.post('/follow', authMiddleware, follow);
router.post('/unfollow', authMiddleware, unfollow);
router.get('/:userId/followers', authMiddleware, getUserFollowers);
router.post('/like', authMiddleware, like);
router.post('/unlike', authMiddleware, unlike);

module.exports = router;