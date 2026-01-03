import { getWorstStatus } from "@/lib/recommendations";

interface ParentRecommendationProps {
  statuses: string[];
}

export default function ParentRecommendation({ statuses }: ParentRecommendationProps) {
  const rec = getWorstStatus(statuses);

  return (
    <div className={`rounded-2xl p-6 border ${rec.color} space-y-4`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold opacity-70 uppercase tracking-wider mb-1">Rekomendasi Orang Tua</h3>
          <h2 className="text-xl font-bold">{rec.title}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border bg-white ${rec.color.split(' ')[1]}`}>
          {rec.status}
        </span>
      </div>

      <div className="space-y-4 pt-2">
        {/* Food */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            🥗 Rekomendasi Makanan
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-sm opacity-90">
            {rec.food.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Activity */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            🏃 Aktivitas & Perawatan
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-sm opacity-90">
            {rec.activity.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Medical (Optional) */}
        {rec.medical && (
          <div className="bg-white/50 p-3 rounded-lg border border-current text-sm font-bold flex items-start gap-2">
            🚨 <span>{rec.medical}</span>
          </div>
        )}
      </div>
    </div>
  );
}
