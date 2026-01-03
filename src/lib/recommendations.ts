
export type RecommendationType = {
  status: string;
  title: string;
  color: string;
  food: string[];
  activity: string[];
  medical?: string;
};

export const RECOMMENDATIONS: Record<string, RecommendationType> = {
  // --- STATUS NORMAL ---
  'Normal': {
    status: 'Normal',
    title: 'Tetap Sehat & Tumbuh Optimal',
    color: 'bg-green-50 text-green-700 border-green-100',
    food: [
      'Lanjutkan ASI eksklusif (jika < 6 bulan) atau MPASI bergizi seimbang.',
      'Berikan protein hewani setiap hari (telur, ikan, ayam, daging).',
      'Pastikan variasi sayur dan buah dalam menu harian.'
    ],
    activity: [
      'Pantau berat & tinggi badan rutin setiap bulan di Posyandu.',
      'Pastikan imunisasi dasar lengkap sesuai jadwal.',
      'Ajak anak bermain aktif untuk stimulasi motorik.'
    ]
  },
  'Gizi Baik': {
    status: 'Gizi Baik',
    title: 'Pertahankan Gizi Seimbang',
    color: 'bg-green-50 text-green-700 border-green-100',
    food: [
      'Pertahankan pola makan "Isi Piringku" sesuai usia.',
      'Hindari makanan tinggi gula dan garam berlebih (snack kemasan).',
      'Cukupi kebutuhan air putih harian.'
    ],
    activity: [
      'Rutin ke Posyandu untuk pemantauan pertumbuhan.',
      'Jaga kebersihan diri dan lingkungan (cuci tangan pakai sabun).'
    ]
  },

  // --- STUNTING (TB/U) ---
  'Pendek': {
    status: 'Pendek',
    title: 'Perhatian Khusus: Risiko Stunting',
    color: 'bg-red-50 text-red-700 border-red-100',
    food: [
      'Tingkatkan asupan Protein Hewani (Telur, Ikan, Hati Ayam, Daging).',
      'Pastikan asupan kalsium (Susu, Ikan Teri, Keju) cukup.',
      'Berikan PMT (Pemberian Makanan Tambahan) tinggi kalori & protein.'
    ],
    activity: [
      'Konsultasi ke Bidan/Dokter untuk cek riwayat kesehatan/infeksi.',
      'Perbaiki sanitasi lingkungan (jamban sehat, air bersih).',
      'Pantau tinggi badan lebih ketat.'
    ],
    medical: 'Segera rujuk ke Puskesmas jika berat badan juga tidak naik.'
  },
  'Sangat Pendek': {
    status: 'Sangat Pendek',
    title: 'Intervensi Segera: Stunting Berat',
    color: 'bg-red-50 text-red-700 border-red-100',
    food: [
      'WAJIB asupan tinggi energi & protein (Susu khusus jika diresepkan).',
      'Tambahkan lemak dalam MPASI (Minyak, Santan, Margarin).',
      'Suplementasi Zinc dan Vitamin A sesuai anjuran petugas.'
    ],
    activity: [
      'Stimulasi psikososial agar perkembangan otak tetap optimal.',
      'Wajib pemeriksaan medis untuk mencari penyakit penyerta (TBC, Anemia, dll).',
      'Ikuti program intervensi gizi dari Puskesmas.'
    ],
    medical: 'Rujuk segera ke Dokter Spesialis Anak (DSA).'
  },

  // --- WASTING (BB/TB) ---
  'Gizi Kurang': {
    status: 'Gizi Kurang',
    title: 'Perbaiki Berat Badan Segera',
    color: 'bg-orange-50 text-orange-700 border-orange-100',
    food: [
      'Makan lebih sering dengan porsi kecil tapi padat gizi (Small Frequent Feeding).',
      'Double Protein Hewani di setiap jam makan.',
      'Kejar berat badan ideal sebelum tinggi badan bertambah.'
    ],
    activity: [
      'Evaluasi cara pemberian makan (jadwal, lingkungan, prosedur).',
      'Cek kesehatan gigi dan mulut anak.',
      'Timbang berat badan setiap 2 minggu.'
    ]
  },
  'Gizi Buruk': {
    status: 'Gizi Buruk',
    title: 'Kondisi Gawat: Butuh Penanganan Medis',
    color: 'bg-red-50 text-red-700 border-red-100',
    food: [
      'Ikuti protokol Tata Laksana Gizi Buruk dari Puskesmas/RS.',
      'Berikan F75/F100 atau RUTF (Plumpy Nut) sesuai resep dokter.',
      'Jangan berikan makanan porsi besar sekaligus (risiko Refeeding Syndrome).'
    ],
    activity: [
      'RAWAT JALAN atau RAWAT INAP intensif sesuai kondisi klinis.',
      'Jaga anak tetap hangat (hindari hipotermia).',
      'Pantau tanda bahaya (lemas, tidak mau menyusu, kejang).'
    ],
    medical: 'EMERGENCY: Rujuk ke RS/Puskesmas Perawatan.'
  },

  // --- UNDERWEIGHT (BB/U) ---
  'BB Kurang': {
    status: 'BB Kurang',
    title: 'Waspada Berat Badan Rendah',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    food: [
      'Tambahkan kalori pada setiap menu (Minyak, Santan, Protein Ekstra).',
      'Pastikan anak menghabiskan porsi makannya.',
      'Kurangi minum susu berlebih yang membuat kenyang sebelum makan utama.'
    ],
    activity: [
      'Cek kurva pertumbuhan (KMS), pastikan tidak mendatar/menurun.',
      'Berikan stimulasi makan yang menyenangkan (Responsive Feeding).'
    ]
  },
  'BB Sangat Kurang': {
    status: 'BB Sangat Kurang',
    title: 'Berat Badan Sangat Rendah',
    color: 'bg-red-50 text-red-700 border-red-100',
    food: [
      'Prioritaskan makanan padat gizi tinggi kalori.',
      'Konsultasi ahli gizi untuk menu catch-up growth.'
    ],
    activity: [
      'Investigasi penyebab: Kurang asupan atau ada infeksi?',
      'Rujuk ke petugas kesehatan.'
    ]
  },

  // --- OVERWEIGHT ---
  'Risiko BB Lebih': {
    status: 'Risiko BB Lebih',
    title: 'Cegah Obesitas Dini',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    food: [
      'Kurangi makanan manis, gorengan, dan minuman kemasan.',
      'Perbanyak sayur dan buah potong sebagai snack.',
      'Gunakan piring makan model T (setengah piring sayur/buah).'
    ],
    activity: [
      'Batasi Screen Time (HP/TV) maksimal 1 jam/hari.',
      'Ajak anak bergerak aktif min. 60 menit sehari.',
      'Tidur cukup dan teratur.'
    ]
  },
  'Gizi Lebih': {
    status: 'Gizi Lebih',
    title: 'Kendalikan Berat Badan',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    food: [
        'Stop susu formula tinggi kalori (ganti UHT plain/pasteurisasi jika > 1 th).',
        'Atur jadwal makan ketat, hindari grazing (ngemil terus menerus).'
    ],
    activity: [
        'Aktivitas fisik terstruktur (berenang, lari, main bola).',
        'Libatkan keluarga untuk menerapkan pola hidup sehat bersama.'
    ]
  },
  'Obesitas': {
    status: 'Obesitas',
    title: 'Perlu Penanganan Obesitas',
    color: 'bg-red-50 text-red-700 border-red-100',
    food: [
        'Konsultasi Dokter Gizi untuk pengaturan diet khusus.',
        'Total hindari minuman manis dan junk food.',
        'Perbanyak serat dari sayuran.'
    ],
    activity: [
        'Tingkatkan aktivitas fisik harian secara bertahap.',
        'Cek profil lipid/gula darah jika disarankan dokter.'
    ],
    medical: 'Rujuk ke Klinik Tumbuh Kembang / Dokter Gizi.'
  }
};

export function getWorstStatus(statuses: string[]): RecommendationType {
  // Priority order (Worst to Best)
  const priority = [
    'Gizi Buruk', 'Sangat Pendek', 'BB Sangat Kurang', 
    'Gizi Kurang', 'Pendek', 'BB Kurang', 'Obesitas', 
    'Gizi Lebih', 'Risiko BB Lebih', 'Normal', 'Gizi Baik'
  ];

  // Clean and Normalize Inputs
  const cleanedStatuses = statuses.map(s => s?.trim()).filter(Boolean);

  if (cleanedStatuses.length === 0) return RECOMMENDATIONS['Normal'];

  // Find the highest priority status present in the input
  for (const p of priority) {
    if (cleanedStatuses.includes(p)) {
      return RECOMMENDATIONS[p] || RECOMMENDATIONS['Normal'];
    }
  }

  return RECOMMENDATIONS['Normal'];
}
