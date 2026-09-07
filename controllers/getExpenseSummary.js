const Expense = require('../models/expenseModel');

const getExpenseSummary = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'admin') {
      if (req.query.userId) {
        filter.userId = req.query.userId.trim();
      }
    } else {
      filter.userId = req.user.userId;
    }

    const expenses = await Expense.find(filter);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    res.status(200).json({ totalExpenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getExpenseSummary;
