"use client";

import { useState } from "react";
import type { Education } from "@/lib/supabase";
import {
  createEducation,
  updateEducation,
  type EducationInput,
} from "@/lib/educationActions";

type Props = {
  open: boolean;
  education: Education | null;
  onClose: () => void;
  onSaved: (e: Education) => void;
};

function init(edu: Education | null): EducationInput {
  return {
    year: edu?.year ?? "",
    degree: edu?.degree ?? "",
  };
}

export default function EducationModal({
  open,
  education,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState(() => init(education));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.year.trim() && !form.degree.trim()) {
      setError("Fill at least one field");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = education
        ? await updateEducation(education.id, form)
        : await createEducation(form);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const isEdit = !!education;

  return (
    <>
      <div className="fixed inset-0 bg-title/80 backdrop-blur-sm z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-paper border-[2px] border-title shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-md overflow-hidden rounded-none">
          <div className="px-6 py-4 border-b-[2px] border-title flex justify-between items-center bg-primary">
            <h3 className="text-lg font-bold text-title">
              {isEdit ? "Edit Education" : "Add Education"}
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
                    Institution / Degree
                  </label>
                  <input
                    type="text"
                    value={form.degree}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, degree: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. Systems Engineering - University"
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
                    placeholder="e.g. Class of 2016"
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