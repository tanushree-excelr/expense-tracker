const Expense = require('../models/Expense');

// get total expense summary
const getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId });
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    return res.status(200).json({ totalExpenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getExpenseSummary;
//add return