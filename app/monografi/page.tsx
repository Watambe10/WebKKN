import type { Metadata } from "next";
import Link from "next/link";
import AdminLoginButton from "../components/AdminLoginButton";
import MapViewer from "../components/MapViewer";
import { desa, formatNumber, initialMonografiDesa, MonografiDesa } from "../lib/data";
import { getSupabaseRows } from "../lib/supabase";

export const revalidate = 1;

export const metadata: Metadata = {
  title: `Monografi Desa | ${desa.nama}`,
  description:
    "Halaman monografi Padukuhan Plasan berisi data penduduk, kepala keluarga, dusun, RT, RW, tingkat pendidikan, struktur kepengurusan RT/RW, dan luas wilayah.",
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
  const monografiTerbaru = monografiDesa[0] || initialMonografiDesa[0];

  const totalPenduduk = monografiTerbaru.jumlah_penduduk || 1;
  const pctAnak = (((monografiTerbaru.jumlah_anak || 0) / totalPenduduk) * 100);
  const pctBalita = (((monografiTerbaru.jumlah_balita || 0) / totalPenduduk) * 100);
  
  const pctPaud = (((monografiTerbaru.pendidikan_paud || 0) / totalPenduduk) * 100);
  const pctSd = (((monografiTerbaru.pendidikan_sd || 0) / totalPenduduk) * 100);
  const pctSmp = (((monografiTerbaru.pendidikan_smp || 0) / totalPenduduk) * 100);
  const pctSma = (((monografiTerbaru.pendidikan_sma || 0) / totalPenduduk) * 100);

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

      {/* Hero Section */}
      <section className="bg-[#1b352c] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#e7c765]">
            Monografi Wilayah
          </p>
          <h1 className="max-w-3xl text-4xl font-bold font-serif leading-tight sm:text-5xl">
            Data Kependudukan & Wilayah {desa.nama}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
            Penyajian informasi data kependudukan terbaru, peta administratif, jenjang pendidikan, 
            dan kepengurusan RT/RW secara terpadu di {desa.namaSingkat}.
          </p>
        </div>
      </section>

      {/* Main Core Stat Cards */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
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

      {/* Regional Map & Demographics Split Layout */}
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 grid gap-8 lg:grid-cols-12">
        {/* Peta Wilayah Column */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-xl border border-[#e0dacb] bg-white p-6 shadow-sm flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-[#1e2c26] font-serif mb-2">Peta Wilayah</h3>
            <p className="text-sm text-[#5b6b63] mb-6">Peta administratif batas wilayah {desa.nama}.</p>
            
            <MapViewer 
              src={monografiTerbaru.peta_wilayah} 
              alt="Peta Wilayah Padukuhan Plasan" 
            />
          </div>
        </div>

        {/* Detailed Stats Column (Children, Toddlers, Education) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Children & Toddlers Stats Card */}
          <div className="rounded-xl border border-[#e0dacb] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1e2c26] font-serif mb-4">Detail Usia Rentan</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#fcfbfa] border border-[#e7e1d3] rounded-lg p-4 transition hover:border-[#697a36]/30">
                <span className="text-xs font-bold text-[#697a36] uppercase tracking-wider block">Jumlah Anak</span>
                <span className="text-2xl font-bold block mt-2 text-[#1e2c26]">{formatNumber(monografiTerbaru.jumlah_anak || 0)} <span className="text-sm font-medium text-[#5b6b63]">jiwa</span></span>
                <span className="text-xs text-[#5b6b63] mt-1 block">{(pctAnak).toFixed(1)}% dari total warga</span>
              </div>
              <div className="bg-[#fcfbfa] border border-[#e7e1d3] rounded-lg p-4 transition hover:border-[#697a36]/30">
                <span className="text-xs font-bold text-[#697a36] uppercase tracking-wider block">Jumlah Balita</span>
                <span className="text-2xl font-bold block mt-2 text-[#1e2c26]">{formatNumber(monografiTerbaru.jumlah_balita || 0)} <span className="text-sm font-medium text-[#5b6b63]">jiwa</span></span>
                <span className="text-xs text-[#5b6b63] mt-1 block">{(pctBalita).toFixed(1)}% dari total warga</span>
              </div>
            </div>
          </div>

          {/* Education Statistics Card */}
          <div className="rounded-xl border border-[#e0dacb] bg-white p-6 shadow-sm flex-grow">
            <h3 className="text-lg font-bold text-[#1e2c26] font-serif mb-2">Tingkat Pendidikan</h3>
            <p className="text-sm text-[#5b6b63] mb-6">Persentase warga yang sedang/telah menempuh jenjang pendidikan.</p>

            <div className="space-y-5">
              {/* PAUD */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-[#4a5b52]">
                  <span>Pendidikan PAUD</span>
                  <span className="font-bold text-[#1e2c26]">{formatNumber(monografiTerbaru.pendidikan_paud || 0)} jiwa ({(pctPaud).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-[#e0dacb]/60 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#697a36] h-full rounded-full transition-all duration-500" style={{ width: `${pctPaud}%` }} />
                </div>
              </div>

              {/* SD */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-[#4a5b52]">
                  <span>Pendidikan SD / Sederajat</span>
                  <span className="font-bold text-[#1e2c26]">{formatNumber(monografiTerbaru.pendidikan_sd || 0)} jiwa ({(pctSd).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-[#e0dacb]/60 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#697a36] h-full rounded-full transition-all duration-500" style={{ width: `${pctSd}%` }} />
                </div>
              </div>

              {/* SMP */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-[#4a5b52]">
                  <span>Pendidikan SMP / Sederajat</span>
                  <span className="font-bold text-[#1e2c26]">{formatNumber(monografiTerbaru.pendidikan_smp || 0)} jiwa ({(pctSmp).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-[#e0dacb]/60 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#697a36] h-full rounded-full transition-all duration-500" style={{ width: `${pctSmp}%` }} />
                </div>
              </div>

              {/* SMA */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-[#4a5b52]">
                  <span>Pendidikan SMA / Sederajat</span>
                  <span className="font-bold text-[#1e2c26]">{formatNumber(monografiTerbaru.pendidikan_sma || 0)} jiwa ({(pctSma).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-[#e0dacb]/60 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#697a36] h-full rounded-full transition-all duration-500" style={{ width: `${pctSma}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structure of RT & RW Section */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-8">
          <p className="section-kicker">Struktur Kepemimpinan</p>
          <h2 className="section-title">Struktur Ketua RW & Ketua RT</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5b6b63] max-w-2xl">
            Pembagian administrasi kepengurusan wilayah {desa.namaSingkat} yang terdiri dari 3 RW (Rukun Warga) dan 6 RT (Rukun Tetangga).
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* RW 1 */}
          <div className="rounded-xl border border-[#e0dacb] bg-white p-6 shadow-sm flex flex-col gap-4 border-t-4 border-t-[#697a36]">
            <div>
              <span className="text-xs font-bold text-[#697a36] uppercase tracking-wider block">Wilayah Administrasi</span>
              <h3 className="text-xl font-bold font-serif text-[#1e2c26] mt-1">Rukun Warga 01</h3>
              <p className="text-xs text-[#5b6b63] mt-0.5">Membawahi RT 01 dan RT 02</p>
            </div>
            
            <div className="bg-[#1b352c] text-white rounded-lg p-4 shadow-sm">
              <span className="text-[10px] font-bold text-[#e7c765] uppercase tracking-widest block">Ketua RW 01</span>
              <p className="text-base font-bold mt-1">{monografiTerbaru.ketua_rw_1 || "-"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-[#fcfbfa] border border-[#e7e1d3] rounded-lg p-3 text-center">
                <span className="text-[10px] font-bold text-[#697a36] uppercase block">Ketua RT 01</span>
                <p className="text-sm font-bold mt-1 text-[#1e2c26] truncate" title={monografiTerbaru.ketua_rt_1}>{monografiTerbaru.ketua_rt_1 || "-"}</p>
              </div>
              <div className="bg-[#fcfbfa] border border-[#e7e1d3] rounded-lg p-3 text-center">
                <span className="text-[10px] font-bold text-[#697a36] uppercase block">Ketua RT 02</span>
                <p className="text-sm font-bold mt-1 text-[#1e2c26] truncate" title={monografiTerbaru.ketua_rt_2}>{monografiTerbaru.ketua_rt_2 || "-"}</p>
              </div>
            </div>
          </div>

          {/* RW 2 */}
          <div className="rounded-xl border border-[#e0dacb] bg-white p-6 shadow-sm flex flex-col gap-4 border-t-4 border-t-[#697a36]">
            <div>
              <span className="text-xs font-bold text-[#697a36] uppercase tracking-wider block">Wilayah Administrasi</span>
              <h3 className="text-xl font-bold font-serif text-[#1e2c26] mt-1">Rukun Warga 02</h3>
              <p className="text-xs text-[#5b6b63] mt-0.5">Membawahi RT 03 dan RT 04</p>
            </div>
            
            <div className="bg-[#1b352c] text-white rounded-lg p-4 shadow-sm">
              <span className="text-[10px] font-bold text-[#e7c765] uppercase tracking-widest block">Ketua RW 02</span>
              <p className="text-base font-bold mt-1">{monografiTerbaru.ketua_rw_2 || "-"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-[#fcfbfa] border border-[#e7e1d3] rounded-lg p-3 text-center">
                <span className="text-[10px] font-bold text-[#697a36] uppercase block">Ketua RT 03</span>
                <p className="text-sm font-bold mt-1 text-[#1e2c26] truncate" title={monografiTerbaru.ketua_rt_3}>{monografiTerbaru.ketua_rt_3 || "-"}</p>
              </div>
              <div className="bg-[#fcfbfa] border border-[#e7e1d3] rounded-lg p-3 text-center">
                <span className="text-[10px] font-bold text-[#697a36] uppercase block">Ketua RT 04</span>
                <p className="text-sm font-bold mt-1 text-[#1e2c26] truncate" title={monografiTerbaru.ketua_rt_4}>{monografiTerbaru.ketua_rt_4 || "-"}</p>
              </div>
            </div>
          </div>

          {/* RW 3 */}
          <div className="rounded-xl border border-[#e0dacb] bg-white p-6 shadow-sm flex flex-col gap-4 border-t-4 border-t-[#697a36]">
            <div>
              <span className="text-xs font-bold text-[#697a36] uppercase tracking-wider block">Wilayah Administrasi</span>
              <h3 className="text-xl font-bold font-serif text-[#1e2c26] mt-1">Rukun Warga 03</h3>
              <p className="text-xs text-[#5b6b63] mt-0.5">Membawahi RT 05 dan RT 06</p>
            </div>
            
            <div className="bg-[#1b352c] text-white rounded-lg p-4 shadow-sm">
              <span className="text-[10px] font-bold text-[#e7c765] uppercase tracking-widest block">Ketua RW 03</span>
              <p className="text-base font-bold mt-1">{monografiTerbaru.ketua_rw_3 || "-"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-[#fcfbfa] border border-[#e7e1d3] rounded-lg p-3 text-center">
                <span className="text-[10px] font-bold text-[#697a36] uppercase block">Ketua RT 05</span>
                <p className="text-sm font-bold mt-1 text-[#1e2c26] truncate" title={monografiTerbaru.ketua_rt_5}>{monografiTerbaru.ketua_rt_5 || "-"}</p>
              </div>
              <div className="bg-[#fcfbfa] border border-[#e7e1d3] rounded-lg p-3 text-center">
                <span className="text-[10px] font-bold text-[#697a36] uppercase block">Ketua RT 06</span>
                <p className="text-sm font-bold mt-1 text-[#1e2c26] truncate" title={monografiTerbaru.ketua_rt_6}>{monografiTerbaru.ketua_rt_6 || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Monografi Table Section */}
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
                    <td className="px-5 py-4 text-[#5b6b63] max-w-xs whitespace-normal break-words" title={item.keterangan}>{item.keterangan}</td>
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

