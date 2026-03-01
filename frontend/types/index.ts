export interface RQIData {
  id: string
  timestamp: number
  value: number
  calibrated: boolean
  feedVariability: number
}

export interface EquipmentMetrics {
  id: string
  timestamp: number
  load: number
  status: 'normal' | 'warning' | 'critical'
  temperature: number
  vibration: number
}

export interface AnomalyAlert {
  id: string
  timestamp: number
  type: 'rqi_drop' | 'equipment_failure' | 'quality_variance'
  severity: 'low' | 'medium' | 'high'
  message: string
  resolved: boolean
}

export interface CalibrationData {
  reference_pol_value: number
  measured_pol_value: number
  calibration_factor: number
  timestamp: number
  applied: boolean
}

export interface DashboardData {
  currentRQI: RQIData
  equipmentStatus: EquipmentMetrics
  recentAlerts: AnomalyAlert[]
  rqiHistory: RQIData[]
  feedVariabilityTrend: { timestamp: number; value: number }[]
  lastCalibration?: CalibrationData
}
