"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authSupabase } from "@/lib/supabase-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (!authSupabase) throw new Error("Supabase is not configured");
      const { error } = await authSupabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-title hover:text-primary transition-colors mb-8"
        >
          <i className="ri-arrow-left-line text-lg"></i> Back to Portfolio
        </Link>

        <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] rounded-lg overflow-hidden">
          <div className="px-8 py-4 border-b-2 border-black bg-primary flex justify-between items-center">
            <h1 className="text-xl font-bold text-title">Admin Login</h1>
            <i className="ri-shield-keyhole-line text-2xl text-title"></i>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-100 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-sm font-bold text-title flex items-center gap-2">
                <i className="ri-error-warning-line text-lg"></i> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-title mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded px-4 py-2.5 bg-white border-2 border-title focus:border-primary focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-title mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded px-4 py-2.5 pr-10 bg-white border-2 border-title focus:border-primary focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black focus:outline-none"
                >
                  <i
                    className={
                      showPassword ? "ri-eye-off-line" : "ri-eye-line"
                    }
                  ></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-full font-bold text-title bg-primary border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:bg-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}