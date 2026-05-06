require('dotenv').config()
const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
const path     = require('path')

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET')
console.log('JWT_SECRET:',  process.env.JWT_SECRET  ? 'SET' : 'NOT SET')

const app = express()

// Allow all origins (Render + any frontend)
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

// ── MongoDB connection ──────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)   // crash loudly so Render shows the real error
  })

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/expenses', require('./routes/expenses'))
app.use('/api/budget',   require('./routes/budget'))

// ── Health check (useful for Render) ───────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ── Serve frontend ──────────────────────────────────────────
const frontendPath = path.join(__dirname, '..')
app.use(express.static(frontendPath))
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))