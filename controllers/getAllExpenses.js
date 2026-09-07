const Expense = require('../models/expenseModel');

const getAllExpenses = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'admin') {
      if (req.query.userId) {
        filter.userId = req.query.userId.trim();
      }
    } else {
      filter.userId = req.user.userId;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getAllExpenses;
