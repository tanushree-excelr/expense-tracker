const Expense = require('../models/Expense');

// get all expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json
    ({ message: error.message });
  }
};

module.exports = getAllExpenses;
