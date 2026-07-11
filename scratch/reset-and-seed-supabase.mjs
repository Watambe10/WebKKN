import fs from 'fs';
import path from 'path';

// Load env variables
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase env variables.");
  process.exit(1);
}

const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
};

const tables = ['berita', 'kegiatan', 'gallery', 'monografi_desa'];

const monografiData = [
  {
    tahun: 2026,
    jumlah_penduduk: 1250,
    jumlah_laki_laki: 620,
    jumlah_perempuan: 630,
    jumlah_kk: 380,
    jumlah_dusun: 1,
    jumlah_rt: 6,
    jumlah_rw: 3,
    luas_wilayah: "1,45 km2",
    keterangan: "Data monografi semester I tahun 2026 untuk wilayah Padukuhan Plasan.",
    jumlah_anak: 250,
    jumlah_balita: 120,
    pendidikan_paud: 80,
    pendidikan_sd: 220,
    pendidikan_smp: 180,
    pendidikan_sma: 240,
    ketua_rt_1: "Budi Santoso",
    ketua_rt_2: "Ahmad Dahlan",
    ketua_rt_3: "Siti Rahma",
    ketua_rt_4: "Joko Widodo",
    ketua_rt_5: "Sri Mulyani",
    ketua_rt_6: "Andi Wijaya",
    ketua_rw_1: "Heri Prasetyo",
    ketua_rw_2: "Suryono",
    ketua_rw_3: "Hartono",
    peta_wilayah: "/peta-plasan.png"
  },
  {
    tahun: 2025,
    jumlah_penduduk: 1235,
    jumlah_laki_laki: 612,
    jumlah_perempuan: 623,
    jumlah_kk: 375,
    jumlah_dusun: 1,
    jumlah_rt: 6,
    jumlah_rw: 3,
    luas_wilayah: "1,45 km2",
    keterangan: "Rekapitulasi data kependudukan akhir tahun 2025.",
    jumlah_anak: 240,
    jumlah_balita: 115,
    pendidikan_paud: 75,
    pendidikan_sd: 215,
    pendidikan_smp: 175,
    pendidikan_sma: 235,
    ketua_rt_1: "Budi Santoso",
    ketua_rt_2: "Ahmad Dahlan",
    ketua_rt_3: "Siti Rahma",
    ketua_rt_4: "Joko Widodo",
    ketua_rt_5: "Sri Mulyani",
    ketua_rt_6: "Andi Wijaya",
    ketua_rw_1: "Heri Prasetyo",
    ketua_rw_2: "Suryono",
    ketua_rw_3: "Hartono",
    peta_wilayah: "/peta-plasan.png"
  },
  {
    tahun: 2024,
    jumlah_penduduk: 1210,
    jumlah_laki_laki: 598,
    jumlah_perempuan: 612,
    jumlah_kk: 368,
    jumlah_dusun: 1,
    jumlah_rt: 6,
    jumlah_rw: 3,
    luas_wilayah: "1,45 km2",
    keterangan: "Data dasar awal perencanaan pembangunan wilayah padukuhan.",
    jumlah_anak: 230,
    jumlah_balita: 110,
    pendidikan_paud: 70,
    pendidikan_sd: 210,
    pendidikan_smp: 170,
    pendidikan_sma: 220,
    ketua_rt_1: "Budi Santoso",
    ketua_rt_2: "Ahmad Dahlan",
    ketua_rt_3: "Siti Rahma",
    ketua_rt_4: "Joko Widodo",
    ketua_rt_5: "Sri Mulyani",
    ketua_rt_6: "Andi Wijaya",
    ketua_rw_1: "Heri Prasetyo",
    ketua_rw_2: "Suryono",
    ketua_rw_3: "Hartono",
    peta_wilayah: "/peta-plasan.png"
  }
];

const beritaData = [
  {
    judul: "Mahasiswa KKN Sukses Gelar Sosialisasi Pemanfaatan Lahan Pekarangan",
    slug: "kkn-sosialisasi-lahan-pekarangan",
    isi: "Kelompok mahasiswa KKN di Padukuhan Plasan menyelenggarakan kegiatan sosialisasi mengenai optimalisasi pemanfaatan pekarangan rumah warga untuk budidaya tanaman obat keluarga (TOGA) dan sayuran organik. Kegiatan ini dihadiri oleh ibu-ibu PKK setempat dengan antusiasme yang tinggi. Diharapkan program ini dapat meningkatkan ketahanan pangan tingkat rumah tangga di Plasan.",
    gambar: "/hero-desa.png",
    penulis: "Tim KKN Plasan",
    tanggal_publish: "2026-06-25"
  },
  {
    judul: "Pemberdayaan UMKM Plasan Melalui Pelatihan Pemasaran Digital",
    slug: "pemberdayaan-umkm-pemasaran-digital",
    isi: "Dalam rangka memajukan usaha mikro di Padukuhan Plasan, diadakan pelatihan pemasaran digital yang dipandu oleh mahasiswa KKN. Pelatihan ini mengajarkan cara pembuatan profil Google Maps, pendaftaran merchant e-commerce, serta pembuatan konten promosi yang menarik di media sosial. Para pelaku usaha keripik singkong dan kerajinan bambu kini siap memperluas pasar secara online.",
    gambar: "/hero-desa.png",
    penulis: "Kepala Padukuhan",
    tanggal_publish: "2026-06-28"
  },
  {
    judul: "Kerja Bakti Masal Warga Padukuhan Plasan Menyambut Musim Hujan",
    slug: "kerja-bakti-masal-plasan",
    isi: "Menyambut datangnya musim pancaroba, seluruh warga Padukuhan Plasan secara serempak mengadakan kegiatan gotong royong membersihkan saluran irigasi dan selokan di sepanjang jalan utama. Kegiatan ini bertujuan untuk mengantisipasi potensi genangan air dan mencegah sarang nyamuk DBD. Semangat kebersamaan dan kerukunan terlihat erat di antara warga dari seluruh RT.",
    gambar: "/hero-desa.png",
    penulis: "Karang Taruna",
    tanggal_publish: "2026-06-20"
  }
];

const kegiatanData = [
  {
    nama_kegiatan: "Pemeriksaan Kesehatan Posyandu Balita & Lansia",
    slug: "posyandu-balita-lansia-plasan",
    deskripsi: "Pemeriksaan kesehatan rutin bulanan meliputi penimbangan berat badan balita, imunisasi dasar, pemeriksaan tekanan darah lansia, serta pembagian makanan tambahan (PMT) bergizi.",
    tanggal_mulai: "2026-07-05",
    tanggal_selesai: "2026-07-05",
    waktu_mulai: "08:00",
    waktu_selesai: "11:30",
    gambar: "/hero-desa.png"
  },
  {
    nama_kegiatan: "Rembuk Padukuhan Penyusunan Rencana Kerja 2027",
    slug: "rembuk-padukuhan-rkp-2027",
    deskripsi: "Musyawarah bersama dukuh, RT, RW, tokoh masyarakat, dan warga untuk menjaring usulan prioritas pembangunan fisik maupun pemberdayaan masyarakat yang akan diusulkan ke musrenbang tingkat kelurahan.",
    tanggal_mulai: "2026-07-12",
    tanggal_selesai: "2026-07-12",
    waktu_mulai: "19:30",
    waktu_selesai: "22:00",
    gambar: "/hero-desa.png"
  },
  {
    nama_kegiatan: "Pelatihan Pengolahan Sampah Organik Menjadi Kompos",
    slug: "pelatihan-sampah-organik-kompos",
    deskripsi: "Workshop pembuatan pupuk kompos menggunakan metode komposter sederhana bagi warga Padukuhan Plasan untuk menekan volume sampah rumah tangga sekaligus menyediakan pupuk alami bagi tanaman pekarangan.",
    tanggal_mulai: "2026-07-18",
    tanggal_selesai: "2026-07-18",
    waktu_mulai: "09:00",
    waktu_selesai: "13:00",
    gambar: "/hero-desa.png"
  }
];

const galleryData = [
  {
    judul: "Persawahan Hijau Plasan",
    deskripsi: "Pemandangan sawah irigasi di wilayah Padukuhan Plasan yang menjadi sumber mata pencaharian utama mayoritas warga.",
    gambar: "/hero-desa.png",
    kategori: "Potensi Wilayah",
    tanggal_upload: "2026-06-15"
  },
  {
    judul: "Produk Kerajinan Bambu",
    deskripsi: "Hasil kerajinan anyaman bambu buatan warga Plasan yang dipasarkan ke berbagai wilayah sekitar.",
    gambar: "/hero-desa.png",
    kategori: "UMKM",
    tanggal_upload: "2026-06-18"
  },
  {
    judul: "Kebersamaan Ibu-Ibu PKK",
    deskripsi: "Kekompakan ibu-ibu kader PKK Padukuhan Plasan saat mempersiapkan konsumsi sehat untuk Posyandu.",
    gambar: "/hero-desa.png",
    kategori: "Kegiatan Warga",
    tanggal_upload: "2026-06-22"
  }
];

async function run() {
  console.log("Starting reset and seed script...");

  // Delete all data first
  for (const table of tables) {
    console.log(`Deleting all rows from table "${table}"...`);
    const deleteUrl = `${supabaseUrl}/rest/v1/${table}?id=neq.0`;
    const deleteRes = await fetch(deleteUrl, { method: 'DELETE', headers });
    if (!deleteRes.ok) {
      const errMsg = await deleteRes.text();
      console.error(`Failed to delete rows from ${table}: ${errMsg}`);
    } else {
      console.log(`Successfully cleared table "${table}".`);
    }
  }

  // Insert dummy data
  const insertData = [
    { table: 'monografi_desa', payload: monografiData },
    { table: 'berita', payload: beritaData },
    { table: 'kegiatan', payload: kegiatanData },
    { table: 'gallery', payload: galleryData }
  ];

  for (const item of insertData) {
    console.log(`Inserting dummy rows into table "${item.table}"...`);
    const insertUrl = `${supabaseUrl}/rest/v1/${item.table}`;
    const insertRes = await fetch(insertUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(item.payload)
    });
    if (!insertRes.ok) {
      const errMsg = await insertRes.text();
      console.error(`Failed to insert rows into ${item.table}: ${errMsg}`);
    } else {
      console.log(`Successfully seeded table "${item.table}".`);
    }
  }

  console.log("Reset and seed completed successfully!");
}

run().catch(console.error);
