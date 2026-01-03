'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  href?: string
  className?: string
  label?: string
}

export default function BackButton({ href, className = "", label = "Kembali" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-600 bg-white rounded-xl border border-stone-200 shadow-sm hover:bg-stone-50 hover:text-teal-600 transition-all active:scale-95 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </button>
  )
}
