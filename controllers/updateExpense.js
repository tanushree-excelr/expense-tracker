const Expense = require('../models/Expense');

// update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateExpense;