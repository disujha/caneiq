import { RQIData, CalibrationData } from '../types'

interface RQICardProps {
  data: RQIData
  lastCalibration?: CalibrationData
}

export default function RQICard({ data, lastCalibration }: RQICardProps) {
  const getRQIColor = (value: number) => {
    if (value >= 80) return 'text-cane-accent'
    if (value >= 60) return 'text-yellow-400'
    return 'text-cane-danger'
  }

  const getRQIStatus = (value: number) => {
    if (value >= 80) return 'Excellent'
    if (value >= 60) return 'Good'
    return 'Needs Attention'
  }

  return (
    <div className="bg-cane-dark rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Relative Quality Index</h2>
      
      <div className="text-center">
        <div className={`text-5xl font-bold ${getRQIColor(data.value)} mb-2`}>
          {data.value.toFixed(1)}
        </div>
        <div className="text-gray-400 text-sm mb-4">
          Status: {getRQIStatus(data.value)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Calibrated</div>
            <div className={`font-medium ${data.calibrated ? 'text-cane-accent' : 'text-cane-warning'}`}>
              {data.calibrated ? 'Yes' : 'No'}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Feed Variability</div>
            <div className="text-white font-medium">
              {data.feedVariability.toFixed(1)}%
            </div>
          </div>
        </div>
        
        {/* Calibration Info */}
        {lastCalibration && (
          <div className="mt-4 text-xs text-cane-accent border-t border-gray-700 pt-3">
            <div>Calibrated against Lab POL</div>
            <div>Last Sync: {new Date(lastCalibration.timestamp).toLocaleString()}</div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
