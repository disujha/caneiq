'use client'

import { useEffect, useRef } from 'react'

interface FeedVariabilityChartProps {
  data: { timestamp: number; value: number }[]
}

export default function FeedVariabilityChart({ data }: FeedVariabilityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Draw axes
    ctx.strokeStyle = '#4b5563'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    if (data.length === 0) return

    // Calculate scales
    const maxValue = Math.max(...data.map(d => d.value))
    const minValue = Math.min(...data.map(d => d.value))
    const valueRange = maxValue - minValue || 1

    // Draw grid lines
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw data line
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = canvas.height - padding - ((point.value - minValue) / valueRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw data points
    ctx.fillStyle = '#22c55e'
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = canvas.height - padding - ((point.value - minValue) / valueRange) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = '#9ca3af'
    ctx.font = '12px monospace'
    ctx.fillText('Feed Variability %', padding, padding - 10)
    ctx.fillText('Time', canvas.width - padding + 10, canvas.height - padding)

  }, [data])

  return (
    <div className="bg-cane-dark rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Feed Variability Trend</h2>
      <canvas
        ref={canvasRef}
        className="w-full h-64 bg-cane-darker rounded"
      />
      <div className="mt-4 text-sm text-gray-400">
        Real-time feed variability monitoring over the last 20 data points
      </div>
    </div>
  )
}
