"use client";

import { useState } from "react";
import Link from "next/link";
import VillageImage from "./VillageImage";
import { formatDate, GalleryItem } from "../lib/data";

interface GalleryDetailClientProps {
  initialItem: GalleryItem;
  photos: GalleryItem[];
}

export default function GalleryDetailClient({ initialItem, photos }: GalleryDetailClientProps) {
  const [activeItem, setActiveItem] = useState<GalleryItem>(initialItem);

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-start">
      {/* Main Focus Column */}
      <div className="lg:col-span-8 space-y-6">
        <article className="bg-white rounded-2xl border border-[#e0dacb] overflow-hidden shadow-sm">
          {/* Main Photo Display */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#fcfbfa]">
            <VillageImage
              src={activeItem.gambar}
              alt={activeItem.judul}
              className="h-full w-full object-cover transition-all duration-500 animate-fade-in"
              key={activeItem.id} // Re-mounts image to trigger fade-in animation on switch
            />
          </div>
          
          <div className="px-6 py-8 sm:px-8">
            <span className="inline-block rounded bg-[#f6f3ec] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#697a36] mb-3">
              {activeItem.kategori}
            </span>
            <h1 className="font-serif text-2xl font-bold leading-tight text-[#1e2c26] sm:text-3xl">
              {activeItem.judul}
            </h1>
            
            {activeItem.tanggal_upload && (
              <p className="text-xs text-[#5b6b63] mt-2">
                Diunggah pada: {formatDate(activeItem.tanggal_upload)}
              </p>
            )}

            <div className="mt-6 border-t border-[#e7e1d3] pt-6">
              <p className="text-base leading-8 text-[#3a4b42] text-justify">
                {activeItem.deskripsi}
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* Collection Sidebar (The 3 Photos) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-[#e0dacb] bg-white p-6 shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1e2c26] border-b border-[#e7e1d3] pb-2">
              Koleksi Dokumentasi
            </h3>
          </div>

          {/* Grid of 3 Photos (including the currently active one) */}
          <div className="grid gap-3 grid-cols-3 lg:grid-cols-1">
            {photos.map((item) => {
              const isActive = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`group relative aspect-square w-full overflow-hidden rounded-xl border transition-all duration-300 text-left cursor-pointer focus:outline-none ${
                    isActive
                      ? "border-[#697a36] ring-2 ring-[#697a36]/30 opacity-100 scale-[1.02]"
                      : "border-[#e0dacb] opacity-60 hover:opacity-100 hover:scale-[1.01]"
                  }`}
                  aria-label={`Lihat foto: ${item.judul}`}
                >
                  <VillageImage
                    src={item.gambar}
                    alt={item.judul}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-center bg-[#f7f5ef] p-4 rounded-xl border border-[#e0dacb]">
            <span className="text-[10px] font-bold text-[#697a36] uppercase tracking-wider block">
              Plasan Terbuka & Transparan
            </span>
            <p className="text-[11px] text-[#5b6b63] mt-1.5 leading-relaxed">
              Dokumentasi foto kegiatan di padukuhan diambil secara real-time dan dikelola secara mandiri oleh tim KKN dan pengurus padukuhan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
