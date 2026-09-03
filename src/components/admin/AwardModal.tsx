"use client";

import { useEffect, useRef, useState } from "react";
import type { Award } from "@/lib/supabase";
import {
  createAward,
  updateAward,
  uploadAwardImage,
  type AwardInput,
} from "@/lib/awardActions";

type Props = {
  open: boolean;
  award: Award | null;
  onClose: () => void;
  onSaved: (a: Award) => void;
};

function init(award: Award | null): AwardInput {
  return {
    title: award?.title ?? "",
    issuer: award?.issuer ?? "",
    year: award?.year ?? "",
    url: award?.url ?? "",
  };
}

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export default function AwardModal({
  open,
  award,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState(() => init(award));
  const existingImage = award?.image_url ?? null;
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeExisting, setRemoveExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setNewFile(file);
    setPreview(URL.createObjectURL(file));
    setRemoveExisting(true);
    e.target.value = "";
  }

  function clearNewFile() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setNewFile(null);
    setRemoveExisting(existingImage !== null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let imageUrl: string | null = null;
      if (newFile) {
        imageUrl = await uploadAwardImage(newFile);
      } else if (!removeExisting) {
        imageUrl = existingImage;
      }

      const payload: AwardInput = {
        title: form.title.trim(),
        issuer: form.issuer.trim(),
        year: form.year.trim(),
        url: form.url.trim(),
        image_url: imageUrl,
      };

      const saved = award
        ? await updateAward(award.id, payload)
        : await createAward(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const isEdit = !!award;
  const showExisting =
    existingImage && !removeExisting && !newFile;
  const showNew = preview && newFile;

  return (
    <>
      <div className="fixed inset-0 bg-title/80 backdrop-blur-sm z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-paper border-[2px] border-title shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-md overflow-hidden rounded-none">
          <div className="px-6 py-4 border-b-[2px] border-title flex justify-between items-center bg-primary">
            <h3 className="text-lg font-bold text-title">
              {isEdit ? "Edit Award" : "Add Award"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-title bg-white border-[2px] border-title w-8 h-8 flex items-center justify-center shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="p-6 bg-white">
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 mb-6">
                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. Site of the Day"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Issuer
                  </label>
                  <input
                    type="text"
                    value={form.issuer}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, issuer: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. Awwwards"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, year: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. 2023"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Award URL{" "}
                    <span className="text-gray-400 font-medium">
                      (optional if you upload a file)
                    </span>
                  </label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, url: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. https://www.awwwards.com/sites/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Award Image / PDF
                    <span className="text-gray-400 font-medium">
                      {" "}
                      (alternative to URL)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-title rounded p-4 bg-background">
                    {showExisting && (
                      <div className="mb-3">
                        <p className="text-xs font-bold text-gray-500 mb-2">
                          Current file:
                        </p>
                        {existingImage && /\.pdf($|\?)/i.test(existingImage) ? (
                          <div className="flex items-center gap-2 text-sm font-bold text-title border-[2px] border-title bg-white px-3 py-2">
                            <i className="ri-file-pdf-2-line text-lg text-red-500"></i>
                            Award PDF
                          </div>
                        ) : (
                          <img
                            src={existingImage ?? ""}
                            alt=""
                            className="max-h-32 border-2 border-title bg-white object-contain"
                          />
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => setRemoveExisting(true)}
                            className="text-xs font-bold text-red-600 border-2 border-red-600 px-3 py-1 hover:bg-red-100 transition-colors"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="text-xs font-bold text-title border-2 border-title px-3 py-1 bg-white hover:bg-primary transition-colors"
                          >
                            Replace
                          </button>
                        </div>
                      </div>
                    )}

                    {showNew && (
                      <div className="mb-3">
                        <p className="text-xs font-bold text-gray-500 mb-2">
                          New file:
                        </p>
                        {isPdf(newFile) ? (
                          <div className="flex items-center gap-2 text-sm font-bold text-title border-[2px] border-title bg-white px-3 py-2">
                            <i className="ri-file-pdf-2-line text-lg text-red-500"></i>
                            {newFile.name}
                          </div>
                        ) : (
                          <img
                            src={preview ?? ""}
                            alt=""
                            className="max-h-32 border-2 border-title bg-white object-contain"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => clearNewFile()}
                          className="text-xs font-bold text-red-600 mt-3 border-2 border-red-600 px-3 py-1 hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {!showExisting && !showNew && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="text-sm font-bold text-title bg-white border-2 border-title px-4 py-2 shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                      >
                        <i className="ri-upload-2-line mr-2"></i>
                        Choose File
                      </button>
                    )}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-400 font-medium mt-2">
                      JPG, PNG or PDF. Uploaded to Supabase Storage.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold mb-4">{error}</p>
              )}

              <div className="flex justify-end gap-4 mt-6 pt-6 border-t-[2px] border-dashed border-title">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="px-6 py-2 text-sm font-bold text-title bg-white border-2 border-title shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-full hover:bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-sm font-bold text-title bg-primary border-2 border-title shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-full hover:bg-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
