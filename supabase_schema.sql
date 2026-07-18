-- SKRIP SQL MIGRASI DATABASE SUPABASE
-- Salin skrip di bawah ini dan jalankan di Supabase Dashboard -> SQL Editor proyek Anda.

-- 1. Tambahkan kolom baru ke tabel monografi_desa (jika belum ada)
ALTER TABLE monografi_desa ADD COLUMN IF NOT EXISTS nama_kepala_dusun TEXT DEFAULT '';
ALTER TABLE monografi_desa ADD COLUMN IF NOT EXISTS jumlah_lansia INT DEFAULT 0;
ALTER TABLE monografi_desa ADD COLUMN IF NOT EXISTS jumlah_dewasa INT DEFAULT 0;
ALTER TABLE monografi_desa ADD COLUMN IF NOT EXISTS pendidikan_tk INT DEFAULT 0;
ALTER TABLE monografi_desa ADD COLUMN IF NOT EXISTS pendidikan_sarjana INT DEFAULT 0;

-- 2. Buat tabel pengaturan_desa untuk menyimpan teks & kontak dinamis website
CREATE TABLE IF NOT EXISTS pengaturan_desa (
  id INT PRIMARY KEY,
  nama TEXT DEFAULT 'Padukuhan Plasan',
  nama_singkat TEXT DEFAULT 'Plasan',
  kecamatan TEXT DEFAULT 'Kecamatan Sejahtera',
  kabupaten TEXT DEFAULT 'Kabupaten Nusantara',
  email TEXT DEFAULT 'padukuhan@plasan.desa.id',
  telepon TEXT DEFAULT '(021) 1234 5678',
  hero_judul TEXT DEFAULT 'Padukuhan Plasan',
  hero_deskripsi TEXT DEFAULT 'Pusat informasi profil wilayah, pelayanan publik, berita, kegiatan, galeri, dan monografi Plasan yang tersaji transparan untuk warga.',
  profil_judul TEXT DEFAULT 'Ruang hidup warga Plasan yang bertumbuh lewat gotong royong.',
  profil_deskripsi TEXT DEFAULT 'Padukuhan Plasan merupakan wilayah agraris dengan potensi pertanian yang subur, UMKM rumah tangga yang produktif, kelembagaan warga yang solid, dan ruang kerukunan sosial yang kuat. Website ini dirancang sebagai pintu gerbang informasi resmi dan pelayanan publik bagi seluruh warga.',
  profil_kategori_1 TEXT DEFAULT 'Pelayanan Administrasi',
  profil_kategori_2 TEXT DEFAULT 'Informasi Pembangunan',
  profil_kategori_3 TEXT DEFAULT 'Potensi Padukuhan',
  hero_bg_media TEXT DEFAULT '/hero-desa.png',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tambahkan kolom hero_bg_media ke pengaturan_desa jika tabel sudah terlanjur dibuat sebelumnya
ALTER TABLE pengaturan_desa ADD COLUMN IF NOT EXISTS hero_bg_media TEXT DEFAULT '/hero-desa.png';

-- Matikan Row Level Security (RLS) agar dapat diakses oleh Admin Panel via Anon Key (sama seperti tabel monografi, berita, dll)
ALTER TABLE pengaturan_desa DISABLE ROW LEVEL SECURITY;

-- 3. Masukkan data awal pengaturan (jika belum ada)
INSERT INTO pengaturan_desa (id, nama, nama_singkat, kecamatan, kabupaten, email, telepon, hero_judul, hero_deskripsi, profil_judul, profil_deskripsi, profil_kategori_1, profil_kategori_2, profil_kategori_3, hero_bg_media)
VALUES (
  1,
  'Padukuhan Plasan',
  'Plasan',
  'Kecamatan Sejahtera',
  'Kabupaten Nusantara',
  'padukuhan@plasan.desa.id',
  '(021) 1234 5678',
  'Padukuhan Plasan',
  'Pusat informasi profil wilayah, pelayanan publik, berita, kegiatan, galeri, dan monografi Plasan yang tersaji transparan untuk warga.',
  'Ruang hidup warga Plasan yang bertumbuh lewat gotong royong.',
  'Padukuhan Plasan merupakan wilayah agraris dengan potensi pertanian yang subur, UMKM rumah tangga yang produktif, kelembagaan warga yang solid, dan ruang kerukunan sosial yang kuat. Website ini dirancang sebagai pintu gerbang informasi resmi dan pelayanan publik bagi seluruh warga.',
  'Pelayanan Administrasi',
  'Informasi Pembangunan',
  'Potensi Padukuhan',
  '/hero-desa.png'
)
ON CONFLICT (id) DO NOTHING;

