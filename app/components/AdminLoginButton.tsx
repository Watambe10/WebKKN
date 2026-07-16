"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function AdminLoginButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  // Login States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      setShowPassword(false);
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
      const storedPassword = localStorage.getItem("plasan-admin-password") || "plasan123";
      if (cleanUsername === "admin" && cleanPassword === storedPassword) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132720]/80 backdrop-blur-md transition-opacity duration-300">
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            onClick={() => {
              if (!isLoading) setIsOpen(false);
            }}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-[#d8d1c0] bg-white p-7 shadow-2xl transition-all duration-300 sm:p-8 animate-in fade-in zoom-in-95 duration-200 z-10">
            {/* Close Button */}
            {!isLoading && (
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f3ec] text-[#5b6b63] transition hover:bg-[#e7c765] hover:text-[#173328] cursor-pointer"
                aria-label="Tutup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

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
                      placeholder="Masukkan username (e.g. admin)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">
                      Password
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-[#d8d1c0] pl-3.5 pr-10 py-2.5 text-sm outline-none focus:border-[#697a36] focus:ring-1 focus:ring-[#697a36] transition-all bg-white text-[#1e2c26]"
                        placeholder="Masukkan password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8570] hover:text-[#1e2c26] transition-colors cursor-pointer flex items-center justify-center"
                      >
                        {showPassword ? (
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
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b352c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#243f35] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed duration-150 shadow-md cursor-pointer"
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
