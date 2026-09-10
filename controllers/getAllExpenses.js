const Expense = require('../models/Expense');

// get all expenses
const getAllExpenses = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'admin') {
      // admin can view all expenses or filter by a specific userId
      if (req.query.userId) {
        filter.userId = req.query.userId.trim();
      }
    } else {
      // normal user
      if (req.query.userId && req.query.userId !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied: You can only view your own expenses' });
      }
      filter.userId = req.user.userId;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getAllExpenses;
