"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function AdminLoginButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"login" | "forgot" | "google">("login");
  
  // Login States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Forgot Password States
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  
  // Google Login States
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState("");

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
      setView("login");
      setError("");
      setUsername("");
      setPassword("");
      setEmail("");
      setEmailSent(false);
      setGoogleLoading(false);
      setSelectedGoogleAccount("");
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

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email.trim().includes("@")) {
        setEmailSent(true);
      } else {
        setError("Masukkan format email yang valid.");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleGoogleSelectAccount = (accountEmail: string) => {
    setSelectedGoogleAccount(accountEmail);
    setGoogleLoading(true);

    setTimeout(() => {
      localStorage.setItem("plasan-admin-session", "true");
      setIsOpen(false);
      router.push("/admin");
      setGoogleLoading(false);
    }, 800);
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
              if (!googleLoading && !isLoading) setIsOpen(false);
            }}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-[#d8d1c0] bg-white p-7 shadow-2xl transition-all duration-300 sm:p-8 animate-in fade-in zoom-in-95 duration-200 z-10">
            {/* Close Button */}
            {(!googleLoading && !isLoading) && (
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

            {view === "login" && (
              <>
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
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setView("forgot");
                          setError("");
                        }}
                        className="text-xs font-semibold text-[#697a36] hover:underline cursor-pointer"
                      >
                        Lupa password?
                      </button>
                    </div>
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

                  <div className="relative my-4 flex items-center">
                    <div className="flex-grow border-t border-[#e0dacb]" />
                    <span className="flex-shrink mx-4 text-xs font-semibold uppercase text-[#8e8570]">Atau</span>
                    <div className="flex-grow border-t border-[#e0dacb]" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setView("google");
                      setError("");
                    }}
                    className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#d8d1c0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1e2c26] transition hover:bg-[#f6f3ec] active:scale-[0.98] cursor-pointer"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.974 0 12 0 7.354 0 3.307 2.67 1.277 6.577l3.99 3.188z"
                      />
                      <path
                        fill="#34A853"
                        d="M16.04 15.342A7.054 7.054 0 0 1 12 16.591a7.077 7.077 0 0 1-6.734-4.856L1.22 14.94A11.936 11.936 0 0 0 12 24c3.08 0 5.882-1.03 8.012-2.795l-3.972-3.863z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.275c0-.825-.074-1.62-.21-2.385H12v4.51h6.46a5.523 5.523 0 0 1-2.4 3.623l3.972 3.863c2.324-2.148 3.458-5.3 3.458-9.611z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.266 11.735a7.042 7.042 0 0 1 0-2.39L1.277 6.577A11.956 11.956 0 0 0 0 12c0 1.93.457 3.757 1.22 5.437l4.046-3.702z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </form>
              </>
            )}

            {view === "forgot" && (
              <>
                {/* Forgot Password Header */}
                <div className="flex flex-col items-center text-center animate-fade-in">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f3ec] text-[#697a36]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1e2c26]">Lupa Password</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b6b63]">
                    Masukkan email admin Anda untuk mendapatkan link pemulihan kata sandi.
                  </p>
                </div>

                {emailSent ? (
                  <div className="mt-6 space-y-4 text-center animate-fade-in">
                    <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-100 text-sm text-emerald-800 leading-relaxed">
                      Link pemulihan kata sandi berhasil dikirim ke <strong>{email}</strong>. Silakan periksa kotak masuk dan folder spam email Anda.
                    </div>
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="mt-2 text-sm font-semibold text-[#697a36] hover:underline cursor-pointer"
                    >
                      Kembali ke Halaman Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="mt-6 space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#697a36]">
                        Email Terdaftar
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#d8d1c0] px-3.5 py-2.5 text-sm outline-none focus:border-[#697a36] focus:ring-1 focus:ring-[#697a36] transition-all bg-white text-[#1e2c26]"
                        placeholder="admin@plasan.desa.id"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 rounded-md bg-red-50 p-2.5 text-xs font-semibold text-red-700 border border-red-100">
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-3.5 pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b352c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#243f35] active:scale-[0.98] disabled:opacity-75 shadow-md cursor-pointer"
                      >
                        {isLoading ? (
                          <span>Mengirim...</span>
                        ) : (
                          "Kirim Link Reset"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setView("login");
                          setError("");
                        }}
                        className="text-sm font-semibold text-[#5b6b63] hover:text-[#1e2c26] transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {view === "google" && (
              <div className="animate-fade-in">
                {/* Google Auth Select Account */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center">
                    <svg className="h-10 w-10" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.49 12.275c0-.825-.074-1.62-.21-2.385H12v4.51h6.46a5.523 5.523 0 0 1-2.4 3.623l3.972 3.863c2.324-2.148 3.458-5.3 3.458-9.611z"
                      />
                      <path
                        fill="#34A853"
                        d="M16.04 15.342A7.054 7.054 0 0 1 12 16.591a7.077 7.077 0 0 1-6.734-4.856L1.22 14.94A11.936 11.936 0 0 0 12 24c3.08 0 5.882-1.03 8.012-2.795l-3.972-3.863z"
                      />
                      <path
                        fill="#EA4335"
                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.974 0 12 0 7.354 0 3.307 2.67 1.277 6.577l3.99 3.188z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.266 11.735a7.042 7.042 0 0 1 0-2.39L1.277 6.577A11.956 11.956 0 0 0 0 12c0 1.93.457 3.757 1.22 5.437l4.046-3.702z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-[#1e2c26]">Pilih akun Google</h2>
                  <p className="mt-1 text-xs text-[#5b6b63]">untuk melanjutkan ke Admin Plasan</p>
                </div>

                {googleLoading ? (
                  <div className="mt-8 mb-4 flex flex-col items-center justify-center py-6 text-center animate-fade-in">
                    <svg className="h-9 w-9 animate-spin text-[#4285F4]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="mt-4 text-sm font-semibold text-[#1e2c26]">Menghubungkan...</p>
                    <p className="mt-1 text-xs text-[#5b6b63]">{selectedGoogleAccount}</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3.5 animate-fade-in">
                    {/* Google Accounts List */}
                    {[
                      { name: "Admin Plasan", email: "admin.plasan@gmail.com" },
                      { name: "KKN Plasan 2026", email: "kkn.plasan.2026@gmail.com" },
                    ].map((account) => (
                      <button
                        key={account.email}
                        onClick={() => handleGoogleSelectAccount(account.email)}
                        className="flex w-full items-center gap-3.5 rounded-lg border border-[#d8d1c0] bg-white p-3 text-left hover:bg-[#f6f3ec] transition cursor-pointer"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0ede4] text-sm font-bold text-[#1b352c]">
                          {account.name[0]}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-[#1e2c26] truncate">{account.name}</p>
                          <p className="text-xs text-[#5b6b63] truncate">{account.email}</p>
                        </div>
                      </button>
                    ))}

                    <div className="pt-4 border-t border-[#f0ece3] text-center">
                      <button
                        type="button"
                        onClick={() => setView("login")}
                        className="text-xs font-semibold text-[#697a36] hover:underline cursor-pointer"
                      >
                        Gunakan Akun Username & Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
