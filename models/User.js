const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
      }
    ]
  }
);

module.exports = mongoose.model('User', userSchema);