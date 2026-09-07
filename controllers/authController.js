const User = require('../models/userModel');

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

    res.status(200).json({
      message: 'User login successful',
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

    // Default admin credentials check: username "admin", password "admin123"
    if (username.trim() === 'admin' && password === 'admin123') {
      return res.status(200).json({
        message: 'Admin login successful',
        userId: 'admin',
        role: 'admin'
      });
    }

    // check database if custom admin user exists
    const adminUser = await User.findOne({ username: username.trim(), role: 'admin' });

    if (adminUser && adminUser.password === password) {
      return res.status(200).json({
        message: 'Admin login successful',
        userId: adminUser.username,
        role: 'admin'
      });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  userLogin,
  adminLogin
};
