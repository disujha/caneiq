const axios = require('axios')

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'
const SIMULATION_INTERVAL = process.env.SIMULATION_INTERVAL || 2000 // 2 seconds

class EdgeSimulation {
  constructor() {
    this.isRunning = false
    this.intervalId = null
  }

  // Simulate camera data capture
  simulateCameraData() {
    // Simulate image processing metrics
    const brightness = 50 + Math.random() * 50
    const contrast = 30 + Math.random() * 40
    const sharpness = 60 + Math.random() * 30
    const colorVariation = 20 + Math.random() * 60

    return {
      timestamp: Date.now(),
      brightness,
      contrast,
      sharpness,
      colorVariation,
      frameId: `frame-${Date.now()}`,
      resolution: '1920x1080',
      fps: 30
    }
  }

  // Send RQI data to backend
  async sendRQIData() {
    try {
      const cameraData = this.simulateCameraData()
      
      // Simulate AI processing to calculate RQI
      const rqiValue = this.calculateRQI(cameraData)
      const feedVariability = this.calculateFeedVariability(cameraData)
      
      const rqiData = {
        value: rqiValue,
        calibrated: Math.random() > 0.1, // 90% calibrated
        feedVariability
      }

      const response = await axios.post(`${BACKEND_URL}/api/rqi`, rqiData)
      console.log(`RQI data sent: ${rqiValue.toFixed(2)} (Variability: ${feedVariability.toFixed(2)}%)`)
      
      return response.data
    } catch (error) {
      console.error('Error sending RQI data:', error.message)
    }
  }

  // Send equipment metrics to backend
  async sendEquipmentMetrics() {
    try {
      const metrics = {
        load: 60 + Math.random() * 30,
        status: Math.random() > 0.8 ? 'warning' : 'normal',
        temperature: 70 + Math.random() * 20,
        vibration: 2 + Math.random() * 3
      }

      const response = await axios.post(`${BACKEND_URL}/api/equipment/metrics`, metrics)
      console.log(`Equipment metrics sent: Load ${metrics.load.toFixed(1)}%, Status: ${metrics.status}`)
      
      return response.data
    } catch (error) {
      console.error('Error sending equipment metrics:', error.message)
    }
  }

  // Calculate RQI based on camera data
  calculateRQI(cameraData) {
    const { brightness, contrast, sharpness, colorVariation } = cameraData
    
    // Simulate computer vision processing
    let rqi = 50 // Base value
    
    // Brightness factor (optimal range 60-80)
    if (brightness >= 60 && brightness <= 80) {
      rqi += 15
    } else if (brightness < 60) {
      rqi -= (60 - brightness) * 0.3
    } else {
      rqi -= (brightness - 80) * 0.2
    }
    
    // Contrast factor
    rqi += (contrast - 50) * 0.3
    
    // Sharpness factor
    rqi += (sharpness - 75) * 0.2
    
    // Color variation factor (lower is better for consistency)
    rqi -= colorVariation * 0.1
    
    // Add some randomness to simulate real-world variation
    rqi += (Math.random() - 0.5) * 10
    
    // Clamp to 0-100 range
    return Math.max(0, Math.min(100, rqi))
  }

  // Calculate feed variability
  calculateFeedVariability(cameraData) {
    const { colorVariation, brightness, contrast } = cameraData
    
    // Higher variation in color and brightness indicates higher feed variability
    let variability = colorVariation * 0.5
    variability += Math.abs(brightness - 70) * 0.3
    variability += Math.abs(contrast - 50) * 0.2
    
    // Add randomness
    variability += (Math.random() - 0.5) * 5
    
    return Math.max(0, Math.min(20, variability)) // Cap at 20%
  }

  // Generate alerts based on conditions
  async checkAndGenerateAlerts() {
    try {
      const shouldGenerateAlert = Math.random() > 0.9 // 10% chance
      
      if (shouldGenerateAlert) {
        const alertTypes = ['rqi_drop', 'equipment_failure', 'quality_variance']
        const severityLevels = ['low', 'medium', 'high']
        
        const alert = {
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
          message: this.generateAlertMessage()
        }

        await axios.post(`${BACKEND_URL}/api/alerts`, alert)
        console.log(`Alert generated: ${alert.type} - ${alert.severity}`)
      }
    } catch (error) {
      console.error('Error generating alert:', error.message)
    }
  }

  generateAlertMessage() {
    const messages = [
      'RQI dropped below threshold',
      'Equipment load exceeding normal range',
      'Feed variability increased significantly',
      'Camera calibration required',
      'Temperature sensor anomaly detected',
      'Quality variance outside acceptable range'
    ]
    
    return messages[Math.floor(Math.random() * messages.length)]
  }

  // Start simulation
  start() {
    if (this.isRunning) {
      console.log('Simulation is already running')
      return
    }

    console.log('Starting CaneIQ Edge Simulation...')
    console.log(`Target backend: ${BACKEND_URL}`)
    console.log(`Simulation interval: ${SIMULATION_INTERVAL}ms`)
    
    this.isRunning = true
    
    // Initial data send
    this.sendRQIData()
    this.sendEquipmentMetrics()
    this.checkAndGenerateAlerts()
    
    // Set up recurring simulation
    this.intervalId = setInterval(() => {
      Promise.all([
        this.sendRQIData(),
        this.sendEquipmentMetrics(),
        this.checkAndGenerateAlerts()
      ])
    }, SIMULATION_INTERVAL)
  }

  // Stop simulation
  stop() {
    if (!this.isRunning) {
      console.log('Simulation is not running')
      return
    }

    console.log('Stopping CaneIQ Edge Simulation...')
    this.isRunning = false
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...')
  if (simulation) {
    simulation.stop()
  }
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...')
  if (simulation) {
    simulation.stop()
  }
  process.exit(0)
})

// Start simulation
const simulation = new EdgeSimulation()
simulation.start()

module.exports = EdgeSimulation
