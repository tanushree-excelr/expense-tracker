const mongoose = require('mongoose');
const Expense = require('../models/expenseModel');

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (req.user.role !== 'admin' && expense.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied: You can only delete your own expenses' });
    }

    await Expense.findByIdAndDelete(id);

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteExpense;
