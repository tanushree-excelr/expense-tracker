const Expense = require('../models/Expense');

// add new expense
const addExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description cannot be empty' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = await Expense.create({
      userId: req.user.userId,
      role: req.user.role,
      description,
      amount,
      category: category || 'General',
      date: date || new Date()
    });

    res.status(201).json({
      message: 'Expense added successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = addExpense;
