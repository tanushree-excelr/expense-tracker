const Expense = require('../models/expenseModel');

const getAllExpenses = async (req, res) => {
  try {
    const { userId, role } = req.query;

    
    let filter = {};
    if (role !== 'admin' && userId) {
      filter.userId = userId;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getAllExpenses;
