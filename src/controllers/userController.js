const { getAllUsers, getUserFollowers, followUser, unfollowUser, likeUser, unlikeUser } = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ data: users });
  } catch (error) { 
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

exports.follow = async (req, res) => {
  const { followerId, followedId } = req.body;
  
  if (!followerId || !followedId) {
    return res.status(400).json({ message: 'Both followerId and followedId are required' });
  }

  try {
    const result = await followUser(followerId, followedId);
    res.status(200).json({ message: 'User followed successfully', followId: result });
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error: error.message });
  }
};

exports.unfollow = async (req, res) => {
  const { followerId, followedId } = req.body;

  if (!followerId || !followedId) {
    return res.status(400).json({ message: 'Both followerId and followedId are required' });
  }

  try {
    await unfollowUser(followerId, followedId);
    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error: error.message });
  }
};

exports.like = async (req, res) => {
  const { likedUserId } = req.body;
  const userId = req.user.id;

  try {
    const result = await likeUser(userId, likedUserId);
    res.status(200).json({ message: 'User liked successfully', likeId: result });
  } catch (error) {
    res.status(500).json({ message: 'Error liking user', error: error.message });
  }
};

exports.unlike = async (req, res) => {
  const { likedUserId } = req.body;
  const userId = req.user.id;

  try {
    await unlikeUser(userId, likedUserId);
    res.status(200).json({ message: 'User unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking user', error: error.message });
  }
};

exports.getUserFollowers = async (req, res) => {
  const { userId } = req.params;
  try {
    const followers = await getUserFollowers(userId);
    res.status(200).json({ data: followers });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving followers', error: error.message });
  }
};