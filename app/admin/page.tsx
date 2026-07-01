import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin | Padukuhan Plasan",
  description: "Panel admin Padukuhan Plasan untuk mengelola berita, kegiatan, galeri, dan monografi desa.",
};

export default function AdminPage() {
  return <AdminClient />;
}
