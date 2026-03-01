const express = require('express')
const router = express.Router()
const { db, isFirebaseAvailable } = require('../services/firebase')

// GET current RQI
router.get('/current', async (req, res) => {
  try {
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('rqi')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get()
      
      if (snapshot.docs.length > 0) {
        const currentRQI = snapshot.docs[0].data()
        return res.json(currentRQI)
      }
    }
    
    // Fallback to mock data
    const currentRQI = {
      id: 'rqi-default',
      timestamp: Date.now(),
      value: 75 + Math.random() * 20,
      calibrated: true,
      feedVariability: 5 + Math.random() * 10
    }
    res.json(currentRQI)
  } catch (error) {
    console.error('Error fetching current RQI:', error)
    res.status(500).json({ error: 'Failed to fetch RQI data' })
  }
})

// GET RQI history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('rqi')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get()
      
      const history = snapshot.docs.map(doc => doc.data())
      return res.json(history)
    }
    
    // Fallback to mock data
    const history = Array.from({ length: limit }, (_, i) => ({
      id: `rqi-${i}`,
      timestamp: Date.now() - (i * 60000),
      value: 70 + Math.random() * 25,
      calibrated: true,
      feedVariability: 5 + Math.random() * 10
    }))
    res.json(history)
  } catch (error) {
    console.error('Error fetching RQI history:', error)
    res.status(500).json({ error: 'Failed to fetch RQI history' })
  }
})

// POST new RQI value
router.post('/', async (req, res) => {
  try {
    const { value, calibrated, feedVariability } = req.body
    
    if (!value || typeof value !== 'number') {
      return res.status(400).json({ error: 'RQI value is required and must be a number' })
    }

    const newRQI = {
      timestamp: Date.now(),
      value,
      calibrated: calibrated || false,
      feedVariability: feedVariability || 0
    }

    if (isFirebaseAvailable) {
      const docRef = await db.collection('rqi').add(newRQI)
      newRQI.id = docRef.id
    } else {
      newRQI.id = `rqi-${Date.now()}`
    }

    res.status(201).json(newRQI)
  } catch (error) {
    console.error('Error saving RQI data:', error)
    res.status(500).json({ error: 'Failed to save RQI data' })
  }
})

// GET feed variability trend
router.get('/variability-trend', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('rqi')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get()
      
      const trend = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          timestamp: data.timestamp,
          value: data.feedVariability
        }
      })
      return res.json(trend)
    }
    
    // Fallback to mock data
    const trend = Array.from({ length: limit }, (_, i) => ({
      timestamp: Date.now() - (i * 60000),
      value: 5 + Math.random() * 10
    }))
    res.json(trend)
  } catch (error) {
    console.error('Error fetching variability trend:', error)
    res.status(500).json({ error: 'Failed to fetch variability trend' })
  }
})

module.exports = router
