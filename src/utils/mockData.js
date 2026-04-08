export const users = [
  {
    id: 1,
    nama: 'Budi Santoso',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    nip: '198501012010011001',
    avatar: null,
  },
  {
    id: 2,
    nama: 'Siti Rahayu',
    username: 'management',
    password: 'mgmt123',
    role: 'management',
    nip: '199002152015022002',
    avatar: null,
  },
  {
    id: 3,
    nama: 'Andi Pratama',
    username: 'staff',
    password: 'staff123',
    role: 'staff',
    nip: '199505202020031003',
    avatar: null,
  },
]

export const inventaris = [
  {
    id: 1,
    nama: 'Laptop ASUS VivoBook 14',
    stok: 12,
    gambar: null,
    kategori: 'Elektronik',
  },
  {
    id: 2,
    nama: 'Proyektor Epson EB-X51',
    stok: 5,
    gambar: null,
    kategori: 'Elektronik',
  },
  {
    id: 3,
    nama: 'Kursi Ergonomis Highback',
    stok: 30,
    gambar: null,
    kategori: 'Furnitur',
  },
  {
    id: 4,
    nama: 'Meja Kerja 120x60cm',
    stok: 20,
    gambar: null,
    kategori: 'Furnitur',
  },
  {
    id: 5,
    nama: 'Printer HP LaserJet Pro',
    stok: 8,
    gambar: null,
    kategori: 'Elektronik',
  },
  {
    id: 6,
    nama: 'Whiteboard Magnetic 120x90',
    stok: 0,
    gambar: null,
    kategori: 'Perlengkapan',
  },
  {
    id: 7,
    nama: 'AC Daikin 1.5 PK',
    stok: 3,
    gambar: null,
    kategori: 'Elektronik',
  },
]

export const arsipKepegawaian = [
  { id: 1, nama: 'SK Pengangkatan PNS Tahun 2024', noDokumen: 'KEP/001/2024', tanggal: '2024-01-15', subBagian: 'Kepegawaian', file: 'sk_pengangkatan_2024.pdf' },
  { id: 2, nama: 'Surat Kenaikan Pangkat Gol. III/b', noDokumen: 'KEP/002/2024', tanggal: '2024-02-10', subBagian: 'Kepegawaian', file: 'kenaikan_pangkat.pdf' },
  { id: 3, nama: 'Daftar Hadir Pegawai Januari 2024', noDokumen: 'KEP/003/2024', tanggal: '2024-01-31', subBagian: 'Absensi', file: 'absensi_jan_2024.pdf' },
  { id: 4, nama: 'Surat Cuti Tahunan - Budi Santoso', noDokumen: 'KEP/004/2024', tanggal: '2024-03-05', subBagian: 'Cuti', file: 'cuti_budi.pdf' },
  { id: 5, nama: 'Laporan Penilaian Kinerja Q1', noDokumen: 'KEP/005/2024', tanggal: '2024-04-01', subBagian: 'Kinerja', file: 'penilaian_q1.pdf' },
  { id: 6, nama: 'SK Mutasi Pegawai', noDokumen: 'KEP/006/2024', tanggal: '2024-04-15', subBagian: 'Mutasi', file: 'sk_mutasi.pdf' },
  { id: 7, nama: 'Surat Peringatan Pegawai', noDokumen: 'KEP/007/2024', tanggal: '2024-05-02', subBagian: 'Disiplin', file: 'sp_pegawai.pdf' },
  { id: 8, nama: 'Data Kepegawaian Update Mei 2024', noDokumen: 'KEP/008/2024', tanggal: '2024-05-15', subBagian: 'Kepegawaian', file: 'data_pegawai_mei.pdf' },
  { id: 9, nama: 'Laporan Diklat Pegawai 2024', noDokumen: 'KEP/009/2024', tanggal: '2024-06-01', subBagian: 'Diklat', file: 'laporan_diklat.pdf' },
  { id: 10, nama: 'SK Pensiun Pegawai', noDokumen: 'KEP/010/2024', tanggal: '2024-06-15', subBagian: 'Pensiun', file: 'sk_pensiun.pdf' },
  { id: 11, nama: 'Rekapitulasi Absensi Semester 1', noDokumen: 'KEP/011/2024', tanggal: '2024-07-01', subBagian: 'Absensi', file: 'rekap_absensi_s1.pdf' },
  { id: 12, nama: 'Surat Tugas Dinas Luar', noDokumen: 'KEP/012/2024', tanggal: '2024-07-10', subBagian: 'Kepegawaian', file: 'surat_tugas.pdf' },
]

export const arsipKeuangan = [
  { id: 101, nama: 'Laporan Keuangan Bulanan Januari', noDokumen: 'KEU/001/2024', tanggal: '2024-01-31', subBagian: 'Akuntansi', file: 'lapkeu_jan.pdf' },
  { id: 102, nama: 'Rencana Anggaran Biaya Q1', noDokumen: 'KEU/002/2024', tanggal: '2024-01-10', subBagian: 'Anggaran', file: 'rab_q1.pdf' },
  { id: 103, nama: 'Bukti Pembayaran Vendor PT. Maju', noDokumen: 'KEU/003/2024', tanggal: '2024-02-15', subBagian: 'Pembayaran', file: 'bukti_bayar_maju.pdf' },
  { id: 104, nama: 'Slip Gaji Pegawai Februari 2024', noDokumen: 'KEU/004/2024', tanggal: '2024-02-28', subBagian: 'Penggajian', file: 'slip_gaji_feb.pdf' },
  { id: 105, nama: 'Laporan Pajak PPh 21 Q1', noDokumen: 'KEU/005/2024', tanggal: '2024-04-10', subBagian: 'Pajak', file: 'pph21_q1.pdf' },
  { id: 106, nama: 'Nota Dinas Pengadaan ATK', noDokumen: 'KEU/006/2024', tanggal: '2024-03-20', subBagian: 'Pengadaan', file: 'nota_atk.pdf' },
  { id: 107, nama: 'Rekonsiliasi Bank Maret 2024', noDokumen: 'KEU/007/2024', tanggal: '2024-03-31', subBagian: 'Akuntansi', file: 'rekon_bank_mar.pdf' },
  { id: 108, nama: 'Laporan Kas Harian April 2024', noDokumen: 'KEU/008/2024', tanggal: '2024-04-30', subBagian: 'Kas', file: 'kas_apr.pdf' },
  { id: 109, nama: 'Proposal Anggaran Tahun 2025', noDokumen: 'KEU/009/2024', tanggal: '2024-05-15', subBagian: 'Anggaran', file: 'proposal_2025.pdf' },
  { id: 110, nama: 'Audit Internal Semester 1', noDokumen: 'KEU/010/2024', tanggal: '2024-07-01', subBagian: 'Audit', file: 'audit_s1.pdf' },
  { id: 111, nama: 'Laporan Realisasi Anggaran Q2', noDokumen: 'KEU/011/2024', tanggal: '2024-07-15', subBagian: 'Anggaran', file: 'realisasi_q2.pdf' },
  { id: 112, nama: 'Bukti Setor Pajak PPN', noDokumen: 'KEU/012/2024', tanggal: '2024-06-20', subBagian: 'Pajak', file: 'setor_ppn.pdf' },
]

export const arsipUmum = [
  { id: 201, nama: 'Surat Masuk - Dinas Pendidikan', noDokumen: 'UM/001/2024', tanggal: '2024-01-05', subBagian: 'Surat Masuk', file: 'surat_masuk_disdik.pdf' },
  { id: 202, nama: 'Surat Keluar - Undangan Rapat', noDokumen: 'UM/002/2024', tanggal: '2024-01-12', subBagian: 'Surat Keluar', file: 'undangan_rapat.pdf' },
  { id: 203, nama: 'Notulen Rapat Koordinasi Januari', noDokumen: 'UM/003/2024', tanggal: '2024-01-20', subBagian: 'Notulen', file: 'notulen_jan.pdf' },
  { id: 204, nama: 'MoU Kerjasama PT. Berkah Jaya', noDokumen: 'UM/004/2024', tanggal: '2024-02-01', subBagian: 'Perjanjian', file: 'mou_berkah.pdf' },
  { id: 205, nama: 'Surat Edaran Hari Libur Nasional', noDokumen: 'UM/005/2024', tanggal: '2024-02-20', subBagian: 'Surat Keluar', file: 'edaran_libur.pdf' },
  { id: 206, nama: 'Berita Acara Serah Terima Barang', noDokumen: 'UM/006/2024', tanggal: '2024-03-10', subBagian: 'Berita Acara', file: 'bast_barang.pdf' },
  { id: 207, nama: 'Proposal Kegiatan Outing Kantor', noDokumen: 'UM/007/2024', tanggal: '2024-03-25', subBagian: 'Umum', file: 'proposal_outing.pdf' },
  { id: 208, nama: 'Laporan Pemeliharaan Gedung Q1', noDokumen: 'UM/008/2024', tanggal: '2024-04-05', subBagian: 'Pemeliharaan', file: 'pemeliharaan_q1.pdf' },
  { id: 209, nama: 'Surat Permohonan Renovasi Ruangan', noDokumen: 'UM/009/2024', tanggal: '2024-04-20', subBagian: 'Umum', file: 'permohonan_renovasi.pdf' },
  { id: 210, nama: 'Dokumentasi Kegiatan HUT RI 79', noDokumen: 'UM/010/2024', tanggal: '2024-08-17', subBagian: 'Dokumentasi', file: 'hut_ri_79.pdf' },
  { id: 211, nama: 'Daftar Inventaris Ruangan Lt. 2', noDokumen: 'UM/011/2024', tanggal: '2024-05-10', subBagian: 'Inventaris', file: 'inventaris_lt2.pdf' },
  { id: 212, nama: 'Surat Izin Penggunaan Aula', noDokumen: 'UM/012/2024', tanggal: '2024-06-01', subBagian: 'Perizinan', file: 'izin_aula.pdf' },
]

export const aktivitasTerakhir = [
  { id: 1, userId: 1, nama: 'Budi Santoso', aksi: 'Mengunggah', target: 'Laporan Keuangan Q1.pdf', waktu: '2024-07-15 14:30' },
  { id: 2, userId: 3, nama: 'Andi Pratama', aksi: 'Mengunduh', target: 'SK Pengangkatan PNS.pdf', waktu: '2024-07-15 13:15' },
  { id: 3, userId: 2, nama: 'Siti Rahayu', aksi: 'Meminjam', target: 'Proyektor Epson EB-X51', waktu: '2024-07-15 11:00' },
  { id: 4, userId: 1, nama: 'Budi Santoso', aksi: 'Menghapus', target: 'Draft Surat Lama.pdf', waktu: '2024-07-15 09:45' },
]

export const withDelay = (data, ms = 400) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms))
