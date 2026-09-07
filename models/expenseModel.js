const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
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
