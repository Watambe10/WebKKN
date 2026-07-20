import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VillageImage from "../../components/VillageImage";
import AdminLoginButton from "../../components/AdminLoginButton";
import {
  formatDate,
  initialKegiatan,
  initialPengaturan,
  Kegiatan,
  PengaturanDesa,
} from "../../lib/data";
import { getSupabaseRows, supabaseRequest } from "../../lib/supabase";


export const revalidate = 1;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getKegiatanItem(slug: string): Promise<Kegiatan | null> {
  try {
    const data = await supabaseRequest<Kegiatan[]>("kegiatan", {
      query: `?slug=eq.${slug}`,
    });
    if (data.length) return data[0];
    return null;
  } catch {
    return null;
  }
}

async function getPengaturanData() {
  try {
    const data = await getSupabaseRows<PengaturanDesa>("pengaturan_desa", "id").catch(() => []);
    return data.length ? data[0] : initialPengaturan;
  } catch {
    return initialPengaturan;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kegiatanItem = await getKegiatanItem(slug);
  
  if (!kegiatanItem) {
    return {
      title: "Kegiatan Tidak Ditemukan",
    };
  }

  return {
    title: `${kegiatanItem.nama_kegiatan} | Padukuhan Plasan`,
    description: kegiatanItem.deskripsi.substring(0, 150) + "...",
  };
}

export default async function KegiatanDetailPage({ params }: Props) {
  const { slug } = await params;
  const [kegiatanItem, pengaturan] = await Promise.all([
    getKegiatanItem(slug),
    getPengaturanData(),
  ]);

  if (!kegiatanItem) {
    notFound();
  }

  const desa = {
    nama: pengaturan.nama,
    kecamatan: pengaturan.kecamatan,
    kabupaten: pengaturan.kabupaten,
    email: pengaturan.email,
    telepon: pengaturan.telepon,
  };

  const isMultiDay = kegiatanItem.tanggal_selesai && kegiatanItem.tanggal_mulai !== kegiatanItem.tanggal_selesai;

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1e2c26] font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#e0dacb] bg-[#1b352c] text-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link className="flex items-center gap-3 text-base font-bold transition duration-200 hover:opacity-90" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-desa.png" alt={`Logo ${desa.nama}`} className="h-8 w-auto object-contain" />
            <span className="tracking-tight">{desa.nama}</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <Link href="/#profil" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Profil</Link>
            <Link href="/monografi" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Monografi</Link>
            <Link href="/#berita" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Berita</Link>
            <Link href="/#kegiatan" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Kegiatan</Link>
            <Link href="/#galeri" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Galeri</Link>
            <Link href="/#kontak" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Kontak</Link>
          </div>
          <AdminLoginButton />
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/#kegiatan" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[#697a36] hover:text-[#1b352c] transition duration-200 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Dynamic Split Layout: Info Panel & Description */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Description Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <article className="bg-white rounded-2xl border border-[#e0dacb] overflow-hidden shadow-sm flex-grow">
              {/* Cover Image */}
              <div className="relative aspect-[21/10] w-full overflow-hidden border-b border-[#e0dacb] bg-[#fcfbfa]">
                <VillageImage
                  src={kegiatanItem.gambar || "/hero-desa.png"}
                  alt={kegiatanItem.nama_kegiatan}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="px-6 py-8 sm:px-8 sm:py-8">
                {/* Title */}
                <span className="text-xs font-bold uppercase tracking-wider text-[#697a36] block mb-2">Detail Agenda Warga</span>
                <h1 className="font-serif text-3xl font-bold leading-tight text-[#1e2c26] sm:text-4xl">
                  {kegiatanItem.nama_kegiatan}
                </h1>
                
                {/* Description Text */}
                <div className="mt-8 border-t border-[#e7e1d3] pt-8">
                  {kegiatanItem.deskripsi.split(/\n+/).map((para, index) => (
                    <p key={index} className="text-base sm:text-lg leading-8 text-[#3a4b42] mb-6 text-justify last:mb-0">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Quick Info Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-[#e0dacb] bg-white p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold font-serif text-[#1e2c26] border-b border-[#e7e1d3] pb-3">Informasi Pelaksanaan</h3>
              
              {/* Date Card */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#f6f3ec] text-[#697a36] rounded-xl border border-[#e7e1d3]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#697a36] uppercase tracking-wider block">Tanggal</span>
                  <p className="text-sm font-bold text-[#1e2c26] mt-0.5">
                    {isMultiDay 
                      ? `${formatDate(kegiatanItem.tanggal_mulai)} s.d. ${formatDate(kegiatanItem.tanggal_selesai)}` 
                      : formatDate(kegiatanItem.tanggal_mulai)
                    }
                  </p>
                </div>
              </div>

              {/* Time Card */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#f6f3ec] text-[#697a36] rounded-xl border border-[#e7e1d3]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#697a36] uppercase tracking-wider block">Waktu</span>
                  <p className="text-sm font-bold text-[#1e2c26] mt-0.5">
                    {kegiatanItem.waktu_mulai} - {kegiatanItem.waktu_selesai} WIB
                  </p>
                </div>
              </div>

              {/* Status/Accents */}
              <div className="mt-4 pt-4 border-t border-[#e7e1d3] text-center bg-[#f7f5ef] p-4 rounded-xl border border-[#e0dacb]">
                <span className="text-[10px] font-bold text-[#697a36] uppercase tracking-wider block">Agenda Resmi</span>
                <p className="text-xs text-[#5b6b63] mt-1 leading-relaxed">Seluruh warga Padukuhan Plasan diundang untuk menghadiri kegiatan ini secara aktif.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="kontak" className="bg-[#132720] px-5 py-12 text-white sm:px-8 border-t border-white/5 mt-auto">
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
