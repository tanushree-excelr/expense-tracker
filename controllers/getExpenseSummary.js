const Expense = require('../models/expenseModel');

const getExpenseSummary = async (req, res) => {
  try {
    const { userId, role } = req.query;

  
    let filter = {};
    if (role !== 'admin' && userId) {
      filter.userId = userId;
    }

    const expenses = await Expense.find(filter);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    res.status(200).json({ totalExpenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getExpenseSummary;
