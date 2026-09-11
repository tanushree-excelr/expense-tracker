const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const User = require('../models/User');

// delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    // find expense 
    const expense = await Expense.findOne({ _id: id, userId: req.user.userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(id);

    // pull expense id 
    await User.findOneAndUpdate(
      { username: req.user.userId },
      { $pull: { expenses: expense._id } }
    );

    res.status(200).json
    ({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json
    ({ message: error.message });
  }
};

module.exports = deleteExpense;
