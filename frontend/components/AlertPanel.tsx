import { AnomalyAlert } from '../types'

interface AlertPanelProps {
  alerts: AnomalyAlert[]
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-cane-danger bg-red-900/20 border-red-800'
      case 'medium': return 'text-cane-warning bg-yellow-900/20 border-yellow-800'
      case 'low': return 'text-cane-accent bg-green-900/20 border-green-800'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rqi_drop': return '📉'
      case 'equipment_failure': return '⚠️'
      case 'quality_variance': return '🔄'
      default: return 'ℹ️'
    }
  }

  return (
    <div className="bg-cane-dark rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Anomaly Alerts</h2>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-2xl mb-2">✅</div>
          <div>No active alerts</div>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} ${
                alert.resolved ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-xl">{getTypeIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      {alert.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  {alert.resolved && (
                    <span className="text-xs text-cane-accent">RESOLVED</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        {alerts.filter(a => !a.resolved).length} active alerts
      </div>
    </div>
  )
}
