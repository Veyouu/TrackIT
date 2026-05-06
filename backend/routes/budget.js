const express = require('express')
const auth = require('../middleware/auth')
const Budget = require('../models/Budget')

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id })
    res.json(budget || { monthlyLimit: 0 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { monthlyLimit } = req.body

    if (!monthlyLimit || monthlyLimit < 0) {
      return res.status(400).json({ message: 'Valid monthly limit is required' })
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { monthlyLimit },
      { upsert: true, new: true }
    )

    res.json(budget)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
