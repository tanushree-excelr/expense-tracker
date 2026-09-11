const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password -activeToken')
      .populate('expenses');//metadata like category decriptiom 

    res.status(200).json({
      count: users.length,//how many users found
      users
    });
  } catch (error) {
    res.status(500).json
    ({ message: error.message });
  }
};

module.exports = {
  getAllUsers
};
