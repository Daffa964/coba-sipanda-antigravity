"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts'
import { getGrowthReference, Gender, calculateZScore, getNutritionalStatus, getStuntingStatus } from '@/lib/zscore'

type Measurement = {
  id: string
  date: Date
  ageInMonths: number
  weight: number
  height: number
  zScoreBBU: string | null
  zScoreTBU: string | null
  zScoreBBTB: string | null
}

const CustomDot = (props: any) => {
  const { cx, cy, payload, type, gender } = props
  
  // Only render dots for actual measurements, not reference lines
  if (!payload.date) return null;

  // Calculate dynamic status for visual consistency
  let statusInfo = { color: '#94a3b8', status: 'Unknown' }
  
  if (type === 'weight') {
      const z = calculateZScore(payload.weight, payload.ageInMonths, gender, 'WAZ')
      statusInfo = getNutritionalStatus(z)
  } else {
      const z = calculateZScore(payload.height, payload.ageInMonths, gender, 'HAZ')
      statusInfo = getStuntingStatus(z)
  }
  
  // Map color class to hex
  const hexColor = statusInfo.color.includes('green') ? '#10b981' :
                   statusInfo.color.includes('orange') ? '#f59e0b' :
                   statusInfo.color.includes('yellow') ? '#eab308' :
                   statusInfo.color.includes('red') ? '#ef4444' : '#94a3b8'

  return (
    <circle cx={cx} cy={cy} r={6} fill={hexColor} stroke="white" strokeWidth={2} />
  )
}

const CustomTooltip = ({ active, payload, label, gender }: any) => {
  if (active && payload && payload.length) {
    // Find actual measurement data item (prioritize line data over range area)
    const measurement = payload.find((p: any) => 
      (p.dataKey === 'weight' || p.dataKey === 'height') && p.payload.date
    ) || payload.find((p: any) => p.payload.date)
    
    // If hovering over empty space or just reference area, might be different
    if (!measurement) return null
    
    const data = measurement.payload
    
    // Dynamic Calc
    let statusInfo = { color: '', status: '' }
    let unit = ''
    
    if (measurement.dataKey === 'weight') {
       const z = calculateZScore(data.weight, data.ageInMonths, gender, 'WAZ')
       statusInfo = getNutritionalStatus(z)
       unit = 'kg'
    } else {
       const z = calculateZScore(data.height, data.ageInMonths, gender, 'HAZ')
       statusInfo = getStuntingStatus(z)
       unit = 'cm'
    }

    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 z-50 relative">
        <p className="font-bold text-slate-800 mb-2">Usia {label} Bulan</p>
        <div className="space-y-2">
           <div className="flex flex-col">
             <span className="text-sm text-slate-500">Hasil Ukur:</span>
             <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-800">
                    {measurement.value} {unit}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ${statusInfo.color}`}>
                    {statusInfo.status}
                </span>
             </div>
           </div>
           
           {/* Show Reference Limits if available */}
           {data.upperLimit && (
             <div className="text-xs text-slate-400 border-t border-slate-100 pt-1 mt-1">
               Batas Aman: {data.lowerLimit} - {data.upperLimit} {unit}
             </div>
           )}
        </div>
        <p className="text-xs text-slate-400 mt-2">{data.dateStr}</p>
      </div>
    )
  }
  return null
}

export function GrowthChart({ measurements, gender }: { measurements: Measurement[], gender: Gender }) {
  
  // 1. Get Reference Data
  const wazRef = getGrowthReference(gender, 'WAZ')
  const hazRef = getGrowthReference(gender, 'HAZ')

  // 2. Merge Data
  // Create a map of age -> reference data
  const wazMap = new Map(wazRef.map(r => [r.ageInMonths, r]))
  const hazMap = new Map(hazRef.map(r => [r.ageInMonths, r]))

  const allAges = new Set([
      ...measurements.map(m => m.ageInMonths), 
      ...wazRef.map(r => r.ageInMonths)
  ])
  
  const measurementsMap = new Map(measurements.map(m => [m.ageInMonths, m]))

  // ComposedChart can handle data with missing keys.
  // We construct data array covering the max age of the child + some buffer.
  const maxAge = Math.max(...measurements.map(m => m.ageInMonths), 24) // Min 2 yr view
  
  const chartData = []
  
  // Simple Linear Interpolator
  const interpolate = (age: number, refs: any[]) => {
      const upperIdx = refs.findIndex(r => r.ageInMonths >= age)
      if (upperIdx === -1) return refs[refs.length-1]
      if (upperIdx === 0) return refs[0]
      
      const lower = refs[upperIdx - 1]
      const upper = refs[upperIdx]
      const progress = (age - lower.ageInMonths) / (upper.ageInMonths - lower.ageInMonths)
      
      return {
          upperLimit: lower.upperLimit + (upper.upperLimit - lower.upperLimit) * progress,
          lowerLimit: lower.lowerLimit + (upper.lowerLimit - lower.lowerLimit) * progress,
      }
  }

  for (let i = 0; i <= maxAge + 5; i++) {
     const mData = measurementsMap.get(i)
     
     // Interpolate references
     const wRef = interpolate(i, wazRef)
     const hRef = interpolate(i, hazRef)

     chartData.push({
         ageInMonths: i,
         // Measurement Data (if exists)
         ...mData,
         dateStr: mData ? new Date(mData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '',
         // Reference Data (Range)
         wazRange: [parseFloat(wRef.lowerLimit.toFixed(2)), parseFloat(wRef.upperLimit.toFixed(2))],
         hazRange: [parseFloat(hRef.lowerLimit.toFixed(2)), parseFloat(hRef.upperLimit.toFixed(2))],
     })
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 mb-8">
      {/* Weight Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-teal-600 shadow-sm"></div>
            Grafik Berat Badan
            </h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Batas Aman: Area Hijau Muda (-2SD s/d +2SD)</p>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="ageInMonths" stroke="#64748b" label={{ value: 'Usia (Bulan)', position: 'insideBottom', offset: -5 }} />
              <YAxis stroke="#64748b" width={30} />
              <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} content={<CustomTooltip gender={gender} />} />
              
              <Area 
                type="monotone" 
                dataKey="wazRange" 
                stroke="#86efac" 
                strokeDasharray="3 3"
                fill="#dcfce7" 
                fillOpacity={0.6} 
                activeDot={false} 
                legendType="none"
                tooltipType="none"
                name="Area Normal"
              />

              <Line 
                type="monotone" 
                dataKey="weight" 
                name="Berat Badan" 
                stroke="#0d9488" 
                strokeWidth={3}
                dot={<CustomDot type="weight" gender={gender} />}
                activeDot={{ r: 6 }}
                connectNulls 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Height Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600 shadow-sm"></div>
            Grafik Tinggi Badan
            </h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Batas Aman: Area Hijau Muda (-2SD s/d +2SD)</p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="ageInMonths" stroke="#64748b" label={{ value: 'Usia (Bulan)', position: 'insideBottom', offset: -5 }} />
              <YAxis stroke="#64748b" width={30} />
              <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} content={<CustomTooltip gender={gender} />} />
              
              <Area 
                type="monotone" 
                dataKey="hazRange" 
                stroke="#86efac" 
                strokeDasharray="3 3"
                fill="#dcfce7" 
                fillOpacity={0.6} 
                activeDot={false} 
                legendType="none"
                tooltipType="none"
                name="Area Normal"
              />

              <Line 
                type="monotone" 
                dataKey="height" 
                name="Tinggi Badan" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={<CustomDot type="height" gender={gender} />}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
