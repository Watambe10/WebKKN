import type { Metadata } from "next";
import Link from "next/link";
import AdminLoginButton from "../components/AdminLoginButton";
import { desa, formatNumber, initialMonografiDesa, MonografiDesa } from "../lib/data";
import { getSupabaseRows } from "../lib/supabase";

export const revalidate = 1;

export const metadata: Metadata = {
  title: `Monografi Desa | ${desa.nama}`,
  description:
    "Halaman monografi Padukuhan Plasan berisi data penduduk, kepala keluarga, dusun, RT, RW, dan luas wilayah.",
};

async function getMonografiData() {
  try {
    const monografiDesa = await getSupabaseRows<MonografiDesa>("monografi_desa", "tahun");
    return monografiDesa.length ? monografiDesa : initialMonografiDesa;
  } catch {
    return initialMonografiDesa;
  }
}

export default async function MonografiPage() {
  const monografiDesa = await getMonografiData();
  const monografiTerbaru = monografiDesa[0];
  const statCards = [
    {
      label: "Jumlah Penduduk",
      value: formatNumber(monografiTerbaru.jumlah_penduduk),
      detail: `${formatNumber(monografiTerbaru.jumlah_laki_laki)} laki-laki dan ${formatNumber(
        monografiTerbaru.jumlah_perempuan,
      )} perempuan`,
    },
    {
      label: "Kepala Keluarga",
      value: formatNumber(monografiTerbaru.jumlah_kk),
      detail: `Rekap tahun ${monografiTerbaru.tahun}`,
    },
    {
      label: "Wilayah",
      value: monografiTerbaru.luas_wilayah,
      detail: `${monografiTerbaru.jumlah_dusun} dusun, ${monografiTerbaru.jumlah_rw} RW, ${monografiTerbaru.jumlah_rt} RT`,
    },
    {
      label: "Administrasi",
      value: `${monografiTerbaru.jumlah_rt} RT`,
      detail: `Dalam ${monografiTerbaru.jumlah_rw} RW aktif`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1e2c26] font-sans">
      <header className="sticky top-0 z-20 border-b border-[#e0dacb] bg-[#1b352c] text-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link className="flex items-center gap-3 text-base font-bold transition duration-200 hover:opacity-90" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-desa.png" alt={`Logo ${desa.nama}`} className="h-8 w-auto object-contain" />
            <span className="tracking-tight">{desa.nama}</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="/#profil" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Profil</a>
            <Link href="/monografi" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Monografi</Link>
            <a href="/#berita" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Berita</a>
            <a href="/#kegiatan" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Kegiatan</a>
            <a href="/#galeri" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Galeri</a>
            <a href="/#kontak" className="opacity-80 transition duration-200 hover:opacity-100 hover:text-[#e7c765]">Kontak</a>
          </div>
          <AdminLoginButton />
        </nav>
      </header>

      <section className="bg-[#1b352c] px-5 py-24 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#e7c765]">
            Monografi Wilayah
          </p>
          <h1 className="max-w-3xl text-4xl font-bold font-serif leading-tight sm:text-5xl">
            Data Kependudukan & Wilayah {desa.nama}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
            Halaman ini menyajikan rekapitulasi data demografis, pembagian administratif,
            dan luas wilayah {desa.namaSingkat} untuk mewujudkan keterbukaan informasi bagi warga.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => (
            <article key={item.label} className="rounded-xl border border-[#e0dacb] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#697a36]/50 hover:-translate-y-0.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#697a36]">{item.label}</p>
              <p className="mt-3 text-3xl font-bold font-serif text-[#1e2c26]">{item.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b63]">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">Tabel Monografi</p>
            <h2 className="section-title">Rekapitulasi Data Per Tahun</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[#5b6b63]">
            Rincian data kependudukan Padukuhan secara berkala yang memuat jumlah penduduk, 
            kepala keluarga, pembagian wilayah administrasi, serta luas wilayah total.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e0dacb] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead className="bg-[#1b352c] text-white">
                <tr>
                  {["Tahun", "Penduduk", "Laki-laki", "Perempuan", "KK", "Dusun", "RT", "RW", "Luas Wilayah", "Keterangan"].map(
                    (heading) => (
                      <th key={heading} className="px-5 py-4 font-semibold tracking-wider uppercase text-xs">
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e1d3]">
                {monografiDesa.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-[#fcfbfa]">
                    <td className="px-5 py-4 font-bold text-[#1e2c26]">{item.tahun}</td>
                    <td className="px-5 py-4 font-medium">{formatNumber(item.jumlah_penduduk)}</td>
                    <td className="px-5 py-4 text-[#5b6b63]">{formatNumber(item.jumlah_laki_laki)}</td>
                    <td className="px-5 py-4 text-[#5b6b63]">{formatNumber(item.jumlah_perempuan)}</td>
                    <td className="px-5 py-4 text-[#5b6b63]">{formatNumber(item.jumlah_kk)}</td>
                    <td className="px-5 py-4 text-[#5b6b63]">{item.jumlah_dusun}</td>
                    <td className="px-5 py-4 text-[#5b6b63]">{item.jumlah_rt}</td>
                    <td className="px-5 py-4 text-[#5b6b63]">{item.jumlah_rw}</td>
                    <td className="px-5 py-4 text-[#5b6b63]">{item.luas_wilayah}</td>
                    <td className="px-5 py-4 text-[#5b6b63] max-w-xs truncate" title={item.keterangan}>{item.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
