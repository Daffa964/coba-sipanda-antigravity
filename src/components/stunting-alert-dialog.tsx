'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StuntingChild {
  id: string
  name: string
  parentName: string
  posyanduName: string
  age: number
}

interface StuntingAlertDialogProps {
  stuntingCount: number
  stuntingChildren: StuntingChild[]
}

export default function StuntingAlertDialog({ 
  stuntingCount, 
  stuntingChildren 
}: StuntingAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showList, setShowList] = useState(false)

  // Auto-open popup if there are stunting children
  useEffect(() => {
    if (stuntingCount > 0) {
      // Small delay to allow the page to render first
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [stuntingCount])

  if (!isOpen || stuntingCount === 0) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto animate-slideUp overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Peringatan Stunting!</h2>
                <p className="text-red-100 mt-1">Perlu perhatian segera</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-16 rounded-2xl bg-red-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-red-600">{stuntingCount}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Anak Terindikasi Stunting
                </p>
                <p className="text-sm text-gray-500">
                  Memerlukan intervensi dan pemantauan khusus
                </p>
              </div>
            </div>

            {/* Toggle List Button */}
            {!showList ? (
              <button
                onClick={() => setShowList(true)}
                className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">visibility</span>
                Lihat Daftar Anak Stunting
              </button>
            ) : (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Daftar Anak Stunting</h3>
                  <button
                    onClick={() => setShowList(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Sembunyikan
                  </button>
                </div>
                
                {/* List of stunting children */}
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl">
                  {stuntingChildren.length > 0 ? (
                    stuntingChildren.map((child, index) => (
                      <Link
                        key={child.id}
                        href={`/dashboard/anak/${child.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                      >
                        <div className="size-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{child.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {child.posyanduName} • {child.age} bulan
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Data anak tidak tersedia
                    </div>
                  )}
                </div>

                {stuntingChildren.length > 0 && (
                  <Link
                    href="/dashboard/anak?status=stunting"
                    className="mt-3 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Lihat Semua di Halaman Data Anak
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
