const express = require('express')
const router = express.Router()
const { db, isFirebaseAvailable } = require('../services/firebase')

// GET current equipment status
router.get('/status', async (req, res) => {
  try {
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('equipment')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get()
      
      if (snapshot.docs.length > 0) {
        const currentStatus = snapshot.docs[0].data()
        return res.json(currentStatus)
      }
    }
    
    // Fallback to mock data
    const currentStatus = {
      id: 'eq-main',
      timestamp: Date.now(),
      load: 60 + Math.random() * 30,
      status: Math.random() > 0.8 ? 'warning' : 'normal',
      temperature: 70 + Math.random() * 20,
      vibration: 2 + Math.random() * 3
    }
    res.json(currentStatus)
  } catch (error) {
    console.error('Error fetching equipment status:', error)
    res.status(500).json({ error: 'Failed to fetch equipment status' })
  }
})

// POST new equipment metrics
router.post('/metrics', async (req, res) => {
  try {
    const { load, status, temperature, vibration } = req.body
    
    if (!load || typeof load !== 'number') {
      return res.status(400).json({ error: 'Load value is required and must be a number' })
    }

    const newMetrics = {
      timestamp: Date.now(),
      load,
      status: status || 'normal',
      temperature: temperature || 0,
      vibration: vibration || 0
    }

    if (isFirebaseAvailable) {
      const docRef = await db.collection('equipment').add(newMetrics)
      newMetrics.id = docRef.id
    } else {
      newMetrics.id = `eq-${Date.now()}`
    }

    res.status(201).json(newMetrics)
  } catch (error) {
    console.error('Error saving equipment metrics:', error)
    res.status(500).json({ error: 'Failed to save equipment metrics' })
  }
})

// GET equipment history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('equipment')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get()
      
      const history = snapshot.docs.map(doc => doc.data())
      return res.json(history)
    }
    
    // Fallback to mock data
    const history = Array.from({ length: limit }, (_, i) => ({
      id: `eq-${i}`,
      timestamp: Date.now() - (i * 60000),
      load: 60 + Math.random() * 30,
      status: Math.random() > 0.8 ? 'warning' : 'normal',
      temperature: 70 + Math.random() * 20,
      vibration: 2 + Math.random() * 3
    }))
    res.json(history)
  } catch (error) {
    console.error('Error fetching equipment history:', error)
    res.status(500).json({ error: 'Failed to fetch equipment history' })
  }
})

module.exports = router
