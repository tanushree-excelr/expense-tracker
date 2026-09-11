const Expense = require('../models/Expense');

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// get monthly summary
const getMonthlySummary = async (req, res) => {
  try {
    const month = parseInt(req.params.month);

    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json
      ({ message: 'Month must be between 1 and 12' });
    }

    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, month - 1, 1);
    const endDate = new Date(currentYear, month, 0, 23, 59, 59, 999);

    const query = {
      userId: req.user.userId,
      date: { $gte: startDate, $lte: endDate }
    };

    const expenses = await Expense.find(query);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    res.status(200).json({
      month: months[month - 1],
      totalExpenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getMonthlySummary;
