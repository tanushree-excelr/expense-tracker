const Expense = require('../models/expenseModel');

const addExpense = async (req, res) => {
  try {
    const { userId, role, description, amount, category, date } = req.body;

    if (!userId || userId.trim() === '') {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description cannot be empty' });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    if (date) {
      const inputDate = new Date(date);
      const currentDate = new Date();

      if (inputDate > currentDate) {
        return res.status(400).json({ message: 'future date is not allowed' });
      }
    }

    const expense = await Expense.create({
      userId: userId.trim(),
      role: role === 'admin' ? 'admin' : 'user',
      description: description.trim(),
      amount,
      category,
      date
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
