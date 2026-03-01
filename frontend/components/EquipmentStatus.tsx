import { EquipmentMetrics } from '../types'

interface EquipmentStatusProps {
  data: EquipmentMetrics
}

export default function EquipmentStatus({ data }: EquipmentStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-cane-accent'
      case 'warning': return 'text-cane-warning'
      case 'critical': return 'text-cane-danger'
      default: return 'text-gray-400'
    }
  }

  const getLoadColor = (load: number) => {
    if (load >= 80) return 'text-cane-danger'
    if (load >= 60) return 'text-cane-warning'
    return 'text-cane-accent'
  }

  return (
    <div className="bg-cane-dark rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Machine Load Status</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Status</span>
          <span className={`font-medium ${getStatusColor(data.status)}`}>
            {data.status.toUpperCase()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Load</span>
          <span className={`font-bold text-lg ${getLoadColor(data.load)}`}>
            {data.load.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Temperature</span>
          <span className="text-white font-medium">
            {data.temperature.toFixed(1)}°C
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Vibration</span>
          <span className="text-white font-medium">
            {data.vibration.toFixed(2)} mm/s
          </span>
        </div>
        
        <div className="mt-6">
          <div className="text-sm text-gray-400 mb-2">Load Indicator</div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                data.load >= 80 ? 'bg-cane-danger' :
                data.load >= 60 ? 'bg-cane-warning' : 'bg-cane-accent'
              }`}
              style={{ width: `${data.load}%` }}
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
