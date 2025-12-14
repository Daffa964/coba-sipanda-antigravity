import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans overflow-x-hidden selection:bg-teal-200 selection:text-teal-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-[#FDFBF7]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-teal-100 text-teal-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-stone-800">
              SI-PANDA
            </span>
          </div>
          <nav className="flex gap-6 sm:gap-8">
            <Link className="text-sm font-bold text-stone-500 hover:text-teal-600 transition-colors" href="#features">
              Fitur
            </Link>
            <Link className="text-sm font-bold text-stone-500 hover:text-teal-600 transition-colors" href="#contact">
              Kontak
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 relative">
           {/* Soft Blobs Background */}
           <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-yellow-100/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
             <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-teal-100/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
             <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-orange-100/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
           </div>
          
          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-teal-100 bg-white px-4 py-1.5 text-sm font-bold text-teal-600 shadow-sm mb-2 hover:bg-teal-50 transition-colors cursor-default">
                 <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                 Sistem Informasi Pemantau Gizi Anak Desa
              </div>
              
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl text-stone-800 max-w-4xl">
                Tumbuh Kembang <br/>
                <span className="text-teal-500 relative whitespace-nowrap">
                  Anak Sehat
                  <svg className="absolute -bottom-2 w-full h-3 text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
                , Masa Depan Kuat
              </h1>
              
              <p className="mx-auto max-w-[700px] text-stone-500 md:text-xl font-medium leading-relaxed">
                Pantau kesehatan si buah hati dengan data yang akurat. Mari bersama cegah stunting demi generasi Indonesia Emas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                <Link
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-teal-500 px-8 text-base font-bold text-white shadow-lg shadow-teal-500/30 transition-all hover:bg-teal-600 hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30 ring-offset-2 ring-offset-[#FDFBF7]"
                  href="/login"
                >
                  Masuk Sebagai Petugas
                </Link>
                <Link
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-stone-200 bg-white px-8 text-base font-bold text-stone-600 shadow-sm transition-all hover:border-teal-200 hover:text-teal-600 hover:bg-teal-50/50 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-200"
                  href="#scan"
                >
                  Scan QR Orang Tua
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative z-10 border-t border-stone-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-stone-800 mb-4">Fitur Sahabat Keluarga</h2>
              <p className="max-w-[600px] mx-auto text-stone-500 text-lg">
                Teknologi yang dirancang dengan kasih sayang untuk mempermudah pemantauan gizi.
              </p>
            </div>
            
            <div className="grid max-w-6xl mx-auto gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative bg-[#FDFBF7] p-8 rounded-[2rem] border border-stone-100 transition-all hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1">
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">Pencatatan Digital</h3>
                <p className="text-stone-500 leading-relaxed">
                  Data posyandu tersimpan dengan rapi dan aman. Ucapkan selamat tinggal pada tumpukan kertas yang membingungkan.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative bg-[#FDFBF7] p-8 rounded-[2rem] border border-stone-100 transition-all hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">Analisis Pintar</h3>
                <p className="text-stone-500 leading-relaxed">
                  Kalkulasi status gizi otomatis standar WHO. Deteksi dini stunting dan gizi buruk secara real-time.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative bg-[#FDFBF7] p-8 rounded-[2rem] border border-stone-100 transition-all hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1">
                 <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4h-4v-4H8m13-4V4a1 1 0 00-1-1h-3.75a1 1 0 00-.829.44l-1.436 2.126 1.094 3.281 2.38-2.38M10 20l4-16m2 16l4 16M6 9h14M4 20h14" /></svg>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">Akses Mudah</h3>
                <p className="text-stone-500 leading-relaxed">
                  Orang tua dapat memantau grafik pertumbuhan anak kapan saja hanya dengan scan QR Code.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full py-10 bg-white border-t border-stone-100">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                <span className="font-bold text-lg">P</span>
             </div>
             <p className="text-sm font-semibold text-stone-400">
               © 2025 SI-PANDA Desa Kramat
             </p>
          </div>
          <nav className="flex gap-6">
            <Link className="text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors" href="#">
              Privasi
            </Link>
            <Link className="text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors" href="#">
              Syarat & Ketentuan
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
