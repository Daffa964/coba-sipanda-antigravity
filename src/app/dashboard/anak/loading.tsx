export default function AnakLoading() {
  return (
    <div className="min-h-screen bg-gray-50 font-display pb-20">
      {/* Navbar Skeleton */}
      <div className="bg-white border-b border-gray-100 h-16 animate-pulse" />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse mt-2" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Search & Filter Skeleton */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-40 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-100">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          
          {/* Table Rows */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-50 animate-pulse">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  )
}
