const express = require('express')
const auth = require('../middleware/auth')
const Expense = require('../models/Expense')

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 })
    res.json(expenses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, amount, category, date, note } = req.body
    if (!name || !amount) {
      return res.status(400).json({ message: 'Name and amount are required' })
    }
    const expense = new Expense({
      userId: req.user.userId,
      name,
      amount: Number(amount),
      category: category || 'other',
      date: date ? new Date(date) : new Date(),
      note: note || ''
    })
    await expense.save()
    res.status(201).json(expense)
  } catch (err) {
    console.error('Expense save error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    })
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }
    res.json({ message: 'Expense deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
