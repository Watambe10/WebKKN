import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLoginButton from "../../components/AdminLoginButton";
import GalleryDetailClient from "../../components/GalleryDetailClient";
import {
  GalleryItem,
  initialGallery,
  initialPengaturan,
  PengaturanDesa,
} from "../../lib/data";
import { getSupabaseRows, supabaseRequest } from "../../lib/supabase";

export const revalidate = 1;

type Props = {
  params: Promise<{ id: string }>;
};

async function getGalleryData(id: number) {
  try {
    const allGallery = await getSupabaseRows<GalleryItem>("gallery", "tanggal_upload");
    const items = allGallery.length ? allGallery : initialGallery;
    
    const currentItem = items.find(item => Number(item.id) === id) || null;
    if (!currentItem) return null;
    
    // Split images if there are multiple images separated by "|||"
    const currentImages = currentItem.gambar ? currentItem.gambar.split("|||") : [];
    
    let resultPhotos: GalleryItem[] = [];
    
    // Add current item's own images first
    currentImages.forEach((img, idx) => {
      resultPhotos.push({
        ...currentItem,
        id: Number(currentItem.id) * 1000 + idx, // Unique key for rendering
        gambar: img,
      });
    });
    
    // If fewer than 3 photos, fill up with other gallery items
    if (resultPhotos.length < 3) {
      const related = items.filter(item => Number(item.id) !== id);
      const sameCategory = related.filter(item => item.kategori === currentItem.kategori);
      
      let fillItems = sameCategory;
      if (fillItems.length < 3 - resultPhotos.length) {
        fillItems = [...fillItems, ...related.filter(item => item.kategori !== currentItem.kategori)];
      }
      
      fillItems.forEach((item) => {
        if (resultPhotos.length < 3) {
          const itemImgs = item.gambar ? item.gambar.split("|||") : [];
          itemImgs.forEach((img) => {
            if (resultPhotos.length < 3) {
              resultPhotos.push({
                ...item,
                gambar: img,
              });
            }
          });
        }
      });
    }

    const initialDisplayItem = {
      ...currentItem,
      gambar: currentImages[0] || "",
    };

    return {
      currentItem: initialDisplayItem,
      photos: resultPhotos.slice(0, 3)
    };
  } catch (error) {
    console.error("Gagal mengambil data galeri:", error);
    // Fallback to local data
    const currentItem = initialGallery.find(item => Number(item.id) === id) || null;
    if (!currentItem) return null;
    
    const currentImages = currentItem.gambar ? currentItem.gambar.split("|||") : [];
    let resultPhotos: GalleryItem[] = [];
    
    currentImages.forEach((img, idx) => {
      resultPhotos.push({
        ...currentItem,
        id: Number(currentItem.id) * 1000 + idx,
        gambar: img,
      });
    });
    
    if (resultPhotos.length < 3) {
      const related = initialGallery.filter(item => Number(item.id) !== id);
      const sameCategory = related.filter(item => item.kategori === currentItem.kategori);
      const fillItems = sameCategory.length >= 2 ? sameCategory : related;
      
      fillItems.forEach((item) => {
        if (resultPhotos.length < 3) {
          const itemImgs = item.gambar ? item.gambar.split("|||") : [];
          itemImgs.forEach((img) => {
            if (resultPhotos.length < 3) {
              resultPhotos.push({
                ...item,
                gambar: img,
              });
            }
          });
        }
      });
    }

    const initialDisplayItem = {
      ...currentItem,
      gambar: currentImages[0] || "",
    };

    return {
      currentItem: initialDisplayItem,
      photos: resultPhotos.slice(0, 3)
    };
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
  const { id } = await params;
  const galleryData = await getGalleryData(Number(id));
  
  if (!galleryData) {
    return {
      title: "Dokumentasi Tidak Ditemukan",
    };
  }

  return {
    title: `${galleryData.currentItem.judul} | Galeri Plasan`,
    description: galleryData.currentItem.deskripsi.substring(0, 150) + "...",
  };
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params;
  const [galleryData, pengaturan] = await Promise.all([
    getGalleryData(Number(id)),
    getPengaturanData(),
  ]);

  if (!galleryData) {
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
      <div className="flex-grow mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/#galeri" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[#697a36] hover:text-[#1b352c] transition duration-200 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Dynamic Interactive Gallery Content */}
        <GalleryDetailClient 
          initialItem={galleryData.currentItem} 
          photos={galleryData.photos} 
        />
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
