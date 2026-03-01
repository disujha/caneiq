// Shared constants for CaneIQ platform

// API endpoints
export const API_ENDPOINTS = {
  RQI: {
    CURRENT: '/api/rqi/current',
    HISTORY: '/api/rqi/history',
    CREATE: '/api/rqi',
    VARIABILITY_TREND: '/api/rqi/variability-trend'
  },
  EQUIPMENT: {
    STATUS: '/api/equipment/status',
    METRICS: '/api/equipment/metrics',
    HISTORY: '/api/equipment/history'
  },
  ALERTS: {
    ALL: '/api/alerts',
    ACTIVE: '/api/alerts/active',
    CREATE: '/api/alerts',
    RESOLVE: (id: string) => `/api/alerts/${id}/resolve`
  },
  HEALTH: {
    BACKEND: '/health',
    AI_MODULE: 'http://localhost:5000/health'
  }
} as const

// WebSocket events
export const WS_EVENTS = {
  RQI_UPDATE: 'rqi_update',
  EQUIPMENT_UPDATE: 'equipment_update',
  ALERT: 'alert',
  SYSTEM_STATUS: 'system_status',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect'
} as const

// Status values
export const EQUIPMENT_STATUS = {
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical'
} as const

export const ALERT_TYPES = {
  RQI_DROP: 'rqi_drop',
  EQUIPMENT_FAILURE: 'equipment_failure',
  QUALITY_VARIANCE: 'quality_variance'
} as const

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

// RQI thresholds
export const RQI_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  MINIMUM: 0,
  MAXIMUM: 100
} as const

// Equipment thresholds
export const EQUIPMENT_THRESHOLDS = {
  LOAD_WARNING: 60,
  LOAD_CRITICAL: 80,
  TEMPERATURE_WARNING: 75,
  TEMPERATURE_CRITICAL: 85,
  VIBRATION_WARNING: 3.5,
  VIBRATION_CRITICAL: 5.0
} as const

// Feed variability thresholds
export const FEED_VARIABILITY_THRESHOLDS = {
  LOW: 5,
  NORMAL: 10,
  HIGH: 15,
  CRITICAL: 20
} as const

// Time intervals (in milliseconds)
export const TIME_INTERVALS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000
} as const

// Dashboard refresh intervals
export const DASHBOARD_REFRESH_INTERVALS = {
  FAST: 1000,      // 1 second
  NORMAL: 2000,    // 2 seconds
  SLOW: 5000       // 5 seconds
} as const

// Data retention limits
export const DATA_LIMITS = {
  RQI_HISTORY: 100,
  EQUIPMENT_HISTORY: 100,
  ALERTS: 50,
  CHART_POINTS: 20
} as const

// Color palette
export const COLORS = {
  PRIMARY: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6',
  GRAY: '#6b7280',
  DARK: '#1f2937',
  LIGHT: '#f3f4f6',
  
  // Dashboard specific
  CANE_DARK: '#0f172a',
  CANE_DARKER: '#020617',
  CANE_ACCENT: '#22c55e',
  CANE_WARNING: '#f59e0b',
  CANE_DANGER: '#ef4444'
} as const

// Chart configurations
export const CHART_CONFIG = {
  LINE: {
    STROKE_WIDTH: 2,
    POINT_RADIUS: 3,
    ANIMATION_DURATION: 300
  },
  BAR: {
    BORDER_WIDTH: 1,
    BORDER_RADIUS: 4
  },
  COLORS: {
    POSITIVE: '#22c55e',
    NEGATIVE: '#ef4444',
    NEUTRAL: '#6b7280',
    WARNING: '#f59e0b'
  }
} as const

// Validation rules
export const VALIDATION_RULES = {
  RQI: {
    MIN: 0,
    MAX: 100,
    REQUIRED: true
  },
  EQUIPMENT_LOAD: {
    MIN: 0,
    MAX: 100,
    REQUIRED: true
  },
  TEMPERATURE: {
    MIN: -50,
    MAX: 200,
    REQUIRED: false
  },
  VIBRATION: {
    MIN: 0,
    MAX: 10,
    REQUIRED: false
  },
  FEED_VARIABILITY: {
    MIN: 0,
    MAX: 20,
    REQUIRED: false
  }
} as const

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED'
} as const

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

// Service names
export const SERVICES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  AI_MODULE: 'ai-module',
  EDGE_SIMULATION: 'edge-simulation'
} as const

// Environment names
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production'
} as const

// Log levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
} as const

// Performance thresholds (in milliseconds)
export const PERFORMANCE_THRESHOLDS = {
  API_RESPONSE: 100,
  RQI_CALCULATION: 200,
  DASHBOARD_RENDER: 50,
  WEBSOCKET_LATENCY: 50
} as const

// File size limits
export const FILE_SIZE_LIMITS = {
  IMAGE_UPLOAD: 10 * 1024 * 1024, // 10MB
  LOG_FILE: 100 * 1024 * 1024,    // 100MB
  EXPORT_CSV: 5 * 1024 * 1024     // 5MB
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
} as const

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  SHORT: 60,      // 1 minute
  MEDIUM: 300,    // 5 minutes
  LONG: 3600,     // 1 hour
  DAILY: 86400    // 24 hours
} as const

// Rate limiting
export const RATE_LIMITS = {
  API_REQUESTS: 10,      // per second
  UPLOAD_REQUESTS: 2,    // per second
  WEBSOCKET_CONNECTIONS: 100 // per minute
} as const
