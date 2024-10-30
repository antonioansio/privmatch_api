const { getUserById } = require('../models/userModel');
const { updatePassword } = require('../models/profileModel');
const { createUserDetails, getUserDetailsByUserId, updateUserDetails } = require('../models/userDetailsModel');
const bcrypt = require('bcryptjs');

exports.getUserProfileDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDetails = await getUserDetailsByUserId(userId);

    if (userDetails) {
      delete userDetails.id;
      delete userDetails.user_id;
      delete userDetails.created_at;
      delete userDetails.updated_at;
    }

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      age: user.age,
      created_at: user.created_at,
      updated_at: user.updated_at,
      details: userDetails || {}
    };

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Passwords are missing' });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'The new password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updatePassword(userId, hashedPassword);

    res.status(200).json({ message: 'Password successfully updated' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.registerUserDetails = async (req, res) => {
  const userId = req.user.id;
  const {
    whatsapp,
    telegram,
    rate_per_hour,
    nationality,
    hair_color,
    accepts_video_call,
    accepts_credit_card,
    height_cm,
    weight_kg,
    measurements,
    bio
  } = req.body;

  try {
    const userDetails = {
      whatsapp,
      telegram,
      rate_per_hour,
      nationality,
      hair_color,
      accepts_video_call,
      accepts_credit_card,
      height_cm,
      weight_kg,
      measurements,
      bio
    };

    const filteredUserDetails = Object.fromEntries(
      Object.entries(userDetails).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredUserDetails).length === 0) {
      return res.status(400).json({ message: 'No data provided for registration' });
    }

    const userDetailsId = await createUserDetails(userId, filteredUserDetails);

    res.status(201).json({ message: 'User details successfully registered', details: userDetailsId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user details', error });
  }
};

exports.updateUserProfileDetails = async (req, res) => {
  const userId = req.user.id;
  const {
    whatsapp,
    telegram,
    rate_per_hour,
    nationality,
    hair_color,
    accepts_video_call,
    accepts_credit_card,
    height_cm,
    weight_kg,
    measurements,
    bio
  } = req.body;

  try {
    const updateData = {
      whatsapp,
      telegram,
      rate_per_hour,
      nationality,
      hair_color,
      accepts_video_call,
      accepts_credit_card,
      height_cm,
      weight_kg,
      measurements,
      bio
    };

    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredUpdateData).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    const updated = await updateUserDetails(userId, filteredUpdateData);

    if (updated) {
      res.status(200).json({ message: 'User details updated successfully' });
    } else {
      res.status(400).json({ message: 'No changes made or user details not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user details', error: error.message });
  }
};