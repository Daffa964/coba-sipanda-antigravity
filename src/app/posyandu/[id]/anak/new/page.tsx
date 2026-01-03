import AnakForm from '@/components/anak-form'
import Link from 'next/link'

export default async function NewAnakPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-teal-50/50">
                <h1 className="text-xl font-bold text-gray-900">Input Data Anak & Pengukuran</h1>
                <Link href={`/posyandu/${id}`} className="text-sm font-medium text-gray-500 hover:text-gray-900">
                    Batal
                </Link>
            </div>
            <div className="p-6">
                 <AnakForm defaultPosyanduId={id} />
            </div>
        </div>
    </div>
  )
}
