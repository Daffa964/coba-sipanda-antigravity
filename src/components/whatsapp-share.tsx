'use client'

export default function WhatsAppShare({ name, status, linkId }: { name: string, status: string, linkId: string }) {
  
  function handleShare() {
    const origin = window.location.origin
    const url = `${origin}/public/anak/${linkId}`
    const text = `Halo Ibu/Wali dari *${name}*,\n\nBerikut adalah laporan terkini dari SI-PANDA Posyandu Desa Kramat:\n\nNama: ${name}\nStatus Gizi Terakhir: *${status}*\n\nLihat detail kartu digital disini:\n${url}\n\nTerima kasih.`
    
    // Open WA
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <button onClick={handleShare} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold transition shadow-lg shadow-green-200 cursor-pointer">
       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.683-2.031-9.672-.272-.099-.47-.149-.669-.149-.198 0-.42.001-.643.001-.223 0-.583.084-.89.421-.307.337-1.178 1.152-1.178 2.809 0 1.657 1.207 3.259 1.378 3.487.173.227 2.375 3.628 5.756 5.087.804.347 1.432.553 1.93.711.831.264 1.588.227 2.184.137.669-.1 2.055-.841 2.352-1.653.297-.812.297-1.509.208-1.653z"/></svg>
       Kirim Laporan WA
    </button>
  )
}
