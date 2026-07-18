import Link from "next/link";
import VillageImage from "./components/VillageImage";
import AdminLoginButton from "./components/AdminLoginButton";
import HomeStats from "./components/HomeStats";
import ScrollContainer from "./components/ScrollContainer";
import {
  Berita,
  desa as staticDesa,
  formatDate,
  GalleryItem,
  initialBerita,
  initialGallery,
  initialKegiatan,
  initialMonografiDesa,
  initialPengaturan,
  Kegiatan,
  MonografiDesa,
  PengaturanDesa,
} from "./lib/data";
import { getSupabaseRows } from "./lib/supabase";

export const revalidate = 1;

async function getHomeData() {
  try {
    const [berita, kegiatan, gallery, monografiDesa, pengaturanRows] = await Promise.all([
      getSupabaseRows<Berita>("berita", "tanggal_publish"),
      getSupabaseRows<Kegiatan>("kegiatan", "tanggal_mulai"),
      getSupabaseRows<GalleryItem>("gallery", "tanggal_upload"),
      getSupabaseRows<MonografiDesa>("monografi_desa", "tahun"),
      getSupabaseRows<PengaturanDesa>("pengaturan_desa", "id").catch(() => []),
    ]);

    return {
      berita: berita.length ? berita : initialBerita,
      kegiatan: kegiatan.length ? kegiatan : initialKegiatan,
      gallery: gallery.length ? gallery : initialGallery,
      monografiDesa: monografiDesa.length ? monografiDesa : initialMonografiDesa,
      pengaturan: pengaturanRows && pengaturanRows.length ? pengaturanRows[0] : initialPengaturan,
    };
  } catch (error) {
    console.error("Gagal mengambil data dari Supabase (Homepage):", error);
    return {
      berita: initialBerita,
      kegiatan: initialKegiatan,
      gallery: initialGallery,
      monografiDesa: initialMonografiDesa,
      pengaturan: initialPengaturan,
    };
  }
}

export default async function Home() {
  const { berita, kegiatan, gallery, monografiDesa, pengaturan } = await getHomeData();
  const monografiTerbaru = monografiDesa[0];

  const desa = {
    nama: pengaturan.nama,
    namaSingkat: pengaturan.nama_singkat,
    kecamatan: pengaturan.kecamatan,
    kabupaten: pengaturan.kabupaten,
    email: pengaturan.email,
    telepon: pengaturan.telepon,
    heroJudul: pengaturan.hero_judul,
    heroDeskripsi: pengaturan.hero_deskripsi,
    profilJudul: pengaturan.profil_judul,
    profilDeskripsi: pengaturan.profil_deskripsi,
    profilKategori1: pengaturan.profil_kategori_1,
    profilKategori2: pengaturan.profil_kategori_2,
    profilKategori3: pengaturan.profil_kategori_3,
    heroBgMedia: pengaturan.hero_bg_media || "/hero-desa.png",
  };

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
        {(() => {
          const isVideo = desa.heroBgMedia.startsWith("data:video/") || desa.heroBgMedia.endsWith(".mp4") || desa.heroBgMedia.endsWith(".webm") || desa.heroBgMedia.endsWith(".mov") || desa.heroBgMedia.endsWith(".ogg");
          if (isVideo) {
            return (
              <video
                src={desa.heroBgMedia}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            );
          }
          return (
            <VillageImage
              src={desa.heroBgMedia}
              alt="Pemandangan desa dengan area persawahan dan permukiman"
              className="absolute inset-0 h-full w-full object-cover"
            />
          );
        })()}
        <div className="absolute inset-0 bg-[#10271f]/55" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 pb-12 pt-24 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl text-white">
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl tracking-tight">
              {desa.heroJudul}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
              {desa.heroDeskripsi}
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
          <div className="rounded-2xl border border-white/15 bg-white/8 p-5 text-white shadow-2xl backdrop-blur-md w-full">
            <HomeStats monografiDesa={monografiDesa} />
          </div>
        </div>
      </section>

      <section id="profil" className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
        <div>
          <p className="section-kicker">Profil Wilayah</p>
          <h2 className="section-title">{desa.profilJudul}</h2>
        </div>
        <div className="space-y-8 text-base leading-8 text-[#4a5b52]">
          <p className="text-lg/relaxed text-[#3a4b42]">
            {desa.profilDeskripsi}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[desa.profilKategori1, desa.profilKategori2, desa.profilKategori3].map((item) => (
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
        <ScrollContainer className="grid gap-6 lg:grid-cols-3" itemCount={berita.length}>
          {berita.map((item) => (
            <Link 
              key={item.id} 
              href={`/berita/${item.slug}`}
              className={`group overflow-hidden rounded-xl border border-[#e0dacb] bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#697a36]/40 hover:-translate-y-1 flex flex-col cursor-pointer ${
                berita.length > 3 ? "w-[290px] sm:w-[360px] shrink-0 snap-start" : "w-full"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#fcfbfa]">
                <VillageImage src={item.gambar} alt={item.judul} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#697a36]">
                  {formatDate(item.tanggal_publish)} • {item.penulis}
                </p>
                <h3 className="mt-3 text-lg font-bold leading-snug text-[#1e2c26] transition-colors duration-200 group-hover:text-[#697a36]">{item.judul}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5b6b63] line-clamp-3 flex-grow">{item.isi}</p>
                <span className="mt-4 text-xs font-bold text-[#697a36] inline-flex items-center gap-1 group-hover:text-[#1b352c] transition-colors">
                  Baca Selengkapnya
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </ScrollContainer>
      </section>

      <section id="kegiatan" className="bg-[#1b352c] py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12">
            <p className="section-kicker text-[#e7c765]">Agenda Padukuhan</p>
            <h2 className="max-w-2xl text-3xl font-bold font-serif sm:text-4xl leading-tight">Kegiatan Mendatang di Plasan</h2>
          </div>
          <ScrollContainer className="grid gap-6 lg:grid-cols-3" itemCount={kegiatan.length}>
            {kegiatan.map((item) => (
              <Link 
                key={item.id} 
                href={`/kegiatan/${item.slug}`}
                className={`group rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 shadow-sm hover:shadow-md border-l-4 border-l-[#e7c765] flex flex-col cursor-pointer ${
                  kegiatan.length > 3 ? "w-[290px] sm:w-[360px] shrink-0 snap-start" : "w-full"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#f2d778]">
                  {formatDate(item.tanggal_mulai)} • {item.waktu_mulai} - {item.waktu_selesai} WIB
                </p>
                <h3 className="mt-4 text-lg font-bold font-serif text-white group-hover:text-[#e7c765] transition-colors">{item.nama_kegiatan}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-3 flex-grow">{item.deskripsi}</p>
                <span className="mt-4 text-xs font-bold text-[#e7c765] inline-flex items-center gap-1 group-hover:text-white transition-colors">
                  Lihat Detail Agenda
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              </Link>
            ))}
          </ScrollContainer>
        </div>
      </section>

      <section id="galeri" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="mb-12">
          <p className="section-kicker">Galeri Dokumentasi</p>
          <h2 className="section-title">Potret Kegiatan Plasan</h2>
        </div>
        <ScrollContainer className="grid gap-6 md:grid-cols-3" itemCount={gallery.length}>
          {gallery.map((item) => (
            <Link 
              key={item.id} 
              href={`/galeri/${item.id}`}
              className={`group overflow-hidden rounded-xl border border-[#e0dacb] bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#697a36]/40 hover:-translate-y-1 flex flex-col cursor-pointer ${
                gallery.length > 3 ? "w-[290px] sm:w-[360px] shrink-0 snap-start" : "w-full"
              }`}
            >
              <div className="relative aspect-square overflow-hidden">
                <VillageImage src={item.gambar ? item.gambar.split("|||")[0] : ""} alt={item.judul} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <span className="inline-block self-start rounded bg-[#f6f3ec] px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#697a36]">
                  {item.kategori}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug text-[#1e2c26] group-hover:text-[#697a36] transition-colors">{item.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b63] flex-grow line-clamp-3">{item.deskripsi}</p>
                <span className="mt-4 text-xs font-bold text-[#697a36] inline-flex items-center gap-1 group-hover:text-[#1b352c] transition-colors">
                  Lihat Dokumentasi
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </ScrollContainer>
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
