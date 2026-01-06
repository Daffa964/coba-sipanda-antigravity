export default function PosyanduLoading() {
  return (
    <div className="min-h-screen bg-gray-50 font-display pb-20">
      {/* Sidebar Skeleton */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 p-6 animate-pulse hidden lg:block">
        <div className="h-8 w-32 bg-gray-200 rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="lg:ml-64 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse mt-2" />
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
              </div>
              <div className="h-8 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded mt-1" />
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
