const express = require('express')
const auth = require('../middleware/auth')
const Budget = require('../models/Budget')

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    // FIX: was req.user.id — JWT signs with userId, not id
    const budget = await Budget.findOne({ userId: req.user.userId })
    res.json(budget || { monthlyLimit: 0 })
  } catch (err) {
    console.error('Budget GET error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { monthlyLimit } = req.body

    if (monthlyLimit === undefined || monthlyLimit < 0) {
      return res.status(400).json({ message: 'Valid monthly limit is required' })
    }

    // FIX: was req.user.id
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.userId },
      { monthlyLimit },
      { upsert: true, new: true }
    )

    res.json(budget)
  } catch (err) {
    console.error('Budget POST error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router