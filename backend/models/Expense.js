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
  category: {
    type: String,
    enum: ['needs', 'wants', 'food', 'transport', 'health', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('Expense', expenseSchema)