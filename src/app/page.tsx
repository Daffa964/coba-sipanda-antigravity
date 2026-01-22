import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden font-display bg-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 pb-2 md:pb-0">
        <div className="flex justify-center w-full">
          <div className="flex max-w-[1280px] flex-1 items-center justify-between px-4 py-3 md:px-10">
            <Link href="#home" className="flex items-center gap-2 text-text-main group cursor-pointer">
              <div className="text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">child_care</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">SI-PANDA</h2>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <Link className="text-sm font-medium hover:text-primary transition-colors text-text-main" href="#home">Beranda</Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors text-text-main" href="#features">Keunggulan</Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors text-text-main" href="#contact">Kontak</Link>
              </nav>
              <Link href="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-primary-dark transition-colors text-text-main text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Masuk</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center w-full scroll-smooth">
        {/* Hero Section */}
        <section id="home" className="w-full max-w-[1280px] px-4 md:px-10 py-12 md:py-20 scroll-mt-24">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text Content */}
            <div className="flex flex-col gap-6 flex-1 text-left items-start">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-xs font-bold uppercase tracking-wider w-fit">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Desa Kramat Sehat
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em] text-text-main">
                  Pantau Tumbuh Kembang <span className="text-primary">Anak</span> Desa Kramat
                </h1>
                <p className="text-base md:text-lg text-text-secondary font-normal leading-relaxed max-w-xl">
                  Sistem Informasi Pemantau Gizi Anak Desa (SI-PANDA). Solusi digital untuk pencatatan gizi, pencegahan stunting, dan pemantauan kesehatan generasi masa depan kita.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                <Link href="/login" className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-primary-dark text-text-main text-base font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20">
                  <span>Masuk ke Sistem</span>
                  <span className="material-symbols-outlined ml-2 text-sm font-bold">login</span>
                </Link>
                <Link href="#features" className="flex items-center justify-center h-12 px-8 rounded-lg border border-[#dce5df] bg-white hover:bg-gray-50 text-text-main text-base font-bold transition-all">
                  <span>Pelajari Lebih Lanjut</span>
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-text-secondary">
                <div className="flex -space-x-3">
                   {/* Avatars */}
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvQeOT2odrCjS1XMy25tuctDyTokxd9OBtuRzvw5-xkO9cZU3r_kn6MdCWbRhRPutyKMgiohmLAcr3sUaPaQnf9E9NJ_YIaY2w3zI99pbqssMNGqRYlAJyhLULyTYY0CCPWyf8K4-xJ8VJQ55snGIREVU0vMPB3f-YC0J6b1A7lYL4lKDOUPqWGClNbAWjUroEeFj4Ph0-FfQnX25iyNSRTdlFod8U9P7_otQ49tgdc07euJTr4tkyrrxO4GH49qKyDKijNU1dPfY" alt="User 1" className="w-full h-full object-cover"/>
                   </div>
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZb0pIwHq3OWWO-md9oQst189Aszic6Zm93LPR38aVn3E6SuxLHDt_imwXg6VKDaFWJ8EUM5x_zn491OpsQAx-HOH3jRdJiFJS6kH7VwWLHVj_QgiO5fCePVnyn9MlPxzZ4oFkuJM5WWeZk3nTEpoWqE29ilAO-Cx9-ksWLYoJSCfwX-5omKrwpbp05BpGhIjufBi7f5QB5C-ABk7cKfQfjRF7M6L1Q-WBM1-UdjYzL6QbnnxtzqaQ_JOfJd-LA2co4Bmj4xlR7-Y" alt="User 2" className="w-full h-full object-cover"/>
                   </div>
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 overflow-hidden">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkRCLgM5H0hxMlF5aCfJ0L6qeQiM1qfjWNX-Z-pc9IcVkkZESgRTRMR4Z741gWmnFRKMwf9B7y-LTLkdZiuerTjBU89kwbMvkOEcWQp_ayZ__rjpwqF_YCo8r3QN3gF8I361L8cRDC2xTS5eP5T0XFiBRxCMYwOMv6r2mY5ssCIfv4nCyc_wsA7TUAXPVJSNo6XrQKuoMg9VPzvrGqZK45EhqCGsdj7ktBAVvMTgJoqA-5NNwYmiWar0nJRnt6EdehHvt1xI8qgxU" alt="User 3" className="w-full h-full object-cover"/>
                   </div>
                </div>
                <p>Digunakan oleh <span className="font-bold text-text-main">15+ Kader Posyandu</span></p>
              </div>
            </div>
            {/* Hero Image */}
            <div className="flex-1 w-full lg:h-auto">
              <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-100 group">
                <div className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOZdj3FevVq4cvaR8OP0RMEE4SGgsosCUAPBpjhaJyXEGceoIDU_Z8rRx14crsmqxou38-RhUlFhRN3OvfGrK3D546SLnw18lncKhMTqfeBp2NlcnrEW5yty65jCssd2sno97Wky7iV9ubnvuBdZ07itJlrWZ-XoYO8iNps4O1UsMEd8wqBDfGkDuQ_sRNyb-0s6PSZ16hjT6iHbWwpHlyBWS87ljQ_QYLp2vJRPVwb7xXH3Fl2uiud1gi8quhf6dlL-yr2sWZYwI")' }}>
                </div>
                {/* Floating Card Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-gray-50/95 backdrop-blur px-6 py-4 rounded-xl shadow-lg border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-full text-primary">
                      <span className="material-symbols-outlined">favorite</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase">Status Gizi</p>
                      <p className="text-lg font-bold text-text-main">Terpantau Baik</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="w-full bg-gray-50 py-20 scroll-mt-20">
          <div className="flex justify-center w-full px-4 md:px-10">
            <div className="flex flex-col max-w-[1280px] flex-1 gap-12">
              <div className="flex flex-col gap-4 text-center items-center">
                <h2 className="text-text-main tracking-tight text-3xl md:text-4xl font-black leading-tight max-w-[720px]">
                  Keunggulan Sistem SI-PANDA
                </h2>
                <p className="text-text-secondary text-base md:text-lg font-normal leading-normal max-w-[720px]">
                  Teknologi yang memudahkan pemantauan kesehatan anak demi masa depan Desa Kramat yang lebih baik.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Feature 1 */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#dce5df] bg-white p-8 shadow-sm hover:shadow-md transition-shadow group cursor-default">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">fact_check</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-text-main text-xl font-bold leading-tight">Data Akurat</h3>
                    <p className="text-text-secondary text-base font-normal leading-relaxed">
                      Pencatatan data pengukuran tinggi dan berat badan yang presisi dan terintegrasi untuk setiap balita di desa.
                    </p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#dce5df] bg-white p-8 shadow-sm hover:shadow-md transition-shadow group cursor-default">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">query_stats</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-text-main text-xl font-bold leading-tight">Monitoring Real-time</h3>
                    <p className="text-text-secondary text-base font-normal leading-relaxed">
                      Dasbor interaktif untuk memantau status gizi dan grafik tumbuh kembang anak secara langsung kapan saja.
                    </p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#dce5df] bg-white p-8 shadow-sm hover:shadow-md transition-shadow group cursor-default">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">summarize</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-text-main text-xl font-bold leading-tight">Laporan Mudah</h3>
                    <p className="text-text-secondary text-base font-normal leading-relaxed">
                      Kemudahan bagi kader posyandu dalam mengunduh dan menyusun laporan kegiatan bulanan secara otomatis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-20 px-4 md:px-10 bg-gray-50 scroll-mt-20">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col gap-4 text-center items-center mb-12">
              <h2 className="text-text-main tracking-tight text-3xl md:text-4xl font-black leading-tight">
                Hubungi Kami
              </h2>
              <p className="text-text-secondary text-base md:text-lg font-normal leading-normal max-w-[720px]">
                Jika Anda memiliki pertanyaan atau membutuhkan informasi lebih lanjut, silakan hubungi kami.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* WhatsApp */}
              <div 
                className="flex flex-col items-center gap-4 rounded-xl border border-[#dce5df] bg-white p-8 shadow-sm transition-all group cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform">
                  <span className="material-symbols-outlined text-3xl">chat</span>
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="text-text-main text-lg font-bold">WhatsApp</h3>
                  <p className="text-text-secondary text-base">+62 812-3456-7890</p>
                </div>
              </div>
              {/* Email */}
              <div 
                className="flex flex-col items-center gap-4 rounded-xl border border-[#dce5df] bg-white p-8 shadow-sm transition-all group cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform">
                  <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="text-text-main text-lg font-bold">Email</h3>
                  <p className="text-text-secondary text-base">posyandu.kramat@gmail.com</p>
                </div>
              </div>
              {/* Location */}
              <div 
                className="flex flex-col items-center gap-4 rounded-xl border border-[#dce5df] bg-white p-8 shadow-sm transition-all group cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform">
                  <span className="material-symbols-outlined text-3xl">location_on</span>
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="text-text-main text-lg font-bold">Alamat</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">Jl. Nganguk Wali No.1, Nganguk, Kramat, Kec. Kota Kudus, Kabupaten Kudus, Jawa Tengah 59312</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats/CTA Section */}
        <section id="cta" className="w-full py-16 px-4 md:px-10 bg-white">
          <div className="max-w-[1280px] mx-auto bg-primary rounded-2xl overflow-hidden relative shadow-2xl shadow-primary/30">
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#111714 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-8">
              <div className="flex flex-col gap-4 max-w-2xl">
                <h2 className="text-text-main text-3xl md:text-4xl font-black leading-tight">
                  Mari wujudkan generasi Desa Kramat bebas stunting!
                </h2>
                <p className="text-text-main/80 text-lg font-medium">
                  Bergabung dengan sistem digitalisasi posyandu kami.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/login" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-text-main hover:bg-black text-white text-base font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95">
                    Masuk Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100">
        <div className="flex justify-center w-full px-4 md:px-10 py-12">
          <div className="max-w-[1280px] w-full flex flex-col gap-8">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand & Description */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-text-main">
                  <span className="material-symbols-outlined text-primary text-2xl">child_care</span>
                  <h2 className="text-lg font-bold">SI-PANDA</h2>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Sistem Informasi Pemantau Gizi Anak Desa Kramat. Solusi digital untuk pencatatan gizi dan pencegahan stunting.
                </p>
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-col gap-4">
                <h3 className="text-text-main font-bold text-sm uppercase tracking-wider">Menu</h3>
                <div className="flex flex-col gap-2">
                  <Link className="text-text-secondary hover:text-primary transition-colors text-sm font-medium" href="#home">Beranda</Link>
                  <Link className="text-text-secondary hover:text-primary transition-colors text-sm font-medium" href="#features">Keunggulan</Link>
                  <Link className="text-text-secondary hover:text-primary transition-colors text-sm font-medium" href="#contact">Kontak</Link>
                  <Link className="text-text-secondary hover:text-primary transition-colors text-sm font-medium" href="/login">Masuk Sistem</Link>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="flex flex-col gap-4">
                <h3 className="text-text-main font-bold text-sm uppercase tracking-wider">Hubungi Kami</h3>
                <div className="flex flex-col gap-3">
                  <a 
                    href="https://wa.me/6281234567890" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    <span>+62 812-3456-7890</span>
                  </a>
                  <a 
                    href="mailto:posyandu.kramat@gmail.com" 
                    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">mail</span>
                    <span>posyandu.kramat@gmail.com</span>
                  </a>
                  <a 
                    href="https://maps.google.com/?q=Jl.+Nganguk+Wali+No.1,+Kramat,+Kudus,+Jawa+Tengah" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    <span>Jl. Nganguk Wali No.1, Kramat, Kudus</span>
                  </a>
                </div>
                {/* Social Links */}
                <div className="flex gap-3 mt-2">
                  <a 
                    href="https://wa.me/6281234567890" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                    title="WhatsApp"
                  >
                    <span className="material-symbols-outlined text-xl">chat</span>
                  </a>
                  <a 
                    href="mailto:posyandu.kramat@gmail.com" 
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                    title="Email"
                  >
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </a>
                  <a 
                    href="https://maps.google.com/?q=Jl.+Nganguk+Wali+No.1,+Kramat,+Kudus,+Jawa+Tengah" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                    title="Lokasi"
                  >
                    <span className="material-symbols-outlined text-xl">location_on</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-100 w-full pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-text-secondary text-sm font-normal">
                © 2024 Pemerintah Desa Kramat, Kudus. Didukung oleh Puskesmas setempat.
              </p>
              <div className="flex items-center gap-6">
                <Link className="text-text-secondary hover:text-primary transition-colors text-sm" href="#home">Beranda</Link>
                <Link className="text-text-secondary hover:text-primary transition-colors text-sm" href="#features">Keunggulan</Link>
                <Link className="text-text-secondary hover:text-primary transition-colors text-sm" href="#contact">Kontak</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
