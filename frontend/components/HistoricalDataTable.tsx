import { RQIData } from '../types'

interface HistoricalDataTableProps {
  data: RQIData[]
}

export default function HistoricalDataTable({ data }: HistoricalDataTableProps) {
  return (
    <div className="bg-cane-dark rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Historical Data</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Timestamp</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">RQI Value</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Feed Variability</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Calibrated</th>
            </tr>
          </thead>
          <tbody>
            {data.slice().reverse().map((item) => (
              <tr key={item.id} className="border-b border-gray-800 hover:bg-cane-darker">
                <td className="py-3 px-4 text-gray-300">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className={`font-medium ${
                    item.value >= 80 ? 'text-cane-accent' :
                    item.value >= 60 ? 'text-cane-warning' : 'text-cane-danger'
                  }`}>
                    {item.value.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.value >= 80 ? 'bg-green-900/20 text-cane-accent' :
                    item.value >= 60 ? 'bg-yellow-900/20 text-cane-warning' : 'bg-red-900/20 text-cane-danger'
                  }`}>
                    {item.value >= 80 ? 'Excellent' : item.value >= 60 ? 'Good' : 'Needs Attention'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {item.feedVariability.toFixed(1)}%
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.calibrated 
                      ? 'bg-green-900/20 text-cane-accent' 
                      : 'bg-yellow-900/20 text-cane-warning'
                  }`}>
                    {item.calibrated ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        Showing last {data.length} records
      </div>
    </div>
  )
}
