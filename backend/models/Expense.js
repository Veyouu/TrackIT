const express = require('express')
const auth = require('../middleware/auth')
const Expense = require('../models/Expense')

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 })

    // Normalize dates to YYYY-MM-DD strings so the frontend can slice safely
    const normalized = expenses.map(e => ({
      ...e.toObject(),
      date: e.date.toISOString().slice(0, 10)
    }))

    res.json(normalized)
  } catch (err) {
    console.error('Expenses GET error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, amount, category, date, note } = req.body

    if (!name || !amount) {
      return res.status(400).json({ message: 'Name and amount are required' })
    }

    const expense = new Expense({
      userId:   req.user.userId,
      name,
      amount:   Number(amount),
      category: category || 'other',
      date:     date ? new Date(date) : new Date(),
      note:     note || ''
    })

    await expense.save()

    // Return with normalized date string so frontend can slice it
    const obj = expense.toObject()
    obj.date = expense.date.toISOString().slice(0, 10)

    res.status(201).json(obj)
  } catch (err) {
    console.error('Expenses POST error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.userId
    })

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.json({ message: 'Expense deleted successfully' })
  } catch (err) {
    console.error('Expenses DELETE error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router