'use client'

import { useState, useEffect } from 'react'
import { DashboardData, RQIData, EquipmentMetrics, AnomalyAlert, CalibrationData } from '../types'
import RQICard from './RQICard'
import FeedVariabilityChart from './FeedVariabilityChart'
import EquipmentStatus from './EquipmentStatus'
import AlertPanel from './AlertPanel'
import HistoricalDataTable from './HistoricalDataTable'
import CalibrationPanel from './CalibrationPanel'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCalibrationMode, setIsCalibrationMode] = useState(false)

  // Simulate real-time data updates
  const generateMockData = (): DashboardData => {
    const now = Date.now()
    const currentRQI: RQIData = {
      id: 'rqi-current',
      timestamp: now,
      value: 75 + Math.random() * 20,
      calibrated: true,
      feedVariability: 5 + Math.random() * 10
    }

    const equipmentStatus: EquipmentMetrics = {
      id: 'eq-main',
      timestamp: now,
      load: 60 + Math.random() * 30,
      status: Math.random() > 0.8 ? 'warning' : 'normal',
      temperature: 70 + Math.random() * 20,
      vibration: 2 + Math.random() * 3
    }

    const recentAlerts: AnomalyAlert[] = [
      {
        id: 'alert-1',
        timestamp: now - 300000,
        type: 'rqi_drop',
        severity: 'medium',
        message: 'RQI dropped below threshold',
        resolved: false
      }
    ]

    const rqiHistory = Array.from({ length: 20 }, (_, i) => ({
      id: `rqi-${i}`,
      timestamp: now - (i * 60000),
      value: 70 + Math.random() * 25,
      calibrated: true,
      feedVariability: 5 + Math.random() * 10
    }))

    const feedVariabilityTrend = Array.from({ length: 20 }, (_, i) => ({
      timestamp: now - (i * 60000),
      value: 5 + Math.random() * 10
    }))

    return {
      currentRQI,
      equipmentStatus,
      recentAlerts,
      rqiHistory,
      feedVariabilityTrend
    }
  }

  useEffect(() => {
    // Fetch initial data including calibration
    const fetchData = async () => {
      try {
        // Try to fetch latest calibration from backend
        const calibrationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/calibration/latest`)
        let lastCalibration = null
        if (calibrationResponse.ok) {
          lastCalibration = await calibrationResponse.json()
        }

        // Generate mock data with calibration info
        const mockData: DashboardData = generateMockData()
        mockData.lastCalibration = lastCalibration
        
        setData(mockData)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to mock data without calibration
        setData(generateMockData())
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Set up real-time updates
    const interval = setInterval(() => {
      setData(generateMockData())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleCalibrationComplete = async (calibrationData: CalibrationData) => {
    // Store calibration in backend (with fallback)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/calibration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calibrationData),
      })
      
      if (response.ok) {
        // Update local state with new calibration
        setData(prev => prev ? { ...prev, lastCalibration: calibrationData } : null)
      } else {
        // Still update local state even if backend fails
        setData(prev => prev ? { ...prev, lastCalibration: calibrationData } : null)
        console.warn('Backend not available, calibration saved locally only')
      }
    } catch (error) {
      console.error('Failed to save calibration:', error)
      // Still update local state for demo purposes
      setData(prev => prev ? { ...prev, lastCalibration: calibrationData } : null)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading CaneIQ Dashboard...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6 space-y-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">CaneIQ Dashboard</h1>
            <p className="text-gray-400">Real-time Feedstock Intelligence Monitoring</p>
          </div>
          
          {/* Calibration Mode Toggle */}
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${isCalibrationMode ? 'text-cane-accent' : 'text-gray-400'}`}>
              {isCalibrationMode ? 'Calibration Mode' : 'Live Mode'}
            </span>
            <button
              onClick={() => setIsCalibrationMode(!isCalibrationMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cane-accent focus:ring-offset-2 focus:ring-offset-cane-darker ${
                isCalibrationMode ? 'bg-cane-accent' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isCalibrationMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RQICard data={data.currentRQI} lastCalibration={data.lastCalibration} />
        </div>
        <div className="lg:col-span-2">
          <FeedVariabilityChart data={data.feedVariabilityTrend} />
        </div>
      </div>

      {/* Calibration Panel - Only show in Calibration Mode */}
      {isCalibrationMode && (
        <CalibrationPanel
          currentRQI={data.currentRQI.value}
          onCalibrationComplete={handleCalibrationComplete}
          lastCalibration={data.lastCalibration || null}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquipmentStatus data={data.equipmentStatus} />
        <AlertPanel alerts={data.recentAlerts} />
      </div>

      <HistoricalDataTable data={data.rqiHistory} />
    </div>
  )
}
