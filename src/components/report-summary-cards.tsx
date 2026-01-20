export default function ReportSummaryCards({ stats }: { stats: any }) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Measured */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Anak Diukur</div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalChildrenMeasured}</div>
        <div className="text-xs text-gray-400 mt-1">Dari {stats.totalMeasurements} pengukuran</div>
      </div>

      {/* Stunting */}
      <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
        <div className="text-red-500 text-xs font-semibold uppercase tracking-wider mb-1">Stunting</div>
        <div className="text-2xl font-bold text-red-700">{stats.stuntingCount}</div>
        <div className="text-xs text-red-400 mt-1">
          {stats.totalChildrenMeasured > 0 
            ? Math.round((stats.stuntingCount / stats.totalChildrenMeasured) * 100) 
            : 0}% prevalensi
        </div>
      </div>

      {/* Wasting (BB/TB) */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
        <div className="text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">Wasting (BB/TB)</div>
        <div className="text-2xl font-bold text-amber-700">{stats.wastingCount}</div>
        <div className="text-xs text-amber-500 mt-1">
          Kurus untuk tingginya
        </div>
      </div>

      {/* Underweight (BB/U) */}
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 shadow-sm">
        <div className="text-orange-600 text-xs font-semibold uppercase tracking-wider mb-1">Underweight (BB/U)</div>
        <div className="text-2xl font-bold text-orange-700">{stats.underweightCount}</div>
        <div className="text-xs text-orange-500 mt-1">
          Kurang berat untuk umur
        </div>
      </div>
    </div>
  )
}
