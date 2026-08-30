"use client";

import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/lib/supabase";
import {
  getProfileRecord,
  saveProfile,
  uploadProfileFile,
  type ProfileInput,
} from "@/lib/profileActions";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80";

type FormState = Omit<ProfileInput, "avatar_url" | "cv_url" | "favicon_url">;

const EMPTY: FormState = {
  name: "",
  greeting: "",
  bio: "",
  email: "",
  github_url: null,
  instagram: "",
  linkedin: "",
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(DEFAULT_AVATAR);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProfileRecord();
        if (!cancelled && data) {
          setProfile(data);
          setForm({
            name: data.name ?? "",
            greeting: data.greeting ?? "",
            bio: data.bio ?? "",
            email: data.email ?? "",
            github_url: data.github_url ?? null,
            instagram: data.instagram ?? "",
            linkedin: data.linkedin ?? "",
          });
          setAvatarPreview(data.avatar_url || DEFAULT_AVATAR);
          setFaviconPreview(data.favicon_url ?? null);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  }

  function handleFavicon(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFaviconFile(file);
    if (file) setFaviconPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let avatarUrl: string | null = profile?.avatar_url ?? null;
      let cvUrl: string | null = profile?.cv_url ?? null;
      let faviconUrl: string | null = profile?.favicon_url ?? null;
      if (avatarFile) avatarUrl = await uploadProfileFile("avatar", avatarFile);
      if (cvFile) cvUrl = await uploadProfileFile("cv", cvFile);
      if (faviconFile)
        faviconUrl = await uploadProfileFile("favicon", faviconFile);
      await saveProfile(profile, {
        ...form,
        avatar_url: avatarUrl,
        cv_url: cvUrl,
        favicon_url: faviconUrl,
      });
      setToast("Profile updated.");
      setAvatarFile(null);
      setCvFile(null);
      setFaviconFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputCls =
    "w-full rounded px-4 py-2.5 bg-white border-2 border-gray-300 focus:border-title focus:outline-none";
  const fileCls =
    "w-full rounded bg-white text-sm border-2 border-gray-300 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:border-r-[2px] file:border-title file:text-sm file:font-bold file:bg-primary file:text-title hover:file:bg-white cursor-pointer transition-colors";

  return (
    <section className="max-w-[1120px] mx-auto">
      <div className="bg-paper border-[2px] border-title p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="greeting" value={form.greeting} />

          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="bg-primary text-title inline-block px-3 py-1 font-bold text-base border-[2px] border-title">
              Basic Information
            </h2>
            <button
              type="submit"
              disabled={saving || loading}
              className="bg-white text-title px-6 py-2.5 rounded-full font-bold border-2 border-title shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-sm hover:bg-primary disabled:opacity-50"
            >
              <i className="ri-save-line mr-1"></i>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-100 border-[2px] border-title text-sm font-bold text-title">
              <i className="ri-error-warning-line mr-2"></i>
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500 text-sm font-medium py-8">
              Loading profile...
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    required
                    className={inputCls}
                    placeholder="Nia Loren"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Profile Image
                  </label>
                  <input
                    ref={avatarRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                    className={fileCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Favicon Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFavicon}
                    className={fileCls}
                  />
                  {faviconPreview && (
                    <div className="mt-3 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={faviconPreview}
                        alt="Favicon preview"
                        className="h-10 w-10 object-contain border-2 border-title bg-white p-0.5"
                      />
                      <span className="text-xs text-gray-500">
                        Favicon preview
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-title pt-6 border-t-[2px] border-dashed border-title">
                  Contact Details
                </h3>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    className={inputCls}
                    placeholder="email@domain.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={form.github_url ?? ""}
                    onChange={set("github_url")}
                    className={inputCls}
                    placeholder="e.g., https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={set("instagram")}
                    className={inputCls}
                    placeholder="username or full URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={form.linkedin}
                    onChange={set("linkedin")}
                    className={inputCls}
                    placeholder="linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Upload CV (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setCvFile(e.target.files?.[0] ?? null)
                    }
                    className={fileCls}
                  />
                  {profile?.cv_url && !cvFile && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current:{" "}
                      <a
                        href={profile.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-primary"
                      >
                        view file
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    About Me (Profile Summary)
                  </label>
                  <textarea
                    rows={8}
                    value={form.bio}
                    onChange={set("bio")}
                    className={`${inputCls} resize-none`}
                    placeholder="Write a short bio..."
                  />
                </div>

                <div className="p-6 bg-white border-[2px] border-title mt-6 shadow-brutal">
                  <h4 className="text-sm font-bold text-title mb-4 bg-primary inline-block px-2 border-[2px] border-title">
                    Image Preview
                  </h4>
                  <div className="w-[200px] h-[260px] mx-auto relative mt-4">
                    <div className="absolute inset-[-1rem] border-[2px] border-dashed border-title transform rotate-[4deg] z-0"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="relative z-10 w-full h-full object-cover grayscale border-[2px] border-title bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 px-6 py-4 bg-white border-[2px] border-title shadow-brutal flex items-center gap-3 z-[100] text-title font-bold">
          <i className="ri-checkbox-circle-fill text-xl text-primary"></i>
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </section>
  );
}