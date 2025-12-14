import { getNutritionalStatus } from '@/lib/zscore'

type Measurement = {
  id: string
  date: Date
  weight: number
  height: number
  ageInMonths: number
  zScoreBBU: string | null
  zScoreTBU: string | null
  zScoreBBTB: string | null
}

export default function MeasurementHistory({ data }: { data: Measurement[] }) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        Belum ada riwayat pengukuran.
      </div>
    )
  }

  function getStatusColor(status: string | null) {
     if (!status) return 'bg-gray-100 text-gray-500 border-gray-200'
     const normalized = status.toLowerCase()
     if (normalized.includes('buruk') || normalized.includes('sangat') || normalized.includes('obesitas')) return 'bg-red-100 text-red-700 border-red-200'
     if (normalized.includes('kurang') || normalized.includes('stunting') || normalized.includes('pendek') || normalized.includes('lebih')) return 'bg-orange-100 text-orange-700 border-orange-200'
     return 'bg-green-100 text-green-700 border-green-200'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 font-semibold text-gray-600 border-b border-gray-200">
            <tr>
              <th className="p-4 whitespace-nowrap">Tanggal</th>
              <th className="p-4">Umur</th>
              <th className="p-4">Berat</th>
              <th className="p-4">Tinggi</th>
              <th className="p-4 whitespace-nowrap">Status (BB/U)</th>
              <th className="p-4 whitespace-nowrap">Status (TB/U)</th>
              <th className="p-4 whitespace-nowrap">Status (BB/TB)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition">
                <td className="p-4 text-gray-900 whitespace-nowrap">{new Date(m.date).toLocaleDateString('id-ID')}</td>
                <td className="p-4 text-gray-500 whitespace-nowrap">{m.ageInMonths} bln</td>
                <td className="p-4 font-medium text-gray-900">{m.weight} kg</td>
                <td className="p-4 font-medium text-gray-900">{m.height} cm</td>
                <td className="p-4">
                  {m.zScoreBBU ? (
                   <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold border whitespace-nowrap ${getStatusColor(m.zScoreBBU)}`}>
                      {m.zScoreBBU}
                   </span>
                  ) : <span className="text-gray-300">-</span>}
                </td>
                <td className="p-4">
                  {m.zScoreTBU ? (
                   <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold border whitespace-nowrap ${getStatusColor(m.zScoreTBU)}`}>
                      {m.zScoreTBU}
                   </span>
                  ) : <span className="text-gray-300">-</span>}
                </td>
                <td className="p-4">
                   {m.zScoreBBTB ? (
                   <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold border whitespace-nowrap ${getStatusColor(m.zScoreBBTB)}`}>
                      {m.zScoreBBTB}
                   </span>
                   ) : <span className="text-gray-300">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
