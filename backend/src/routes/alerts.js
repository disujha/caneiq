const express = require('express')
const router = express.Router()
const { db, isFirebaseAvailable } = require('../services/firebase')

// GET all alerts
router.get('/', async (req, res) => {
  try {
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('alerts')
        .orderBy('timestamp', 'desc')
        .get()
      
      const alerts = snapshot.docs.map(doc => doc.data())
      return res.json(alerts)
    }
    
    // Fallback to mock data
    const alerts = [
      {
        id: 'alert-1',
        timestamp: Date.now() - 300000,
        type: 'rqi_drop',
        severity: 'medium',
        message: 'RQI dropped below threshold',
        resolved: false
      }
    ]
    res.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    res.status(500).json({ error: 'Failed to fetch alerts' })
  }
})

// GET active alerts (unresolved)
router.get('/active', async (req, res) => {
  try {
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('alerts')
        .where('resolved', '==', false)
        .orderBy('timestamp', 'desc')
        .get()
      
      const activeAlerts = snapshot.docs.map(doc => doc.data())
      return res.json(activeAlerts)
    }
    
    // Fallback to mock data
    const activeAlerts = [
      {
        id: 'alert-1',
        timestamp: Date.now() - 300000,
        type: 'rqi_drop',
        severity: 'medium',
        message: 'RQI dropped below threshold',
        resolved: false
      }
    ]
    res.json(activeAlerts)
  } catch (error) {
    console.error('Error fetching active alerts:', error)
    res.status(500).json({ error: 'Failed to fetch active alerts' })
  }
})

// POST new alert
router.post('/', async (req, res) => {
  try {
    const { type, severity, message } = req.body
    
    if (!type || !severity || !message) {
      return res.status(400).json({ 
        error: 'Type, severity, and message are required' 
      })
    }

    const newAlert = {
      timestamp: Date.now(),
      type,
      severity,
      message,
      resolved: false
    }

    if (isFirebaseAvailable) {
      const docRef = await db.collection('alerts').add(newAlert)
      newAlert.id = docRef.id
    } else {
      newAlert.id = `alert-${Date.now()}`
    }

    res.status(201).json(newAlert)
  } catch (error) {
    console.error('Error creating alert:', error)
    res.status(500).json({ error: 'Failed to create alert' })
  }
})

// PUT resolve alert
router.put('/:id/resolve', async (req, res) => {
  try {
    const alertId = req.params.id
    
    if (isFirebaseAvailable) {
      const alertRef = db.collection('alerts').doc(alertId)
      const alertDoc = await alertRef.get()
      
      if (!alertDoc.exists) {
        return res.status(404).json({ error: 'Alert not found' })
      }
      
      await alertRef.update({ resolved: true })
      const updatedAlert = (await alertRef.get()).data()
      return res.json(updatedAlert)
    }
    
    // Fallback for mock data
    const alert = {
      id: alertId,
      timestamp: Date.now() - 300000,
      type: 'rqi_drop',
      severity: 'medium',
      message: 'RQI dropped below threshold',
      resolved: true
    }
    res.json(alert)
  } catch (error) {
    console.error('Error resolving alert:', error)
    res.status(500).json({ error: 'Failed to resolve alert' })
  }
})

module.exports = router
