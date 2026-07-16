import type { Metadata } from "next";
import {
  initialMonografiDesa,
  initialPengaturan,
  MonografiDesa,
  PengaturanDesa,
} from "../lib/data";
import { getSupabaseRows } from "../lib/supabase";
import MonografiClient from "./MonografiClient";

export const revalidate = 1;

export const metadata: Metadata = {
  title: `Monografi Desa | Padukuhan Plasan`,
  description:
    "Halaman monografi Padukuhan Plasan berisi data penduduk, kepala keluarga, RT, RW, tingkat pendidikan, struktur kepengurusan RT/RW, dan luas wilayah.",
};

async function getMonografiData() {
  try {
    const monografiDesa = await getSupabaseRows<MonografiDesa>("monografi_desa", "tahun");
    return monografiDesa.length ? monografiDesa : initialMonografiDesa;
  } catch (error) {
    console.error("Gagal mengambil data monografi dari Supabase:", error);
    return initialMonografiDesa;
  }
}

async function getPengaturanData() {
  try {
    const data = await getSupabaseRows<PengaturanDesa>("pengaturan_desa", "id").catch((error) => {
      console.error("Gagal mengambil data pengaturan_desa:", error);
      return [];
    });
    return data.length ? data[0] : initialPengaturan;
  } catch (error) {
    console.error("Gagal mengambil data pengaturan dari Supabase:", error);
    return initialPengaturan;
  }
}

export default async function MonografiPage() {
  const [monografiDesa, pengaturan] = await Promise.all([
    getMonografiData(),
    getPengaturanData(),
  ]);

  const desa = {
    nama: pengaturan.nama,
    namaSingkat: pengaturan.nama_singkat,
    kecamatan: pengaturan.kecamatan,
    kabupaten: pengaturan.kabupaten,
    email: pengaturan.email,
    telepon: pengaturan.telepon,
  };

  return <MonografiClient monografiDesa={monografiDesa} desa={desa} />;
}

