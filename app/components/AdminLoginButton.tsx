"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function AdminLoginButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleOpenModal = () => {
    const isAuthenticated = localStorage.getItem("plasan-admin-session") === "true";
    if (isAuthenticated) {
      router.push("/admin");
    } else {
      setIsOpen(true);
      setError("");
      setUsername("");
      setPassword("");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Simulate a brief delay for a polished premium feel
    setTimeout(() => {
      if (cleanUsername === "admin" && cleanPassword === "plasan123") {
        localStorage.setItem("plasan-admin-session", "true");
        setIsOpen(false);
        router.push("/admin");
      } else {
        setError("Username atau password tidak sesuai.");
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="cursor-pointer rounded-md bg-[#e7c765] px-4 py-2 text-sm font-semibold text-[#173328] transition hover:bg-[#f2d778] active:scale-95 duration-200"
      >
        Admin
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#132720]/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-[#d8d1c0] bg-white p-7 shadow-2xl transition-all duration-300 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f3ec] text-[#5b6b63] transition hover:bg-[#e7c765] hover:text-[#173328]"
              aria-label="Tutup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f3ec] text-[#697a36]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1e2c26]">Login Admin</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b63]">
                Masuk untuk mengelola konten Padukuhan Plasan.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#d8d1c0] px-3.5 py-2.5 text-sm outline-none focus:border-[#697a36] focus:ring-1 focus:ring-[#697a36] transition-all bg-white text-[#1e2c26]"
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#d8d1c0] px-3.5 py-2.5 text-sm outline-none focus:border-[#697a36] focus:ring-1 focus:ring-[#697a36] transition-all bg-white text-[#1e2c26]"
                  placeholder="Masukkan password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-red-50 p-2.5 text-xs font-semibold text-red-700 border border-red-100 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b352c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#243f35] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed duration-150 shadow-md"
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
