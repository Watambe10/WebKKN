"use client";

import dynamic from "next/dynamic";

const AdminPanel = dynamic(() => import("./AdminPanel"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-[#f6f3ec] px-5 py-10 text-[#1e2c26] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section className="w-full rounded-lg border border-[#d8d1c0] bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold text-[#697a36]">Memuat admin...</p>
        </section>
      </div>
    </main>
  ),
});

export default function AdminClient() {
  return <AdminPanel />;
}
