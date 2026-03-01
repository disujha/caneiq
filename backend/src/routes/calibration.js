const express = require('express')
const router = express.Router()
const { db, isFirebaseAvailable } = require('../services/firebase')

// GET calibration history
router.get('/history', async (req, res) => {
  try {
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('calibrations')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get()
      
      const calibrations = snapshot.docs.map(doc => doc.data())
      return res.json(calibrations)
    }
    
    // Fallback to mock data
    const calibrations = []
    res.json(calibrations)
  } catch (error) {
    console.error('Error fetching calibration history:', error)
    res.status(500).json({ error: 'Failed to fetch calibration history' })
  }
})

// POST new calibration
router.post('/', async (req, res) => {
  try {
    const { reference_pol_value, measured_pol_value, calibration_factor, timestamp, applied } = req.body
    
    if (!reference_pol_value || !measured_pol_value || !calibration_factor) {
      return res.status(400).json({ 
        error: 'Reference POL, measured POL, and calibration factor are required' 
      })
    }

    const newCalibration = {
      reference_pol_value,
      measured_pol_value,
      calibration_factor,
      timestamp: timestamp || Date.now(),
      applied: applied !== false
    }

    if (isFirebaseAvailable) {
      const docRef = await db.collection('calibrations').add(newCalibration)
      newCalibration.id = docRef.id
    } else {
      newCalibration.id = `calibration-${Date.now()}`
    }

    res.status(201).json(newCalibration)
  } catch (error) {
    console.error('Error saving calibration:', error)
    res.status(500).json({ error: 'Failed to save calibration' })
  }
})

// GET latest calibration
router.get('/latest', async (req, res) => {
  try {
    if (isFirebaseAvailable) {
      const snapshot = await db.collection('calibrations')
        .where('applied', '==', true)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get()
      
      if (snapshot.docs.length > 0) {
        const latestCalibration = snapshot.docs[0].data()
        return res.json(latestCalibration)
      }
    }
    
    // Return empty if no calibration found
    res.json(null)
  } catch (error) {
    console.error('Error fetching latest calibration:', error)
    res.status(500).json({ error: 'Failed to fetch latest calibration' })
  }
})

module.exports = router
