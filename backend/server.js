require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')

const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/expenses', require('./routes/expenses'))
app.use('/api/budget', require('./routes/budget'))

// Serve frontend
const frontendPath = path.join(__dirname, '..')
app.use(express.static(frontendPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"))
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
