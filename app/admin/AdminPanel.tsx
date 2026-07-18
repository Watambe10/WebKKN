"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  desa,
  initialBerita,
  initialGallery,
  initialKegiatan,
  initialMonografiDesa,
  initialPengaturan,
} from "../lib/data";
import { supabaseRequest } from "../lib/supabase";

type AdminRecord = {
  id: number;
  [key: string]: string | number | null;
};

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "time" | "textarea" | "image" | "select";
  required?: boolean;
  options?: string[];
};

type ResourceConfig = {
  key: string;
  label: string;
  description: string;
  fields: FieldConfig[];
  initialData: AdminRecord[];
  orderBy: string;
  tableName: string;
  titleField: string;
};

const storagePrefix = "plasan-admin";
const emptyId = 0;

const resources: ResourceConfig[] = [
  {
    key: "berita",
    label: "Berita",
    description: "Kelola judul, isi berita, gambar, penulis, dan tanggal publikasi.",
    initialData: initialBerita as unknown as AdminRecord[],
    orderBy: "tanggal_publish",
    tableName: "berita",
    titleField: "judul",
    fields: [
      { name: "judul", label: "Judul", required: true },
      { name: "slug", label: "Slug" },
      { name: "isi", label: "Isi", type: "textarea", required: false },
      { name: "gambar", label: "Gambar", type: "image", required: false },
      { name: "penulis", label: "Penulis", required: false },
      { name: "tanggal_publish", label: "Tanggal Publish", type: "date", required: false },
    ],
  },
  {
    key: "kegiatan",
    label: "Kegiatan",
    description: "Kelola agenda, deskripsi, tanggal, waktu, dan gambar kegiatan desa.",
    initialData: initialKegiatan as unknown as AdminRecord[],
    orderBy: "tanggal_mulai",
    tableName: "kegiatan",
    titleField: "nama_kegiatan",
    fields: [
      { name: "nama_kegiatan", label: "Nama Kegiatan", required: true },
      { name: "slug", label: "Slug" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", required: false },
      { name: "tanggal_mulai", label: "Tanggal Mulai", type: "date", required: false },
      { name: "tanggal_selesai", label: "Tanggal Selesai", type: "date", required: false },
      { name: "waktu_mulai", label: "Waktu Mulai", type: "time", required: false },
      { name: "waktu_selesai", label: "Waktu Selesai", type: "time", required: false },
      { name: "gambar", label: "Gambar", type: "image", required: false },
    ],
  },
  {
    key: "gallery",
    label: "Galeri",
    description: "Kelola dokumentasi foto, kategori, deskripsi, dan tanggal unggah.",
    initialData: initialGallery as unknown as AdminRecord[],
    orderBy: "tanggal_upload",
    tableName: "gallery",
    titleField: "judul",
    fields: [
      { name: "judul", label: "Judul", required: true },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", required: false },
      { name: "gambar", label: "Gambar", type: "image", required: false },
      {
        name: "kategori",
        label: "Kategori",
        type: "select",
        required: true,
        options: ["Kegiatan Warga", "UMKM", "Potensi Wilayah"],
      },
      { name: "tanggal_upload", label: "Tanggal Upload", type: "date", required: false },
    ],
  },
  {
    key: "monografi",
    label: "Monografi",
    description: "Kelola data penduduk, pimpinan, kelompok usia, tingkat pendidikan, dan wilayah berdasarkan tahun.",
    initialData: initialMonografiDesa as unknown as AdminRecord[],
    orderBy: "tahun",
    tableName: "monografi_desa",
    titleField: "tahun",
    fields: [
      { name: "tahun", label: "Tahun", type: "number", required: true },
      { name: "nama_kepala_dusun", label: "Nama Kepala Dusun (Dukuh)", required: false },
      { name: "jumlah_penduduk", label: "Jumlah Penduduk", type: "number", required: false },
      { name: "jumlah_laki_laki", label: "Jumlah Laki-laki", type: "number", required: false },
      { name: "jumlah_perempuan", label: "Jumlah Perempuan", type: "number", required: false },
      { name: "jumlah_kk", label: "Jumlah KK", type: "number", required: false },
      { name: "jumlah_rt", label: "Jumlah RT", type: "number", required: false },
      { name: "jumlah_rw", label: "Jumlah RW", type: "number", required: false },
      { name: "luas_wilayah", label: "Luas Wilayah", required: false },
      { name: "jumlah_balita", label: "Jumlah Balita (0-4 tahun)", type: "number", required: false },
      { name: "jumlah_anak", label: "Jumlah Anak-anak (6-17 tahun)", type: "number", required: false },
      { name: "jumlah_lansia", label: "Jumlah Lansia (>=60 tahun)", type: "number", required: false },
      { name: "pendidikan_paud", label: "Pendidikan PAUD", type: "number", required: false },
      { name: "pendidikan_tk", label: "Pendidikan TK", type: "number", required: false },
      { name: "pendidikan_sd", label: "Pendidikan SD", type: "number", required: false },
      { name: "pendidikan_smp", label: "Pendidikan SMP", type: "number", required: false },
      { name: "pendidikan_sma", label: "Pendidikan SMA", type: "number", required: false },
      { name: "pendidikan_sarjana", label: "Pendidikan Sarjana", type: "number", required: false },
      { name: "ketua_rw_1", label: "Ketua RW", required: false },
      { name: "ketua_rt_1", label: "Ketua RT 1", required: false },
      { name: "ketua_rt_2", label: "Ketua RT 2", required: false },
      { name: "ketua_rt_3", label: "Ketua RT 3", required: false },
      { name: "ketua_rt_4", label: "Ketua RT 4", required: false },
      { name: "ketua_rt_5", label: "Ketua RT 5", required: false },
      { name: "ketua_rt_6", label: "Ketua RT 6", required: false },
      { name: "peta_wilayah", label: "Peta Wilayah (Gambar)", type: "image", required: false },
      { name: "keterangan", label: "Keterangan", type: "textarea", required: false },
    ],
  },
  {
    key: "pengaturan",
    label: "Pengaturan Desa",
    description: "Kelola teks umum website, judul, deskripsi, informasi kontak, dan profile.",
    initialData: [initialPengaturan] as unknown as AdminRecord[],
    orderBy: "id",
    tableName: "pengaturan_desa",
    titleField: "nama",
    fields: [
      { name: "nama", label: "Nama Padukuhan", required: true },
      { name: "nama_singkat", label: "Nama Singkat", required: false },
      { name: "kecamatan", label: "Kecamatan", required: false },
      { name: "kabupaten", label: "Kabupaten", required: false },
      { name: "email", label: "Email Kontak", required: false },
      { name: "telepon", label: "Telepon Kontak", required: false },
      { name: "hero_judul", label: "Judul Hero", required: false },
      { name: "hero_deskripsi", label: "Deskripsi Hero", type: "textarea", required: false },
      { name: "hero_bg_media", label: "Media Background Hero (Gambar atau Video)", type: "image", required: false },
      { name: "profil_judul", label: "Judul Profil", required: false },
      { name: "profil_deskripsi", label: "Deskripsi Profil", type: "textarea", required: false },
      { name: "profil_kategori_1", label: "Kategori Profil 1", required: false },
      { name: "profil_kategori_2", label: "Kategori Profil 2", required: false },
      { name: "profil_kategori_3", label: "Kategori Profil 3", required: false },
    ],
  },
];

const makeEmptyRecord = (resource: ResourceConfig): AdminRecord => {
  const record: AdminRecord = { id: emptyId };

  resource.fields.forEach((field) => {
    record[field.name] = field.type === "number" ? 0 : "";
  });

  return record;
};

const loadSession = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(`${storagePrefix}-session`) === "true";
};

const loadData = () => {
  return resources.reduce<Record<string, AdminRecord[]>>((collection, resource) => {
    collection[resource.key] = resource.initialData;
    return collection;
  }, {});
};

const readImageFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi error yang tidak diketahui.";
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(loadSession);
  const [activeKey, setActiveKey] = useState(resources[0].key);
  const [data, setData] = useState<Record<string, AdminRecord[]>>(loadData);
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [imageDrafts, setImageDrafts] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info" | "">("");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "add" | "edit" | "delete" | "reset";
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "add",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const activeResource = useMemo(
    () => resources.find((resource) => resource.key === activeKey) ?? resources[0],
    [activeKey],
  );

  const activeRows = data[activeResource.key] ?? activeResource.initialData;
  const formRecord = editing ?? makeEmptyRecord(activeResource);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let ignore = false;

    supabaseRequest<AdminRecord[]>(activeResource.tableName, {
      query: activeResource.key === "pengaturan" ? "?select=*" : `?select=*&order=${activeResource.orderBy}.desc`,
    })
      .then((rows) => {
        if (!ignore) {
          setData((current) => ({ ...current, [activeResource.key]: rows }));
          setStatusMessage("");
          setStatusType("");
          if (activeResource.key === "pengaturan") {
            setEditing(rows.length ? rows[0] : { ...initialPengaturan } as unknown as AdminRecord);
          }
        }
      })
      .catch((error) => {
        if (!ignore) {
          const errMsg = error instanceof Error ? error.message : String(error);
          if (errMsg.includes("PGRST205") || errMsg.includes("Could not find the table")) {
            setStatusMessage(`Tabel '${activeResource.tableName}' belum dibuat di database. Silakan jalankan script SQL migrasi database Anda.`);
          } else {
            setStatusMessage(`Gagal memuat data: ${errMsg}`);
          }
          setStatusType("error");
          if (activeResource.key === "pengaturan") {
            setEditing({ ...initialPengaturan } as unknown as AdminRecord);
          }
        }
      });

    return () => {
      ignore = true;
    };
  }, [activeResource, isAuthenticated]);

  const saveRows = (resourceKey: string, rows: AdminRecord[]) => {
    setData((current) => ({ ...current, [resourceKey]: rows }));
  };

  const reloadRows = async () => {
    const rows = await supabaseRequest<AdminRecord[]>(activeResource.tableName, {
      query: activeResource.key === "pengaturan" ? "?select=*" : `?select=*&order=${activeResource.orderBy}.desc`,
    });
    saveRows(activeResource.key, rows);
  };

  const handleImageFile = async (fieldName: string, file?: File) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const imageData = await readImageFile(file);
    setImageDrafts((current) => ({ ...current, [fieldName]: imageData }));
  };

  const handleLogout = () => {
    window.localStorage.removeItem(`${storagePrefix}-session`);
    setIsAuthenticated(false);
    setEditing(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextRecord: AdminRecord = { id: formRecord.id };

    activeResource.fields.forEach((field) => {
      if (field.type === "image") {
        const currentImage = String(formRecord[field.name] ?? "");
        const finalImg = imageDrafts[field.name] || currentImage;
        nextRecord[field.name] = finalImg === "" ? null : finalImg;
        return;
      }

      const rawValue = String(formData.get(field.name) ?? "");
      if (rawValue.trim() === "") {
        nextRecord[field.name] = null;
      } else {
        nextRecord[field.name] = field.type === "number" ? Number(rawValue) : rawValue;
      }
    });

    // Validasi Form
    let validationError = "";

    // 1. Validasi dasar: tidak boleh kosong untuk kolom required
    for (const field of activeResource.fields) {
      const value = nextRecord[field.name];

      if (field.required) {
        if (value === undefined || value === null || String(value).trim() === "") {
          validationError = `Kolom "${field.label}" tidak boleh kosong.`;
          break;
        }
        if (field.type === "number") {
          const numVal = Number(value);
          if (isNaN(numVal)) {
            validationError = `Kolom "${field.label}" harus berupa angka yang valid.`;
            break;
          }
        }
      }
    }

    // 2. Validasi format spesifik sesuai dengan jenis data
    if (!validationError) {
      if (activeResource.key === "berita") {
        if (nextRecord.judul && String(nextRecord.judul).trim().length < 3) {
          validationError = "Judul berita minimal harus terdiri dari 3 karakter.";
        } else if (nextRecord.isi && String(nextRecord.isi).trim().length < 10) {
          validationError = "Isi berita minimal harus terdiri dari 10 karakter.";
        }
      } else if (activeResource.key === "kegiatan") {
        if (nextRecord.nama_kegiatan && String(nextRecord.nama_kegiatan).trim().length < 3) {
          validationError = "Nama kegiatan minimal harus terdiri dari 3 karakter.";
        } else if (nextRecord.deskripsi && String(nextRecord.deskripsi).trim().length < 10) {
          validationError = "Deskripsi kegiatan minimal harus terdiri dari 10 karakter.";
        } else {
          // Validasi Urutan Tanggal & Waktu (hanya jika keduanya terisi)
          if (nextRecord.tanggal_mulai && nextRecord.tanggal_selesai) {
            const startDate = new Date(String(nextRecord.tanggal_mulai));
            const endDate = new Date(String(nextRecord.tanggal_selesai));
            if (startDate > endDate) {
              validationError = "Tanggal selesai kegiatan tidak boleh mendahului tanggal mulai.";
            } else if (String(nextRecord.tanggal_mulai) === String(nextRecord.tanggal_selesai)) {
              const timeStart = String(nextRecord.waktu_mulai || "");
              const timeEnd = String(nextRecord.waktu_selesai || "");
              if (timeStart && timeEnd && timeStart >= timeEnd) {
                validationError = "Waktu selesai harus setelah waktu mulai untuk kegiatan di hari yang sama.";
              }
            }
          }
        }
      } else if (activeResource.key === "gallery") {
        if (nextRecord.judul && String(nextRecord.judul).trim().length < 3) {
          validationError = "Judul galeri minimal harus terdiri dari 3 karakter.";
        } else if (nextRecord.deskripsi && String(nextRecord.deskripsi).trim().length < 5) {
          validationError = "Deskripsi galeri minimal harus terdiri dari 5 karakter.";
        }
      } else if (activeResource.key === "monografi") {
        const tahun = Number(nextRecord.tahun);
        const totalPenduduk = Number(nextRecord.jumlah_penduduk || 0);
        const laki = Number(nextRecord.jumlah_laki_laki || 0);
        const perempuan = Number(nextRecord.jumlah_perempuan || 0);
        const kk = Number(nextRecord.jumlah_kk || 0);
        const rt = Number(nextRecord.jumlah_rt || 0);
        const rw = Number(nextRecord.jumlah_rw || 0);
        const balita = Number(nextRecord.jumlah_balita || 0);
        const anak = Number(nextRecord.jumlah_anak || 0);
        const lansia = Number(nextRecord.jumlah_lansia || 0);
        const paud = Number(nextRecord.pendidikan_paud || 0);
        const tk = Number(nextRecord.pendidikan_tk || 0);
        const sd = Number(nextRecord.pendidikan_sd || 0);
        const smp = Number(nextRecord.pendidikan_smp || 0);
        const sma = Number(nextRecord.pendidikan_sma || 0);
        const sarjana = Number(nextRecord.pendidikan_sarjana || 0);

        if (tahun < 1900 || tahun > 2100) {
          validationError = "Tahun monografi harus valid (antara tahun 1900 dan 2100).";
        } else if (
          totalPenduduk < 0 ||
          laki < 0 ||
          perempuan < 0 ||
          kk < 0 ||
          rt < 0 ||
          rw < 0 ||
          anak < 0 ||
          balita < 0 ||
          lansia < 0 ||
          paud < 0 ||
          tk < 0 ||
          sd < 0 ||
          smp < 0 ||
          sma < 0 ||
          sarjana < 0
        ) {
          validationError = "Semua data angka monografi tidak boleh bernilai negatif.";
        } else if (totalPenduduk > 0 && (laki + perempuan !== totalPenduduk)) {
          validationError = `Jumlah penduduk laki-laki (${laki}) ditambah perempuan (${perempuan}) harus sama dengan total jumlah penduduk (${totalPenduduk}).`;
        } else if (kk > totalPenduduk) {
          validationError = "Jumlah Kepala Keluarga (KK) tidak boleh melebihi total jumlah penduduk.";
        } else if (anak + balita + lansia > totalPenduduk) {
          validationError = "Jumlah balita, anak-anak, dan lansia tidak boleh melebihi total jumlah penduduk.";
        } else if (paud + tk + sd + smp + sma + sarjana > totalPenduduk) {
          validationError = "Jumlah warga berdasarkan tingkat pendidikan tidak boleh melebihi total jumlah penduduk.";
        }
      }
    }

    // Jika terjadi error validasi, tampilkan pesan error dan hentikan simpan
    if (validationError) {
      setStatusMessage(validationError);
      setStatusType("error");
      return;
    }

    if ("slug" in nextRecord) {
      const titleValue = String(nextRecord[activeResource.titleField] ?? "");
      const submittedSlug = String(nextRecord.slug ?? "");
      const fallbackSlug = slugify(titleValue) || `${activeResource.key}-${Date.now()}`;
      nextRecord.slug =
        nextRecord.id === emptyId
          ? `${slugify(submittedSlug) || fallbackSlug}-${Date.now()}`
          : slugify(submittedSlug) || fallbackSlug;
    }

    const executeSubmit = async () => {
      const { id, ...payload } = nextRecord;

      try {
        if (activeResource.key === "pengaturan") {
          const exists = data[activeResource.key] && data[activeResource.key].length > 0;
          if (exists) {
            await supabaseRequest<AdminRecord[]>(activeResource.tableName, {
              method: "PATCH",
              query: `?id=eq.1`,
              body: { id: 1, ...payload },
            });
          } else {
            await supabaseRequest<AdminRecord[]>(activeResource.tableName, {
              method: "POST",
              body: { id: 1, ...payload },
            });
          }
          await reloadRows();
          setStatusMessage("Pengaturan desa berhasil disimpan.");
          setStatusType("success");
        } else {
          const isInsert = id === emptyId;
          if (isInsert) {
            await supabaseRequest<AdminRecord[]>(activeResource.tableName, {
              method: "POST",
              body: payload,
            });
          } else {
            await supabaseRequest<AdminRecord[]>(activeResource.tableName, {
              method: "PATCH",
              query: `?id=eq.${id}`,
              body: payload,
            });
          }

          await reloadRows();
          setEditing(null);
          setImageDrafts({});
          setStatusMessage(isInsert ? "Data berhasil ditambahkan." : "Data berhasil diubah.");
          setStatusType("success");
          form.reset();
        }
      } catch (error) {
        setStatusMessage(`Data gagal disimpan: ${getErrorMessage(error)}`);
        setStatusType("error");
      }
    };

    const isEdit = formRecord.id !== emptyId || activeResource.key === "pengaturan";
    const titleVal = activeResource.key === "pengaturan" ? "Pengaturan Website" : String(nextRecord[activeResource.titleField] ?? "");

    setConfirmModal({
      isOpen: true,
      type: isEdit ? "edit" : "add",
      title: isEdit ? "Konfirmasi Simpan Perubahan" : "Konfirmasi Tambah Data",
      message: isEdit
        ? `Apakah Anda yakin ingin menyimpan perubahan pada data "${titleVal}"?`
        : `Apakah Anda yakin ingin menambahkan data baru "${titleVal}"?`,
      onConfirm: () => {
        executeSubmit();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await supabaseRequest<AdminRecord[]>(activeResource.tableName, {
        method: "DELETE",
        query: `?id=eq.${id}`,
      });
      await reloadRows();
      setEditing(null);
      setImageDrafts({});
      setStatusMessage("Data berhasil dihapus.");
      setStatusType("success");
    } catch (error) {
      setStatusMessage(`Data gagal dihapus: ${getErrorMessage(error)}`);
      setStatusType("error");
    }
  };

  const selectResource = (resourceKey: string) => {
    setActiveKey(resourceKey);
    setEditing(null);
    setImageDrafts({});
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#f6f3ec] px-5 py-10 text-[#1e2c26] sm:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
          <section className="w-full rounded-lg border border-[#d8d1c0] bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold text-[#697a36] animate-pulse">Mengalihkan...</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#1e2c26]">
      <header className="border-b border-[#d8d1c0] bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-desa.png" alt={`Logo ${desa.nama}`} className="h-8 w-auto object-contain" />
            <div>
              <p className="text-xs font-semibold text-[#697a36]">Admin</p>
              <h1 className="text-base font-bold leading-none">{desa.nama}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link className="rounded-md border border-[#d8d1c0] px-4 py-2 text-sm font-semibold hover:bg-[#f6f3ec] transition" href="/">
              Website
            </Link>
            <button
              className="rounded-md bg-[#1b352c] px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-[#28493d] transition"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-2">
          {resources.map((resource) => (
            <button
              className={`w-full rounded-md px-4 py-3 text-left text-sm font-semibold transition cursor-pointer ${
                resource.key === activeKey
                  ? "bg-[#1b352c] text-white"
                  : "border border-[#d8d1c0] bg-white hover:border-[#697a36] hover:bg-[#f6f3ec]"
              }`}
              key={resource.key}
              onClick={() => selectResource(resource.key)}
              type="button"
            >
              {resource.label}
            </button>
          ))}
          <button
            className={`w-full rounded-md px-4 py-3 text-left text-sm font-semibold transition cursor-pointer ${
              activeKey === "profile"
                ? "bg-[#1b352c] text-white"
                : "border border-[#d8d1c0] bg-white hover:border-[#697a36] hover:bg-[#f6f3ec]"
            }`}
            onClick={() => {
              setActiveKey("profile");
              setEditing(null);
              setImageDrafts({});
              setStatusMessage("");
              setStatusType("");
            }}
            type="button"
          >
            Profil Admin
          </button>
        </aside>

        <div className="space-y-6">
          {activeKey === "profile" ? (
            <AdminProfileForm />
          ) : (
            <>
              <section className="rounded-lg border border-[#d8d1c0] bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="section-kicker">{activeResource.label}</p>
                    <h2 className="text-2xl font-bold">Form {activeResource.key === "pengaturan" ? "Ubah" : (editing ? "Edit" : "Tambah")} Data</h2>
                    <p className="mt-2 text-sm leading-6 text-[#5b6b63]">{activeResource.description}</p>
                  </div>
                  {activeResource.key !== "pengaturan" && (
                    <button
                      className="rounded-md border border-[#d8d1c0] px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-[#f6f3ec] transition"
                      onClick={() => {
                        setEditing(null);
                        setImageDrafts({});
                      }}
                      type="button"
                    >
                      Form Baru
                    </button>
                  )}
                </div>

                <form key={`${activeResource.key}-${formRecord.id}`} className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                  {activeResource.fields.map((field) => (
                    <div
                      className={`block text-sm font-semibold ${field.type === "textarea" ? "md:col-span-2" : ""}`}
                      key={field.name}
                    >
                      <span>{field.label}</span>
                      {field.type === "textarea" ? (
                        <textarea
                          className="mt-2 min-h-28 w-full rounded-md border border-[#d8d1c0] px-3 py-3 outline-none focus:border-[#697a36] bg-white font-normal"
                          defaultValue={String(formRecord[field.name] ?? "")}
                          name={field.name}
                          required={field.required}
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="mt-2 w-full rounded-md border border-[#d8d1c0] px-3 py-3 outline-none focus:border-[#697a36] bg-white font-normal text-sm cursor-pointer"
                          defaultValue={String(formRecord[field.name] ?? "")}
                          name={field.name}
                          required={field.required}
                        >
                          <option value="">-- Pilih {field.label} --</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "image" ? (
                        <ImageUploadField
                          field={field}
                          onFileSelect={handleImageFile}
                          value={imageDrafts[field.name] || String(formRecord[field.name] ?? "")}
                        />
                      ) : (
                        <input
                          className="mt-2 w-full rounded-md border border-[#d8d1c0] px-3 py-3 outline-none focus:border-[#697a36] bg-white font-normal text-sm"
                          defaultValue={String(formRecord[field.name] ?? "")}
                          name={field.name}
                          required={field.required}
                          type={field.type ?? "text"}
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-3 md:col-span-2">
                    <button className="rounded-md bg-[#1b352c] px-5 py-3 text-sm font-bold text-white cursor-pointer hover:bg-[#27483c] transition" type="submit">
                      {activeResource.key === "pengaturan" ? "Simpan Pengaturan" : (editing ? "Simpan Perubahan" : "Tambah Data")}
                    </button>
                  </div>
                  {statusMessage ? (
                    <div
                      className={`flex items-center gap-2.5 rounded-lg px-4 py-3.5 text-sm font-semibold border md:col-span-2 transition-all duration-200 ${
                        statusType === "error"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : statusType === "success"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-[#fcfbfa] text-[#5b6b63] border-[#e0dacb]"
                      }`}
                    >
                      {statusType === "error" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : statusType === "success" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-[#8e8570]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>{statusMessage}</span>
                    </div>
                  ) : null}
                </form>
              </section>

              {activeResource.key !== "pengaturan" && (
                <section className="overflow-hidden rounded-lg border border-[#d8d1c0] bg-white shadow-sm">
                  <div className="border-b border-[#e7e1d3] p-6">
                    <h2 className="text-2xl font-bold">Daftar {activeResource.label}</h2>
                    <p className="mt-2 text-sm text-[#5b6b63]">Total data: {activeRows.length}</p>
                  </div>
                  <div className="divide-y divide-[#e7e1d3]">
                    {activeRows.map((row) => (
                      <article className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center" key={row.id}>
                        <div>
                          <p className="font-bold">{String(row[activeResource.titleField])}</p>
                          <p className="mt-1 text-sm text-[#5b6b63]">ID: {row.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="rounded-md border border-[#d8d1c0] px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-[#f6f3ec] transition"
                            onClick={() => {
                              setEditing(row);
                              setImageDrafts({});
                            }}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 transition-colors cursor-pointer"
                            onClick={() => {
                              const rowTitle = String(row[activeResource.titleField] ?? row.id);
                              setConfirmModal({
                                isOpen: true,
                                type: "delete",
                                title: "Konfirmasi Hapus Data",
                                message: `Apakah Anda yakin ingin menghapus data "${rowTitle}"? Tindakan ini tidak dapat dibatalkan.`,
                                onConfirm: () => {
                                  handleDelete(row.id);
                                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                },
                              });
                            }}
                            type="button"
                          >
                            Hapus
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#d8d1c0] bg-white p-6 shadow-xl animate-scale-up">
            <div className="flex items-start gap-4">
              {confirmModal.type === "delete" ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              ) : confirmModal.type === "edit" ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#697a36] border border-emerald-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#1e2c26] leading-none">{confirmModal.title}</h3>
                <p className="text-sm leading-relaxed text-[#5b6b63]">{confirmModal.message}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3 border-t border-[#f0ece3] pt-4">
              <button
                className="rounded-md border border-[#d8d1c0] bg-white px-4 py-2 text-sm font-semibold text-[#1e2c26] hover:bg-[#f6f3ec] transition cursor-pointer"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                type="button"
              >
                Batal
              </button>
              <button
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition cursor-pointer ${
                  confirmModal.type === "delete"
                    ? "bg-red-700 hover:bg-red-800"
                    : confirmModal.type === "edit"
                    ? "bg-[#697a36] hover:bg-[#5b6b30]"
                    : "bg-[#1b352c] hover:bg-[#142821]"
                }`}
                onClick={confirmModal.onConfirm}
                type="button"
              >
                {confirmModal.type === "delete" ? "Ya, Hapus" : confirmModal.type === "edit" ? "Ya, Simpan" : "Ya, Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ImageUploadField({
  field,
  onFileSelect,
  value,
}: {
  field: FieldConfig;
  onFileSelect: (fieldName: string, file?: File) => void;
  value: string;
}) {
  const isHeroBgMedia = field.name === "hero_bg_media";
  const acceptTypes = isHeroBgMedia ? "image/*,video/*" : "image/*";

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    onFileSelect(field.name, event.dataTransfer.files[0]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(field.name, event.target.files?.[0]);
  };

  const isVideo = value.startsWith("data:video/") || value.endsWith(".mp4") || value.endsWith(".webm") || value.endsWith(".mov") || value.endsWith(".ogg");

  return (
    <div
      className="mt-2 rounded-md border border-dashed border-[#b9b094] bg-[#fbfaf6] p-4"
      onDragOver={(event) => event.preventDefault()}
    >
      <label
        className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-md bg-white px-4 py-5 text-center transition hover:bg-[#f6f3ec]"
        onDrop={handleDrop}
      >
        <input accept={acceptTypes} className="sr-only" name={field.name} onChange={handleChange} type="file" />
        {value ? (
          isVideo ? (
            <video controls className="mb-4 max-h-44 rounded-md object-cover w-full max-w-[200px]" src={value} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="Pratinjau gambar" className="mb-4 max-h-44 rounded-md object-cover" src={value} />
          )
        ) : null}
        <span className="text-sm font-bold text-[#1b352c]">
          {isHeroBgMedia ? "Pilih gambar atau video dari device" : "Pilih gambar dari device"}
        </span>
        <span className="mt-1 text-xs font-medium text-[#5b6b63]">
          {isHeroBgMedia 
            ? "Mendukung format gambar (PNG, JPG, WEBP) atau video (MP4, WEBM)"
            : "Mendukung format PNG, JPG, JPEG, WEBP, GIF, dll."}
        </span>
      </label>
      <input name={`${field.name}_existing`} readOnly type="hidden" value={value} />
    </div>
  );
}

function AdminProfileForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setStatusType("");

    const storedPassword = localStorage.getItem("plasan-admin-password") || "plasan123";

    if (oldPassword !== storedPassword) {
      setStatusMessage("Password lama salah.");
      setStatusType("error");
      return;
    }

    if (newPassword.length < 5) {
      setStatusMessage("Password baru minimal harus terdiri dari 5 karakter.");
      setStatusType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage("Konfirmasi password baru tidak cocok.");
      setStatusType("error");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("plasan-admin-password", newPassword);
      setStatusMessage("Password berhasil diubah.");
      setStatusType("success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setIsLoading(false);
    }, 400);
  };

  return (
    <section className="rounded-lg border border-[#d8d1c0] bg-white p-6 shadow-sm animate-fade-in">
      <div>
        <p className="section-kicker">Keamanan Akun</p>
        <h2 className="text-2xl font-bold">Profil Admin</h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6b63]">
          Ubah password akun admin Anda. Username dikunci sebagai <strong>admin</strong>.
        </p>
      </div>

      <form className="mt-6 max-w-md space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">Username</label>
          <input
            className="mt-2 w-full rounded-md border border-[#d8d1c0] px-3.5 py-2.5 bg-[#f6f3ec] text-[#5b6b63] cursor-not-allowed font-semibold text-sm"
            value="admin"
            disabled
            type="text"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">Password Lama</label>
          <div className="relative mt-2">
            <input
              className="w-full rounded-md border border-[#d8d1c0] pl-3.5 pr-10 py-2.5 outline-none focus:border-[#697a36] bg-white font-normal text-sm"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              type={showOldPassword ? "text" : "password"}
              placeholder="Masukkan password lama Anda"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8570] hover:text-[#1e2c26] transition-colors cursor-pointer flex items-center justify-center"
            >
              {showOldPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">Password Baru</label>
          <div className="relative mt-2">
            <input
              className="w-full rounded-md border border-[#d8d1c0] pl-3.5 pr-10 py-2.5 outline-none focus:border-[#697a36] bg-white font-normal text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              type={showNewPassword ? "text" : "password"}
              placeholder="Minimal 5 karakter"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8570] hover:text-[#1e2c26] transition-colors cursor-pointer flex items-center justify-center"
            >
              {showNewPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">Konfirmasi Password Baru</label>
          <div className="relative mt-2">
            <input
              className="w-full rounded-md border border-[#d8d1c0] pl-3.5 pr-10 py-2.5 outline-none focus:border-[#697a36] bg-white font-normal text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Masukkan kembali password baru"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8570] hover:text-[#1e2c26] transition-colors cursor-pointer flex items-center justify-center"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          className="rounded-md bg-[#1b352c] px-5 py-3 text-sm font-bold text-white cursor-pointer hover:bg-[#27483c] transition disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Ubah Password"}
        </button>

        {statusMessage ? (
          <div
            className={`mt-4 flex items-center gap-2.5 rounded-lg px-4 py-3.5 text-sm font-semibold border transition-all duration-200 ${
              statusType === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            {statusType === "error" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span>{statusMessage}</span>
          </div>
        ) : null}
      </form>
    </section>
  );
}
