const mongoose = require('mongoose');
const Expense = require('../models/expenseModel');

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role, description, amount, category, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    if (description !== undefined && description.trim() === '') {
      return res.status(400).json({ message: 'Description cannot be empty' });
    }

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (req.user.role !== 'admin' && expense.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied: You can only update your own expenses' });
    }

    if (req.user.role === 'admin') {
      if (userId !== undefined) expense.userId = userId.trim();
      if (role !== undefined && ['user', 'admin'].includes(role)) expense.role = role;
    }

    if (description !== undefined) expense.description = description.trim();
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;

    const updatedExpense = await expense.save();

    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateExpense;
