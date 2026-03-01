const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { db, isFirebaseAvailable } = require('./services/firebase')
const rqiRoutes = require('./routes/rqi')
const equipmentRoutes = require('./routes/equipment')
const alertsRoutes = require('./routes/alerts')
const calibrationRoutes = require('./routes/calibration')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/rqi', rqiRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/alerts', alertsRoutes)
app.use('/api/calibration', calibrationRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    firebase: isFirebaseAvailable ? 'connected' : 'mock'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`CaneIQ Backend running on port ${PORT}`)
  console.log(`Firebase: ${isFirebaseAvailable ? 'Connected' : 'Using mock storage'}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})
