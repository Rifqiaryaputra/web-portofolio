"use client";

import { useEffect, useState } from "react";
import type { Experience } from "@/lib/supabase";
import { getExperiences, deleteExperience } from "@/lib/experienceActions";
import ExperienceModal from "@/components/admin/ExperienceModal";

function bulletPoints(description?: string | null): string[] {
  return (description ?? "")
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

export default function AdminExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getExperiences();
        if (!cancelled) setItems(data);
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

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      setItems(await getExperiences());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function handleSaved() {
    setToast(editing ? "Experience updated." : "Experience added.");
    refresh();
  }

  async function handleDelete(item: Experience) {
    if (!confirm(`Are you sure you want to delete this experience entry?`))
      return;
    try {
      await deleteExperience(item.id);
      setToast("Experience deleted.");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <section className="max-w-[1120px] mx-auto">
      <div className="bg-paper border-[2px] border-title p-6 md:p-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="bg-primary text-title inline-block px-3 py-1 font-bold text-base border-[2px] border-title">
            Work Experience
          </h2>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="bg-white text-title px-6 py-2.5 rounded-full font-bold border-2 border-title shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-sm flex items-center hover:bg-primary"
          >
            <i className="ri-add-line mr-2"></i> Add Experience
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-100 border-[2px] border-title text-sm font-bold text-title">
            <i className="ri-error-warning-line mr-2"></i>
            {error}
          </div>
        )}

        <div className="bg-white border-[2px] border-title p-4 md:p-6 shadow-brutal">
          {loading ? (
            <p className="text-center text-gray-500 text-sm font-medium py-8">
              Loading experience...
            </p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 text-sm font-medium py-8">
              No experience entries yet.
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {items.map((item, i) => (
                <div key={item.id}>
                  <div className="group relative border-[2px] border-transparent hover:border-title p-4 transition-colors">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(item);
                          setModalOpen(true);
                        }}
                        className="bg-white border-[2px] border-title text-title hover:bg-primary w-8 h-8 flex items-center justify-center shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                        title="Edit"
                      >
                        <i className="ri-edit-box-line"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="bg-white border-[2px] border-title text-title hover:bg-red-400 w-8 h-8 flex items-center justify-center shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 sm:gap-8 text-sm md:text-[15px]">
                      <div className="font-bold text-title leading-snug">
                        {item.location} / <br /> {item.duration}
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-3 text-title">
                          {item.role}
                        </h3>
                        <ul className="list-disc list-outside ml-4 text-gray-700 space-y-2">
                          {bulletPoints(item.description).map((point, j) => (
                            <li key={j}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {i < items.length - 1 && (
                    <div className="border-b-[2px] border-dashed border-title w-full my-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ExperienceModal
        key={modalOpen ? (editing?.id ?? "new") : "closed"}
        open={modalOpen}
        experience={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 px-6 py-4 bg-white border-[2px] border-title shadow-brutal flex items-center gap-3 z-[100] text-title font-bold">
          <i className="ri-checkbox-circle-fill text-xl text-primary"></i>
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </section>
  );
}