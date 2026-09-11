const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    if (description !== undefined && description.trim() === '') {
      return res.status(400).json({ message: 'Description cannot be empty' });
    }

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // find expense belonging to authenticated user
    const expense = await Expense.findOne({ _id: id, userId: req.user.userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (description) expense.description = description.trim();
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = date;

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
