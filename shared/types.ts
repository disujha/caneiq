// Shared TypeScript types for CaneIQ platform

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

export interface CameraData {
  timestamp: number
  brightness: number
  contrast: number
  sharpness: number
  colorVariation: number
  frameId: string
  resolution: string
  fps: number
}

export interface AIMetrics {
  brightness: number
  contrast: number
  sharpness: number
  color_uniformity: number
  texture_quality: number
  moisture_indicator: number
}

export interface AIAnalysisResult {
  timestamp: number
  rqi_value: number
  feed_variability: number
  calibrated: boolean
  metrics: AIMetrics
  image_quality_score: number
  processing_time_ms: number
}

export interface DashboardData {
  currentRQI: RQIData
  equipmentStatus: EquipmentMetrics
  recentAlerts: AnomalyAlert[]
  rqiHistory: RQIData[]
  feedVariabilityTrend: { timestamp: number; value: number }[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  services: {
    frontend: HealthStatus
    backend: HealthStatus
    ai_module: HealthStatus
    edge_simulation: HealthStatus
  }
}

export interface CalibrationData {
  reference_pol_value: number
  measured_pol_value: number
  calibration_factor: number
  timestamp: number
  applied: boolean
}

// API Request/Response types
export interface CreateRQIRequest {
  value: number
  calibrated?: boolean
  feedVariability?: number
}

export interface CreateEquipmentMetricsRequest {
  load: number
  status?: 'normal' | 'warning' | 'critical'
  temperature?: number
  vibration?: number
}

export interface CreateAlertRequest {
  type: 'rqi_drop' | 'equipment_failure' | 'quality_variance'
  severity: 'low' | 'medium' | 'high'
  message: string
}

export interface CalibrationRequest {
  pol_value: number
}

export interface CalibrationResponse {
  message: string
  calibration_factor: number
  reference_pol: number
  measured_pol: number
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'rqi_update' | 'equipment_update' | 'alert' | 'system_status'
  data: any
  timestamp: number
}

export interface RQIUpdateMessage extends WebSocketMessage {
  type: 'rqi_update'
  data: RQIData
}

export interface EquipmentUpdateMessage extends WebSocketMessage {
  type: 'equipment_update'
  data: EquipmentMetrics
}

export interface AlertMessage extends WebSocketMessage {
  type: 'alert'
  data: AnomalyAlert
}

export interface SystemStatusMessage extends WebSocketMessage {
  type: 'system_status'
  data: HealthStatus
}

// Configuration types
export interface SystemConfig {
  rqi: {
    target_value: number
    acceptable_range: [number, number]
    calibration_interval: number
  }
  equipment: {
    max_load: number
    temperature_threshold: number
    vibration_threshold: number
  }
  alerts: {
    enabled: boolean
    thresholds: {
      rqi_low: number
      load_high: number
      temperature_high: number
    }
  }
  simulation: {
    enabled: boolean
    interval: number
    data_variance: number
  }
}

// Export type guards
export function isRQIData(obj: any): obj is RQIData {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.value === 'number' &&
    typeof obj.calibrated === 'boolean' &&
    typeof obj.feedVariability === 'number'
}

export function isEquipmentMetrics(obj: any): obj is EquipmentMetrics {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.load === 'number' &&
    ['normal', 'warning', 'critical'].includes(obj.status) &&
    typeof obj.temperature === 'number' &&
    typeof obj.vibration === 'number'
}

export function isAnomalyAlert(obj: any): obj is AnomalyAlert {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'number' &&
    ['rqi_drop', 'equipment_failure', 'quality_variance'].includes(obj.type) &&
    ['low', 'medium', 'high'].includes(obj.severity) &&
    typeof obj.message === 'string' &&
    typeof obj.resolved === 'boolean'
}
