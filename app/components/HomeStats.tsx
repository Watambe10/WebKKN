"use client";

import { useState } from "react";
import { MonografiDesa, formatNumber } from "../lib/data";

interface HomeStatsProps {
  monografiDesa: MonografiDesa[];
}

export default function HomeStats({ monografiDesa }: HomeStatsProps) {
  // Extract and sort years in descending order
  const years = Array.from(new Set(monografiDesa.map((m) => m.tahun))).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState<number>(years[0] || 2026);

  // Find data for selected year, fallback to first item
  const selectedData =
    monografiDesa.find((m) => m.tahun === selectedYear) || monografiDesa[0];

  const statCards = [
    {
      label: "Penduduk",
      value: formatNumber(selectedData.jumlah_penduduk),
      detail: `${formatNumber(selectedData.jumlah_laki_laki)} laki-laki, ${formatNumber(
        selectedData.jumlah_perempuan,
      )} perempuan`,
    },
    {
      label: "Kepala Keluarga",
      value: formatNumber(selectedData.jumlah_kk),
      detail: `Rekap KK Tahun ${selectedData.tahun}`,
    },
    {
      label: "Wilayah",
      value: selectedData.luas_wilayah,
      detail: `${selectedData.jumlah_rw} RW, ${selectedData.jumlah_rt} RT`,
    },
    {
      label: "Administrasi",
      value: `${selectedData.jumlah_rt} RT`,
      detail: "Terhubung dengan layanan desa dan warga",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Year Selector Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#e7c765]">
          Pilih Tahun Data Kependudukan:
        </span>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="appearance-none rounded-lg border border-white/25 bg-white/10 pl-4 pr-10 py-2 text-sm font-semibold text-white outline-none backdrop-blur-md focus:border-[#e7c765] focus:ring-1 focus:ring-[#e7c765] cursor-pointer transition-all duration-200"
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-[#1b352c] text-white py-2">
                Tahun {year}
              </option>
            ))}
          </select>
          {/* Custom Chevron Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/70">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/5 bg-white/5 p-4.5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/12 hover:border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e7c765]">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-bold font-serif">{item.value}</p>
            <p className="mt-2 text-xs leading-5 text-white/70">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
