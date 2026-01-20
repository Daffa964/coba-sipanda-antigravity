
export default function ReportTable({ measurements }: { measurements: any[] }) {
  if (!measurements || measurements.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">Tidak ada data pengukuran untuk periode ini.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Nama Anak</th>
            <th className="px-4 py-3">Posyandu</th>
            <th className="px-4 py-3">Tanggal Ukur</th>
            <th className="px-4 py-3">BB (kg)</th>
            <th className="px-4 py-3">TB (cm)</th>
            <th className="px-4 py-3">BB/U</th>
            <th className="px-4 py-3">TB/U</th>
            <th className="px-4 py-3">BB/TB</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {measurements.map((m, index) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{index + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{m.anak?.name}</td>
              <td className="px-4 py-3 text-gray-500">{m.anak?.posyandu?.name}</td>
              <td className="px-4 py-3 text-gray-500">{new Date(m.date).toLocaleDateString('id-ID')}</td>
              <td className="px-4 py-3">{m.weight}</td>
              <td className="px-4 py-3">{m.height}</td>
              <td className="px-4 py-3">
                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                   m.zScoreBBU === 'Normal' 
                     ? 'bg-green-100 text-green-700' 
                     : m.zScoreBBU?.includes('Sangat') 
                       ? 'bg-red-100 text-red-700'
                       : 'bg-orange-100 text-orange-700'
                 }`}>
                    {m.zScoreBBU}
                 </span>
              </td>
              <td className="px-4 py-3">
                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                   m.zScoreTBU === 'Normal' 
                     ? 'bg-green-100 text-green-700' 
                     : m.zScoreTBU?.includes('Sangat') 
                       ? 'bg-red-100 text-red-700'
                       : 'bg-red-50 text-red-600'
                 }`}>
                    {m.zScoreTBU}
                 </span>
              </td>
              <td className="px-4 py-3">
                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                   m.zScoreBBTB === 'Gizi Baik' || m.zScoreBBTB === 'Normal'
                     ? 'bg-emerald-100 text-emerald-700' 
                     : m.zScoreBBTB?.includes('Buruk') || m.zScoreBBTB?.includes('Obesitas')
                       ? 'bg-red-100 text-red-700'
                       : 'bg-amber-100 text-amber-700'
                 }`}>
                    {m.zScoreBBTB}
                 </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
