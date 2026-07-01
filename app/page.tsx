import Link from "next/link";
import VillageImage from "./components/VillageImage";
import AdminLoginButton from "./components/AdminLoginButton";
import {
  Berita,
  desa,
  formatDate,
  formatNumber,
  GalleryItem,
  initialBerita,
  initialGallery,
  initialKegiatan,
  initialMonografiDesa,
  Kegiatan,
  MonografiDesa,
} from "./lib/data";
import { getSupabaseRows } from "./lib/supabase";

export const revalidate = 1;

async function getHomeData() {
  try {
    const [berita, kegiatan, gallery, monografiDesa] = await Promise.all([
      getSupabaseRows<Berita>("berita", "tanggal_publish"),
      getSupabaseRows<Kegiatan>("kegiatan", "tanggal_mulai"),
      getSupabaseRows<GalleryItem>("gallery", "tanggal_upload"),
      getSupabaseRows<MonografiDesa>("monografi_desa", "tahun"),
    ]);

    return {
      berita: berita.length ? berita : initialBerita,
      kegiatan: kegiatan.length ? kegiatan : initialKegiatan,
      gallery: gallery.length ? gallery : initialGallery,
      monografiDesa: monografiDesa.length ? monografiDesa : initialMonografiDesa,
    };
  } catch {
    return {
      berita: initialBerita,
      kegiatan: initialKegiatan,
      gallery: initialGallery,
      monografiDesa: initialMonografiDesa,
    };
  }
}

export default async function Home() {
  const { berita, kegiatan, gallery, monografiDesa } = await getHomeData();
  const monografiTerbaru = monografiDesa[0];
  const statCards = [
    {
      label: "Penduduk",
      value: formatNumber(monografiTerbaru.jumlah_penduduk),
      detail: `${formatNumber(monografiTerbaru.jumlah_laki_laki)} laki-laki, ${formatNumber(
        monografiTerbaru.jumlah_perempuan,
      )} perempuan`,
    },
    {
      label: "Kepala Keluarga",
      value: formatNumber(monografiTerbaru.jumlah_kk),
      detail: `Tahun data ${monografiTerbaru.tahun}`,
    },
    {
      label: "Wilayah",
      value: monografiTerbaru.luas_wilayah,
      detail: `${monografiTerbaru.jumlah_dusun} dusun, ${monografiTerbaru.jumlah_rw} RW, ${monografiTerbaru.jumlah_rt} RT`,
    },
    {
      label: "Administrasi",
      value: `${monografiTerbaru.jumlah_dusun} Dusun`,
      detail: "Terhubung dengan layanan desa dan warga",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1e2c26] font-sans">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-[#1b352c]/90 text-white backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a className="flex items-center gap-3 text-base font-bold transition duration-200 hover:opacity-90" href="#beranda">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-desa.png" alt={`Logo ${desa.nama}`} className="h-8 w-auto object-contain" />
            <span className="tracking-tight">{desa.nama}</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="#profil" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Profil</a>
            <Link href="/monografi" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Monografi</Link>
            <a href="#berita" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Berita</a>
            <a href="#kegiatan" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Kegiatan</a>
            <a href="#galeri" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Galeri</a>
            <a href="#kontak" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Kontak</a>
          </div>
          <AdminLoginButton />
        </nav>
      </header>

      <section id="beranda" className="relative flex min-h-[92vh] items-end overflow-hidden pt-16">
        <VillageImage
          src="/hero-desa.png"
          alt="Pemandangan desa dengan area persawahan dan permukiman"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#10271f]/55" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 pb-12 pt-24 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl text-white">
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl tracking-tight">
              {desa.nama}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
              Pusat informasi profil wilayah, pelayanan publik, berita, kegiatan, galeri,
              dan monografi {desa.namaSingkat} yang tersaji transparan untuk warga.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-md bg-[#e7c765] px-5 py-3 text-sm font-bold text-[#173328] transition hover:bg-[#f2d778] hover:scale-105 active:scale-95 duration-200 shadow-md"
                href="/monografi"
              >
                Lihat Monografi
              </Link>
              <a
                className="rounded-md border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 hover:border-white/80 hover:scale-105 active:scale-95 duration-200"
                href="#profil"
              >
                Profil Padukuhan
              </a>
            </div>
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/15 bg-white/8 p-5 text-white shadow-2xl backdrop-blur-md sm:grid-cols-2">
            {statCards.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/5 bg-white/5 p-4.5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/12 hover:border-white/20">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e7c765]">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold font-serif">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-white/70">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="profil" className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
        <div>
          <p className="section-kicker">Profil Wilayah</p>
          <h2 className="section-title">Ruang hidup warga Plasan yang bertumbuh lewat gotong royong.</h2>
        </div>
        <div className="space-y-8 text-base leading-8 text-[#4a5b52]">
          <p className="text-lg/relaxed text-[#3a4b42]">
            {desa.nama} merupakan wilayah agraris dengan potensi pertanian yang subur, UMKM
            rumah tangga yang produktif, kelembagaan warga yang solid, dan ruang kerukunan sosial yang kuat. Website
            ini dirancang sebagai pintu gerbang informasi resmi dan pelayanan publik bagi seluruh warga.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Pelayanan Administrasi", "Informasi Pembangunan", "Potensi Padukuhan"].map((item) => (
              <div key={item} className="rounded-xl border border-[#e0dacb] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#697a36]/50 hover:-translate-y-0.5">
                <p className="font-bold text-[#1e2c26] text-sm leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="berita" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 border-t border-[#e0dacb]">
        <div className="mb-12">
          <p className="section-kicker">Kabar Padukuhan</p>
          <h2 className="section-title">Berita & Informasi Terbaru</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {berita.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-xl border border-[#e0dacb] bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#697a36]/40 hover:-translate-y-1">
              <div className="relative aspect-[16/10] overflow-hidden">
                <VillageImage src={item.gambar} alt={item.judul} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#697a36]">
                  {formatDate(item.tanggal_publish)} • {item.penulis}
                </p>
                <h3 className="mt-3 text-lg font-bold leading-snug text-[#1e2c26] transition-colors duration-200 group-hover:text-[#697a36]">{item.judul}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5b6b63] line-clamp-3">{item.isi}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="kegiatan" className="bg-[#1b352c] py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12">
            <p className="section-kicker text-[#e7c765]">Agenda Padukuhan</p>
            <h2 className="max-w-2xl text-3xl font-bold font-serif sm:text-4xl leading-tight">Kegiatan Mendatang di Plasan</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {kegiatan.map((item) => (
              <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 shadow-sm hover:shadow-md border-l-4 border-l-[#e7c765]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#f2d778]">
                  {formatDate(item.tanggal_mulai)} • {item.waktu_mulai} - {item.waktu_selesai} WIB
                </p>
                <h3 className="mt-4 text-lg font-bold font-serif text-white">{item.nama_kegiatan}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{item.deskripsi}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="galeri" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="mb-12">
          <p className="section-kicker">Galeri Dokumentasi</p>
          <h2 className="section-title">Potret Kegiatan Plasan</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {gallery.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-xl border border-[#e0dacb] bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#697a36]/40 hover:-translate-y-1">
              <div className="relative aspect-square overflow-hidden">
                <VillageImage src={item.gambar} alt={item.judul} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="inline-block rounded bg-[#f6f3ec] px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#697a36]">
                  {item.kategori}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug text-[#1e2c26]">{item.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b63]">{item.deskripsi}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer id="kontak" className="bg-[#132720] px-5 py-12 text-white sm:px-8 border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-bold font-serif tracking-tight">{desa.nama}</p>
            <p className="mt-2 text-sm text-white/60">
              {desa.kecamatan}, {desa.kabupaten}
            </p>
          </div>
          <div className="text-sm leading-7 text-white/70 md:text-right">
            <p>Email: {desa.email}</p>
            <p>Telepon: {desa.telepon}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
