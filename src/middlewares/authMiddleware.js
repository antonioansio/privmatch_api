const jwt = require('jsonwebtoken');
const { deleteToken, getToken } = require('../models/tokenModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tokenExists = await getToken(token);
    if (!tokenExists) {
      return res.status(401).json({ message: 'Unauthorized token or it has been deleted' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      try {
        await deleteToken(token);
        return res.status(401).json({ message: 'Token expired and has been deleted' });
      } catch (dbError) {
        return res.status(500).json({ message: 'Error deleting expired token', error: dbError.message });
      }
    }

    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;