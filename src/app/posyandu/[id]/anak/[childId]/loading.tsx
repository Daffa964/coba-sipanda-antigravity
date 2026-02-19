export default function ChildDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-pulse">
       {/* Navbar Spacer */}
       <div className="h-16 bg-white border-b border-gray-100"></div>

       {/* Header Skeleton */}
       <div className="bg-white border-b border-gray-200 py-6 px-8 mb-8">
         <div className="max-w-6xl mx-auto">
           <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                 <div>
                    <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
                    <div className="flex items-center gap-3">
                       <div className="h-5 w-24 bg-gray-200 rounded"></div>
                       <div className="h-5 w-4 bg-gray-200 rounded"></div>
                       <div className="h-5 w-20 bg-gray-200 rounded"></div>
                       <div className="h-5 w-4 bg-gray-200 rounded"></div>
                       <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    </div>
                 </div>
              </div>
              <div className="h-8 w-40 bg-gray-200 rounded-xl"></div>
           </div>
         </div>
       </div>

       <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left: Input & Tools Skeleton */}
             <div className="lg:col-span-1 space-y-8">
                {/* Measurement Form Skeleton */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64"></div>
                
                {/* Share/QR Skeleton */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-48"></div>

                {/* Recommendation Skeleton */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-40"></div>
             </div>

             {/* Right: History Skeleton */}
             <div className="lg:col-span-2 space-y-6">
                <div className="h-8 w-64 bg-gray-200 rounded"></div>
                
                {/* Chart Skeleton */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80"></div>
                
                {/* History Table Skeleton */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-4 border-b border-gray-100 flex gap-4">
                      <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
                      <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
                      <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
                      <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
                   </div>
                   <div className="p-4 space-y-4">
                      <div className="h-12 w-full bg-gray-200 rounded"></div>
                      <div className="h-12 w-full bg-gray-200 rounded"></div>
                      <div className="h-12 w-full bg-gray-200 rounded"></div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}
