const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'expense_tracker_secret_jwt_key_2026_super_secure';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, secret, { expiresIn });
};

const sendAuthResponse = (res, statusCode, message, user) => {
  const token = generateToken({ userId: user.userId, role: user.role });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  return res.status(statusCode).json({
    message,
    token,
    userId: user.userId,
    role: user.role
  });
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    let user = await User.findOne({ username: username.trim() });

    if (!user) {
      user = await User.create({
        username: username.trim(),
        password,
        role: 'user'
      });
    } else {
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }

    return sendAuthResponse(res, 200, 'User login successful', {
      userId: user.username,
      role: 'user'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (username.trim() === 'admin' && password === 'admin123') {
      return sendAuthResponse(res, 200, 'Admin login successful', {
        userId: 'admin',
        role: 'admin'
      });
    }

    const adminUser = await User.findOne({ username: username.trim(), role: 'admin' });

    if (adminUser && adminUser.password === password) {
      return sendAuthResponse(res, 200, 'Admin login successful', {
        userId: adminUser.username,
        role: 'admin'
      });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  userLogin,
  adminLogin,
  logout
};
