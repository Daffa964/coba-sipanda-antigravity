'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '@/actions/auth'

export default function UserMenu({ name, role }: { name: string, role: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white pl-4 pr-2 py-2 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition"
      >
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-800">{name}</p>
          <p className="text-xs text-teal-600 font-medium">{role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
           {name.charAt(0)}
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                    <p className="text-sm font-bold text-gray-800">{name}</p>
                    <p className="text-xs text-teal-600 font-medium">{role}</p>
                </div>
                <Link href="/profile" className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-teal-600 font-medium transition flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   Profil Saya
                </Link>
                <div className="h-px bg-gray-50 my-1"></div>
                <button 
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium transition flex items-center gap-2"
                >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                   Keluar
                </button>
            </div>
        </>
      )}
    </div>
  )
}
