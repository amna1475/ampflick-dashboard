const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const orderRoutes = require('./routes/orderRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const deleteRequestRoutes = require('./routes/deleteRequestRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('dev')) // logs each request in the terminal, helpful while developing

// Health check — visit http://localhost:5000/api/health to confirm the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ampflick backend is running' })
})

// Feature routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/delete-requests', deleteRequestRoutes)

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` })
})

// Central error handler — always registered last
app.use(errorHandler)

module.exports = app
