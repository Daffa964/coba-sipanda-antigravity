'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/actions/auth'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 font-sans relative overflow-hidden">
      {/* Soft Background Blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-100/60 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-yellow-100/60 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>

      <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[420px] relative z-10 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 mb-6 font-bold text-sm transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.632 8.632a.75.75 0 11-1.06 1.06l-.532-.532V18a3 3 0 01-3 3h-5a3 3 0 01-3-3v-5a3 3 0 013-3h2v5a1 1 0 001 1h2a1 1 0 001-1v-8.5l-.532.532a.75.75 0 11-1.06-1.06l-8.632-8.632z" />
             </svg>
             Kembali ke Beranda
          </Link>
          <h1 className="text-2xl font-black text-stone-800 tracking-tight">Selamat Datang</h1>
          <p className="text-stone-500 font-medium mt-2">Masuk untuk mengelola data posyandu</p>
        </div>

        {state?.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 border border-red-100 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 border-transparent text-stone-800 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-teal-200 transition-all duration-300 font-medium"
              placeholder="nama@posyandu.desa.id"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 border-transparent text-stone-800 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-teal-200 transition-all duration-300 font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 px-6 mt-4 bg-teal-500 text-white font-bold rounded-2xl hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] transition-all transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                </span>
            ) : 'Masuk Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-stone-400 font-medium">
               &copy; 2025 Desa Kramat. Melayani dengan Hati.
            </p>
        </div>
      </div>
    </div>
  )
}
