const jwt = require('jsonwebtoken');
const User = require('../models/User');

// helper function to send token
const sendToken = (res, statusCode, message, user) => {
  const token = jwt.sign(
    { userId: user.username, role: user.role },
    process.env.JWT_SECRET || 'expense_trackeR',
    { expiresIn: '1d' }
  );

  res.cookie('token', token, { httpOnly: true });

  return res.status(statusCode).json({
    message,
    token,
    userId: user.username,
    role: user.role
  });
};

// user login
const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json
      ({ message: 'Username and password are required' });
    }

    let user = await User.findOne({ username });

    // if user does not exist, create it
    if (!user) {
      user = await User.create
      ({ username, password, role: 'user' });
    } else if (user.password !== password) {
      return res.status(401).json
      ({ message: 'Invalid password' });
    }

    return sendToken(res, 200, 'User login successful', user);
  } catch (error) {
    return res.status(500).json
    ({ message: error.message });
  }
};

// admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json
      ({ message: 'Username and password are required' });
    }

    const admin = await User.findOne
    ({ username, password, role: 'admin' });

    if (!admin) {
      // allow default admin credentials
      if (username === 'admin' && password === 'admin123') {
        return sendToken(res, 200, 'Admin login successful', { username: 'admin', role: 'admin' });
      }
      return res.status(401).json
      ({ message: 'Invalid admin credentials' });
    }

    return sendToken(res, 200, 'Admin login successful', admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// logout
const logout = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json
  ({ message: 'Logged out successfully' });
};

module.exports = {
  userLogin,
  adminLogin,
  logout
};
