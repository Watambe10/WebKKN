import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VillageImage from "../../components/VillageImage";
import AdminLoginButton from "../../components/AdminLoginButton";
import {
  Berita,
  formatDate,
  initialBerita,
  initialPengaturan,
  PengaturanDesa,
} from "../../lib/data";
import { getSupabaseRows, supabaseRequest } from "../../lib/supabase";


export const revalidate = 1;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBeritaItem(slug: string): Promise<Berita | null> {
  try {
    const data = await supabaseRequest<Berita[]>("berita", {
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
  const beritaItem = await getBeritaItem(slug);
  
  if (!beritaItem) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  return {
    title: `${beritaItem.judul} | Padukuhan Plasan`,
    description: beritaItem.isi.substring(0, 150) + "...",
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const [beritaItem, pengaturan] = await Promise.all([
    getBeritaItem(slug),
    getPengaturanData(),
  ]);

  if (!beritaItem) {
    notFound();
  }

  const desa = {
    nama: pengaturan.nama,
    kecamatan: pengaturan.kecamatan,
    kabupaten: pengaturan.kabupaten,
    email: pengaturan.email,
    telepon: pengaturan.telepon,
  };

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
      <div className="flex-grow mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/#berita" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[#697a36] hover:text-[#1b352c] transition duration-200 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Article Metadata & Header */}
        <article className="bg-white rounded-2xl border border-[#e0dacb] overflow-hidden shadow-sm">
          {/* Cover Image */}
          <div className="relative aspect-[21/9] w-full overflow-hidden border-b border-[#e0dacb] bg-[#fcfbfa]">
            <VillageImage
              src={beritaItem.gambar}
              alt={beritaItem.judul}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-wider text-[#697a36]">
              <span>{formatDate(beritaItem.tanggal_publish)}</span>
              <span className="text-[#e0dacb]">•</span>
              <span>Ditulis oleh: {beritaItem.penulis}</span>
            </div>

            {/* Title */}
            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#1e2c26] sm:text-4xl">
              {beritaItem.judul}
            </h1>

            <div className="mt-8 border-t border-[#e7e1d3] pt-8">
              {/* Render content paragraphs */}
              {beritaItem.isi.split(/\n+/).map((para, index) => (
                <p key={index} className="text-base sm:text-lg leading-8 text-[#3a4b42] mb-6 text-justify last:mb-0">
                  {para.trim()}
                </p>
              ))}
            </div>
          </div>
        </article>
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
