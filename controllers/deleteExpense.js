const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    // find expense (admin can find)
    const filter = req.user.role === 'admin'
      ? { _id: id }
      : { _id: id, userId: req.user.userId };

    const expense = await Expense.findOne(filter);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(id);

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteExpense;
