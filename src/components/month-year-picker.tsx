'use client'

import { useState } from 'react'

interface MonthYearPickerProps {
  selectedMonth: number
  selectedYear: number
  onChange: (month: number, year: number) => void
}

export default function MonthYearPicker({ selectedMonth, selectedYear, onChange }: MonthYearPickerProps) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="flex items-center gap-2">
      <select 
        value={selectedMonth}
        onChange={(e) => onChange(Number(e.target.value), selectedYear)}
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {months.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => onChange(selectedMonth, Number(e.target.value))}
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}
