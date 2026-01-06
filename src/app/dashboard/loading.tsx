export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 font-display pb-20">
      {/* Navbar Skeleton */}
      <div className="bg-white border-b border-gray-100 h-16 animate-pulse" />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse mt-2" />
          </div>
          <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded mt-2" />
            </div>
          ))}
        </div>

        {/* Chart & Kader Section Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-64 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-20 h-4 bg-gray-200 rounded" />
                  <div className="flex-1 h-8 bg-gray-200 rounded" />
                  <div className="w-8 h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50">
                <div className="w-8 h-4 bg-gray-200 rounded" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-4 bg-gray-200 rounded" />
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
