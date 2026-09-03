const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    date: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
