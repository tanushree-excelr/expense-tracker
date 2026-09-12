const User = require('../models/User');
const bcrypt = require('bcrypt');

// create admin
const createAdmin = async () => {
  const adminExists = await User.findOne({ username: 'admin' });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin@123', 10);

    await User.create({
      username: 'admin',
      password: hashedPassword,
      isAdmin: true
    });

    console.log('Admin user created');
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password -activeToken')
      .populate('expenses');

    res.status(200).json({
      count: users.length,//how many users are there 
      users
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createAdmin,
  getAllUsers
};