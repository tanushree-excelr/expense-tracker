const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
const userRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json
      ({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(409).json
      ({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      password: hashedPassword
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user.username
    });
  } catch (error) {
    res.status(500).json
    ({ message: error.message });
  }
};

// User login
const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json
      ({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json
      ({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.username, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET || 'expense_trackeR',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'User login successful',
      token,
      userId: user.username
    });
  } catch (error) {
    res.status(500).json
    ({ message: error.message });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json
      ({ message: 'Username and password are required' });
    }

    const adminUser = await User.findOne({ username: username.trim(), isAdmin: true });
    if (!adminUser) {
      return res.status(401).json
      ({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json
      ({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { userId: adminUser.username, isAdmin: true },
      process.env.JWT_SECRET || 'expense_trackeR',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      userId: adminUser.username
    });
  } catch (error) {
    res.status(500).json
    ({ message: error.message });
  }
};

// Logout
const logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  userRegister,
  userLogin,
  adminLogin,
  logout
};
