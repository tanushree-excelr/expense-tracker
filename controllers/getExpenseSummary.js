const Expense = require('../models/Expense');

// get total expense summary
const getExpenseSummary = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'admin') {
      // admin can view all summary or filter by a specific userId
      if (req.query.userId) {
        filter.userId = req.query.userId.trim();
      }
    } else {
      // normal user
      if (req.query.userId && req.query.userId !== req.user.userId) {
        return res.status(403).json
        ({ message: 'Access denied: You can only view your own summary' });
      }
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
