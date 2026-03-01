'use client'

import { useState, useEffect } from 'react'
import { CalibrationData } from '../types'

interface CalibrationPanelProps {
  currentRQI: number
  onCalibrationComplete: (calibrationData: CalibrationData) => void
  lastCalibration: CalibrationData | null
}

export default function CalibrationPanel({ 
  currentRQI, 
  onCalibrationComplete, 
  lastCalibration 
}: CalibrationPanelProps) {
  const [labPOLValue, setLabPOLValue] = useState<string>('')
  const [calibrationFactor, setCalibrationFactor] = useState<number>(1.0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  const referencePOL = 95.0 // Reference POL value for ideal cane

  useEffect(() => {
    if (labPOLValue && !isNaN(parseFloat(labPOLValue))) {
      const pol = parseFloat(labPOLValue)
      if (pol > 0) {
        const factor = referencePOL / pol
        setCalibrationFactor(factor)
      }
    } else {
      setCalibrationFactor(1.0)
    }
  }, [labPOLValue])

  const handleCalibrate = async () => {
    if (!labPOLValue || isNaN(parseFloat(labPOLValue)) || parseFloat(labPOLValue) <= 0) {
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 2000)
      return
    }

    setIsProcessing(true)
    setSyncStatus('syncing')

    // Simulate calibration processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    const calibrationData: CalibrationData = {
      reference_pol_value: referencePOL,
      measured_pol_value: parseFloat(labPOLValue),
      calibration_factor: calibrationFactor,
      timestamp: Date.now(),
      applied: true
    }

    try {
      await onCalibrationComplete(calibrationData)
      setSyncStatus('synced')
      setLabPOLValue('')
    } catch (error) {
      setSyncStatus('error')
    } finally {
      setIsProcessing(false)
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-yellow-400'
      case 'synced': return 'text-cane-accent'
      case 'error': return 'text-cane-danger'
      default: return 'text-gray-400'
    }
  }

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing': return 'Calibrating...'
      case 'synced': return 'Model Synced'
      case 'error': return 'Calibration Failed'
      default: return 'Ready to Calibrate'
    }
  }

  const getCalibrationImpact = () => {
    if (calibrationFactor === 1.0) return 'No adjustment needed'
    if (calibrationFactor > 1.0) return `RQI will increase by ${((calibrationFactor - 1) * 100).toFixed(1)}%`
    return `RQI will decrease by ${((1 - calibrationFactor) * 100).toFixed(1)}%`
  }

  return (
    <div className="bg-cane-dark rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Calibration Mode</h2>
        <div className={`flex items-center space-x-2 ${getSyncStatusColor()}`}>
          <div className={`w-2 h-2 rounded-full ${
            syncStatus === 'syncing' ? 'animate-pulse bg-yellow-400' :
            syncStatus === 'synced' ? 'bg-cane-accent' :
            syncStatus === 'error' ? 'bg-cane-danger' : 'bg-gray-400'
          }`} />
          <span className="text-sm font-medium">{getSyncStatusText()}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current RQI Display */}
        <div className="bg-cane-darker rounded-lg p-4 border border-gray-600">
          <div className="text-sm text-gray-400 mb-1">Current RQI</div>
          <div className="text-3xl font-bold text-white">{currentRQI.toFixed(2)}</div>
        </div>

        {/* Lab POL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lab POL % Value
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              value={labPOLValue}
              onChange={(e) => setLabPOLValue(e.target.value)}
              placeholder="Enter Lab POL %"
              step="0.1"
              min="0.1"
              max="100"
              className="flex-1 bg-cane-darker border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cane-accent focus:border-transparent"
              disabled={isProcessing}
            />
            <span className="text-gray-400 flex items-center">%</span>
          </div>
        </div>

        {/* Calibration Factor Display */}
        {labPOLValue && !isNaN(parseFloat(labPOLValue)) && parseFloat(labPOLValue) > 0 && (
          <div className="bg-cane-darker rounded-lg p-4 border border-gray-600">
            <div className="text-sm text-gray-400 mb-2">Calibration Factor</div>
            <div className="text-2xl font-bold text-cane-accent">
              {calibrationFactor.toFixed(4)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {getCalibrationImpact()}
            </div>
          </div>
        )}

        {/* Reference Information */}
        <div className="bg-cane-darker rounded-lg p-4 border border-gray-600">
          <div className="text-sm text-gray-400 mb-1">Reference POL</div>
          <div className="text-lg font-medium text-white">{referencePOL.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">
            Ideal sugar cane quality baseline
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleCalibrate}
            disabled={!labPOLValue || isNaN(parseFloat(labPOLValue)) || parseFloat(labPOLValue) <= 0 || isProcessing}
            className="flex-1 bg-cane-accent hover:bg-cane-accent/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isProcessing ? 'Calibrating...' : 'Apply Calibration'}
          </button>
          <button
            onClick={() => setLabPOLValue('')}
            disabled={isProcessing}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
          >
            Clear
          </button>
        </div>

        {/* Last Calibration Info */}
        {lastCalibration && (
          <div className="bg-cane-darker rounded-lg p-4 border border-gray-600">
            <div className="text-sm text-gray-400 mb-2">Last Calibration</div>
            <div className="space-y-1">
              <div className="text-sm text-white">
                Lab POL: {lastCalibration.measured_pol_value.toFixed(1)}%
              </div>
              <div className="text-sm text-white">
                Factor: {lastCalibration.calibration_factor.toFixed(4)}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(lastCalibration.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
