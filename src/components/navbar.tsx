'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserMenu from './user-menu'

interface NavbarProps {
  user: {
    name: string
    role: string
    posyanduId?: string | null
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const isKader = user?.role === 'KADER'
  
  // Define links based on role
  const links = isKader 
    ? [
        { href: `/posyandu/${user?.posyanduId}`, label: 'Dashboard', icon: 'dashboard' },
        { href: `/posyandu/${user?.posyanduId}/anak`, label: 'Data Anak', icon: 'child_care' },
        { href: `/posyandu/${user?.posyanduId}/laporan`, label: 'Laporan', icon: 'description' },
        // { href: `/posyandu/${user?.posyanduId}/settings`, label: 'Pengaturan', icon: 'settings' }, // Optional
      ]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { href: '/dashboard/anak', label: 'Data Anak', icon: 'child_care' },
        { href: '/dashboard/laporan', label: 'Laporan', icon: 'description' },
      ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#dce5df] shadow-sm">
        <div className="px-4 md:px-8 py-3 flex items-center justify-between max-w-[1440px] mx-auto w-full">
            {/* Logo area */}
            <div className="flex items-center gap-3 text-[#111714]">
                <div className="size-10 rounded-xl bg-[#20df6c]/20 flex items-center justify-center text-[#20df6c]">
                  <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                </div>
                <div className="flex flex-col">
                   <h2 className="text-lg font-black leading-none tracking-tight">SI-PANDA</h2>
                   <p className="text-[11px] font-bold text-[#648772] uppercase tracking-wider mt-0.5">Desa Kramat</p>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-[#f6f8f7] p-1.5 rounded-xl border border-[#dce5df]">
                {links.map((link) => {
                   const isExactMatch = pathname === link.href
                   const isSubPath = pathname.startsWith(link.href) && pathname[link.href.length] === '/'
                   
                   // Dashboard should only be active on exact match
                   // Other links (like Data Anak) should be active on exact match OR subpath (e.g. /new, /[id])
                   const isActive = link.label === 'Dashboard' ? isExactMatch : (isExactMatch || isSubPath)
                   
                   return (
                     <Link 
                       key={link.href}
                       href={link.href}
                       className={`
                         flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
                         ${isActive 
                            ? 'bg-white text-[#20df6c] shadow-sm' 
                            : 'text-[#648772] hover:text-[#111714] hover:bg-white/50'
                         }
                       `}
                     >
                       <span className={`material-symbols-outlined text-[20px] ${isActive ? 'filled' : ''}`}>{link.icon}</span>
                       {link.label}
                     </Link>
                   )
                })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
               <UserMenu name={user?.name || 'User'} role={user?.role === 'KADER' ? 'Kader Posyandu' : 'Bidan Desa'} />
            </div>
        </div>
    </header>
  )
}
