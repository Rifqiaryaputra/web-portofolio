"use client";

import { useState } from "react";
import type { Experience } from "@/lib/supabase";
import {
  createExperience,
  updateExperience,
  type ExperienceInput,
} from "@/lib/experienceActions";

type Props = {
  open: boolean;
  experience: Experience | null;
  onClose: () => void;
  onSaved: (e: Experience) => void;
};

function init(exp: Experience | null): ExperienceInput {
  return {
    role: exp?.role ?? "",
    location: exp?.location ?? "",
    duration: exp?.duration ?? "",
    description: exp?.description ?? "",
  };
}

export default function ExperienceModal({
  open,
  experience,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState(() => init(experience));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.role.trim()) {
      setError("Role is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = experience
        ? await updateExperience(experience.id, form)
        : await createExperience(form);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const isEdit = !!experience;

  return (
    <>
      <div className="fixed inset-0 bg-title/80 backdrop-blur-sm z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-paper border-[2px] border-title shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-2xl overflow-hidden rounded-none max-h-[90vh] flex flex-col">
          <div className="px-6 py-4 border-b-[2px] border-title flex justify-between items-center bg-primary flex-shrink-0">
            <h3 className="text-lg font-bold text-title">
              {isEdit ? "Edit Experience" : "Add Experience"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-title bg-white border-[2px] border-title w-8 h-8 flex items-center justify-center shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="p-6 bg-white overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Location / Setup
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. Remote"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. 2021 - Present"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-title mb-2">
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. Brand Strategist / Freelance"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-title mb-2">
                    Description (Bullet points, new line per point)
                  </label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none resize-y"
                    placeholder="- Crafted full brand identities...&#10;- Increased engagement by 300%..."
                    required
                  />
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
                  {saving ? "Saving..." : isEdit ? "Update" : "Save Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}