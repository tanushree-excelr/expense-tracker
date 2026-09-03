const Expense = require('../models/expenseModel');

const getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    res.status(200).json({ totalExpenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getExpenseSummary;
