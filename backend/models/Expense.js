const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: String,
  date: {
    type: Date,
    default: Date.now
  },
  note: String
}, { timestamps: true })

module.exports = mongoose.model('Expense', expenseSchema)
