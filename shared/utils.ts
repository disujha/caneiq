// Shared utility functions for CaneIQ platform

import { RQIData, EquipmentMetrics, AnomalyAlert, SystemConfig } from './types'

// Date and time utilities
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString()
}

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString()
}

export const formatDateShort = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString()
}

// RQI utilities
export const getRQIColor = (value: number): string => {
  if (value >= 80) return '#22c55e' // green
  if (value >= 60) return '#f59e0b' // yellow
  return '#ef4444' // red
}

export const getRQIStatus = (value: number): string => {
  if (value >= 80) return 'Excellent'
  if (value >= 60) return 'Good'
  return 'Needs Attention'
}

export const getRQITrend = (history: RQIData[]): 'up' | 'down' | 'stable' => {
  if (history.length < 2) return 'stable'
  
  const recent = history.slice(-5)
  const first = recent[0].value
  const last = recent[recent.length - 1].value
  const change = last - first
  
  if (Math.abs(change) < 2) return 'stable'
  return change > 0 ? 'up' : 'down'
}

// Equipment utilities
export const getEquipmentStatusColor = (status: string): string => {
  switch (status) {
    case 'normal': return '#22c55e'
    case 'warning': return '#f59e0b'
    case 'critical': return '#ef4444'
    default: return '#6b7280'
  }
}

export const getLoadColor = (load: number): string => {
  if (load >= 80) return '#ef4444'
  if (load >= 60) return '#f59e0b'
  return '#22c55e'
}

export const isEquipmentHealthy = (metrics: EquipmentMetrics): boolean => {
  return metrics.status === 'normal' &&
         metrics.load < 80 &&
         metrics.temperature < 90 &&
         metrics.vibration < 5
}

// Alert utilities
export const getAlertSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'high': return '#ef4444'
    case 'medium': return '#f59e0b'
    case 'low': return '#22c55e'
    default: return '#6b7280'
  }
}

export const getAlertTypeIcon = (type: string): string => {
  switch (type) {
    case 'rqi_drop': return '📉'
    case 'equipment_failure': return '⚠️'
    case 'quality_variance': return '🔄'
    default: return 'ℹ️'
  }
}

export const getActiveAlerts = (alerts: AnomalyAlert[]): AnomalyAlert[] => {
  return alerts.filter(alert => !alert.resolved)
}

export const getCriticalAlerts = (alerts: AnomalyAlert[]): AnomalyAlert[] => {
  return alerts.filter(alert => !alert.resolved && alert.severity === 'high')
}

// Data validation utilities
export const validateRQIValue = (value: number): boolean => {
  return typeof value === 'number' && value >= 0 && value <= 100
}

export const validateEquipmentLoad = (load: number): boolean => {
  return typeof load === 'number' && load >= 0 && load <= 100
}

export const validateTemperature = (temp: number): boolean => {
  return typeof temp === 'number' && temp >= -50 && temp <= 200
}

// Calculation utilities
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0
  const mean = calculateAverage(values)
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2))
  return Math.sqrt(calculateAverage(squaredDiffs))
}

export const calculateFeedVariability = (rqiHistory: RQIData[]): number => {
  if (rqiHistory.length < 2) return 0
  const values = rqiHistory.map(item => item.value)
  return calculateStandardDeviation(values)
}

// Data transformation utilities
export const normalizeValue = (
  value: number,
  min: number,
  max: number,
  targetMin: number = 0,
  targetMax: number = 100
): number => {
  if (max === min) return targetMin
  const normalized = (value - min) / (max - min)
  return targetMin + normalized * (targetMax - targetMin)
}

export const clampValue = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

// Time-based utilities
export const getTimeAgo = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

export const isRecent = (timestamp: number, thresholdMinutes: number = 5): boolean => {
  const now = Date.now()
  const diff = now - timestamp
  return diff < thresholdMinutes * 60000
}

// Configuration utilities
export const getDefaultConfig = (): SystemConfig => ({
  rqi: {
    target_value: 75,
    acceptable_range: [60, 90],
    calibration_interval: 86400000 // 24 hours
  },
  equipment: {
    max_load: 85,
    temperature_threshold: 85,
    vibration_threshold: 4.5
  },
  alerts: {
    enabled: true,
    thresholds: {
      rqi_low: 60,
      load_high: 80,
      temperature_high: 85
    }
  },
  simulation: {
    enabled: true,
    interval: 2000,
    data_variance: 15
  }
})

// Error handling utilities
export class CaneIQError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'CaneIQError'
  }
}

export const createError = (message: string, code: string, statusCode?: number) => {
  return new CaneIQError(message, code, statusCode)
}

// Logging utilities
export const createLogger = (service: string) => {
  return {
    info: (message: string, data?: any) => {
      console.log(JSON.stringify({
        level: 'info',
        service,
        message,
        data,
        timestamp: new Date().toISOString()
      }))
    },
    warn: (message: string, data?: any) => {
      console.warn(JSON.stringify({
        level: 'warn',
        service,
        message,
        data,
        timestamp: new Date().toISOString()
      }))
    },
    error: (message: string, error?: any) => {
      console.error(JSON.stringify({
        level: 'error',
        service,
        message,
        error: error?.stack || error,
        timestamp: new Date().toISOString()
      }))
    }
  }
}

// Performance monitoring utilities
export const createTimer = () => {
  const start = performance.now()
  return {
    end: () => {
      const end = performance.now()
      return end - start
    },
    getElapsed: () => performance.now() - start
  }
}

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
