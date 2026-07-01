export type Berita = {
  id: number;
  judul: string;
  slug: string;
  isi: string;
  gambar: string;
  penulis: string;
  tanggal_publish: string;
};

export type Kegiatan = {
  id: number;
  nama_kegiatan: string;
  slug: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  waktu_mulai: string;
  waktu_selesai: string;
  gambar: string;
};

export type GalleryItem = {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
  kategori: string;
  tanggal_upload: string;
};

export type MonografiDesa = {
  id: number;
  tahun: number;
  jumlah_penduduk: number;
  jumlah_laki_laki: number;
  jumlah_perempuan: number;
  jumlah_kk: number;
  jumlah_dusun: number;
  jumlah_rt: number;
  jumlah_rw: number;
  luas_wilayah: string;
  keterangan: string;
};

export const desa = {
  nama: "Padukuhan Plasan",
  namaSingkat: "Plasan",
  kecamatan: "Kecamatan Sejahtera",
  kabupaten: "Kabupaten Nusantara",
  email: "padukuhan@plasan.desa.id",
  telepon: "(021) 1234 5678",
};

export const initialMonografiDesa: MonografiDesa[] = [
  {
    id: 1,
    tahun: 2026,
    jumlah_penduduk: 1250,
    jumlah_laki_laki: 620,
    jumlah_perempuan: 630,
    jumlah_kk: 380,
    jumlah_dusun: 1,
    jumlah_rt: 8,
    jumlah_rw: 2,
    luas_wilayah: "1,45 km2",
    keterangan: "Data monografi semester I tahun 2026 untuk wilayah Padukuhan Plasan.",
  },
  {
    id: 2,
    tahun: 2025,
    jumlah_penduduk: 1235,
    jumlah_laki_laki: 612,
    jumlah_perempuan: 623,
    jumlah_kk: 375,
    jumlah_dusun: 1,
    jumlah_rt: 8,
    jumlah_rw: 2,
    luas_wilayah: "1,45 km2",
    keterangan: "Rekapitulasi data kependudukan akhir tahun 2025.",
  },
  {
    id: 3,
    tahun: 2024,
    jumlah_penduduk: 1210,
    jumlah_laki_laki: 598,
    jumlah_perempuan: 612,
    jumlah_kk: 368,
    jumlah_dusun: 1,
    jumlah_rt: 8,
    jumlah_rw: 2,
    luas_wilayah: "1,45 km2",
    keterangan: "Data dasar awal perencanaan pembangunan wilayah padukuhan.",
  },
];

export const initialBerita: Berita[] = [
  {
    id: 1,
    judul: "Mahasiswa KKN Sukses Gelar Sosialisasi Pemanfaatan Lahan Pekarangan",
    slug: "kkn-sosialisasi-lahan-pekarangan",
    isi: "Kelompok mahasiswa KKN di Padukuhan Plasan menyelenggarakan kegiatan sosialisasi mengenai optimalisasi pemanfaatan pekarangan rumah warga untuk budidaya tanaman obat keluarga (TOGA) dan sayuran organik. Kegiatan ini dihadiri oleh ibu-ibu PKK setempat dengan antusiasme yang tinggi. Diharapkan program ini dapat meningkatkan ketahanan pangan tingkat rumah tangga di Plasan.",
    gambar: "/hero-desa.png",
    penulis: "Tim KKN Plasan",
    tanggal_publish: "2026-06-25",
  },
  {
    id: 2,
    judul: "Pemberdayaan UMKM Plasan Melalui Pelatihan Pemasaran Digital",
    slug: "pemberdayaan-umkm-pemasaran-digital",
    isi: "Dalam rangka memajukan usaha mikro di Padukuhan Plasan, diadakan pelatihan pemasaran digital yang dipandu oleh mahasiswa KKN. Pelatihan ini mengajarkan cara pembuatan profil Google Maps, pendaftaran merchant e-commerce, serta pembuatan konten promosi yang menarik di media sosial. Para pelaku usaha keripik singkong dan kerajinan bambu kini siap memperluas pasar secara online.",
    gambar: "/hero-desa.png",
    penulis: "Kepala Padukuhan",
    tanggal_publish: "2026-06-28",
  },
  {
    id: 3,
    judul: "Kerja Bakti Masal Warga Padukuhan Plasan Menyambut Musim Hujan",
    slug: "kerja-bakti-masal-plasan",
    isi: "Menyambut datangnya musim pancaroba, seluruh warga Padukuhan Plasan secara serempak mengadakan kegiatan gotong royong membersihkan saluran irigasi dan selokan di sepanjang jalan utama. Kegiatan ini bertujuan untuk mengantisipasi potensi genangan air dan mencegah sarang nyamuk DBD. Semangat kebersamaan dan kerukunan terlihat erat di antara warga dari seluruh RT.",
    gambar: "/hero-desa.png",
    penulis: "Karang Taruna",
    tanggal_publish: "2026-06-20",
  },
];

export const initialKegiatan: Kegiatan[] = [
  {
    id: 1,
    nama_kegiatan: "Pemeriksaan Kesehatan Posyandu Balita & Lansia",
    slug: "posyandu-balita-lansia-plasan",
    deskripsi: "Pemeriksaan kesehatan rutin bulanan meliputi penimbangan berat badan balita, imunisasi dasar, pemeriksaan tekanan darah lansia, serta pembagian makanan tambahan (PMT) bergizi.",
    tanggal_mulai: "2026-07-05",
    tanggal_selesai: "2026-07-05",
    waktu_mulai: "08:00",
    waktu_selesai: "11:30",
    gambar: "/hero-desa.png",
  },
  {
    id: 2,
    nama_kegiatan: "Rembuk Padukuhan Penyusunan Rencana Kerja 2027",
    slug: "rembuk-padukuhan-rkp-2027",
    deskripsi: "Musyawarah bersama dukuh, RT, RW, tokoh masyarakat, dan warga untuk menjaring usulan prioritas pembangunan fisik maupun pemberdayaan masyarakat yang akan diusulkan ke musrenbang tingkat kelurahan.",
    tanggal_mulai: "2026-07-12",
    tanggal_selesai: "2026-07-12",
    waktu_mulai: "19:30",
    waktu_selesai: "22:00",
    gambar: "/hero-desa.png",
  },
  {
    id: 3,
    nama_kegiatan: "Pelatihan Pengolahan Sampah Organik Menjadi Kompos",
    slug: "pelatihan-sampah-organik-kompos",
    deskripsi: "Workshop pembuatan pupuk kompos menggunakan metode komposter sederhana bagi warga Padukuhan Plasan untuk menekan volume sampah rumah tangga sekaligus menyediakan pupuk alami bagi tanaman pekarangan.",
    tanggal_mulai: "2026-07-18",
    tanggal_selesai: "2026-07-18",
    waktu_mulai: "09:00",
    waktu_selesai: "13:00",
    gambar: "/hero-desa.png",
  },
];

export const initialGallery: GalleryItem[] = [
  {
    id: 1,
    judul: "Persawahan Hijau Plasan",
    deskripsi: "Pemandangan sawah irigasi di wilayah Padukuhan Plasan yang menjadi sumber mata pencaharian utama mayoritas warga.",
    gambar: "/hero-desa.png",
    kategori: "Potensi Wilayah",
    tanggal_upload: "2026-06-15",
  },
  {
    id: 2,
    judul: "Produk Kerajinan Bambu",
    deskripsi: "Hasil kerajinan anyaman bambu buatan warga Plasan yang dipasarkan ke berbagai wilayah sekitar.",
    gambar: "/hero-desa.png",
    kategori: "UMKM",
    tanggal_upload: "2026-06-18",
  },
  {
    id: 3,
    judul: "Kebersamaan Ibu-Ibu PKK",
    deskripsi: "Kekompakan ibu-ibu kader PKK Padukuhan Plasan saat mempersiapkan konsumsi sehat untuk Posyandu.",
    gambar: "/hero-desa.png",
    kategori: "Kegiatan Warga",
    tanggal_upload: "2026-06-22",
  },
];

export const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
