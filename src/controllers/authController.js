const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { createUser, getUserByEmail, getUserById } = require('../models/userModel');
const { saveToken, deleteOldestTokenIfLimitExceeded } = require('../models/tokenModel');
const { recordAttempt,resetAttempts, getAttempts } = require('../models/attemptModel');

const MAX_ATTEMPTS = 3; 
const LOCK_TIME = 30 * 60 * 1000;

exports.register = async (req, res) => {
  const { name, email, password, gender, phone, age } = req.body;
  
  try {
    const userExists = await getUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = await createUser(name, email, password, gender, phone, age);
    res.status(201).json({ message: 'User successfully registered', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const attemptRecord = await getAttempts(email);
    if (attemptRecord && attemptRecord.attempts >= MAX_ATTEMPTS) {
      const now = new Date();
      const lockEndTime = new Date(attemptRecord.last_attempt);
      lockEndTime.setMilliseconds(lockEndTime.getMilliseconds() + LOCK_TIME);

      if (now < lockEndTime) {
        const timeRemaining = lockEndTime - now;
        const minutes = Math.ceil(timeRemaining / 1000 / 60);
    
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
    
        let message;
    
        if (hours > 0) {
            message = `Too many attempts. Try again in ${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`;
        } else {
            message = `Too many attempts. Try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`;
        }
    
        return res.status(403).json({ message });
      } else {
        await resetAttempts(email);
      }
    }

    const user = await getUserByEmail(email);
    if (!user) {
      await recordAttempt(email);
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await recordAttempt(email);
      return res.status(400).json({ message: 'Incorrect password' });
    }

    await resetAttempts(email);

    await deleteOldestTokenIfLimitExceeded(user.id, 3);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await saveToken(user.id, token, expiresAt);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message || error });
  }
};

exports.user = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      id: user.id, 
      name: user.name, 
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      age: user.age,
      is_approved: user.is_approved,
      created_at: user.created_at, 
      updated_at: user.updated_at 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
  }
};