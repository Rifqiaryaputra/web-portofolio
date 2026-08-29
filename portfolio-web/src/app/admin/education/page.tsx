"use client";

import { useEffect, useState } from "react";
import type { Education } from "@/lib/supabase";
import { getEducation, deleteEducation } from "@/lib/educationActions";
import EducationModal from "@/components/admin/EducationModal";

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getEducation();
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
      setItems(await getEducation());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function handleSaved() {
    setToast(editing ? "Education updated." : "Education added.");
    refresh();
  }

  async function handleDelete(item: Education) {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;
    try {
      await deleteEducation(item.id);
      setToast("Education deleted.");
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
            Education
          </h2>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="bg-white text-title px-6 py-2.5 rounded-full font-bold border-2 border-title shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-sm flex items-center hover:bg-primary"
          >
            <i className="ri-add-line mr-2"></i> Add Education
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
            Loading education...
          </p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 text-sm font-medium py-8">
            No education entries yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-title text-white">
                  <th className="text-left px-4 py-3 font-bold border-r-2 border-title">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-bold border-r-2 border-title">
                    Year
                  </th>
                  <th className="text-left px-4 py-3 font-bold border-r-2 border-title">
                    Institution / Degree
                  </th>
                  <th className="text-left px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b-2 border-title last:border-b-0 hover:bg-white transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500 font-bold">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 font-bold text-title">
                      {item.year || "—"}
                    </td>
                    <td className="px-4 py-3 text-title">
                      {item.degree || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(item);
                            setModalOpen(true);
                          }}
                          className="bg-white border-[2px] border-title text-title shadow-brutal w-9 h-9 flex items-center justify-center transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-primary"
                          title="Edit"
                        >
                          <i className="ri-edit-box-line text-lg"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="bg-white border-[2px] border-title text-title shadow-brutal w-9 h-9 flex items-center justify-center transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-red-400"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EducationModal
        key={modalOpen ? (editing?.id ?? "new") : "closed"}
        open={modalOpen}
        education={editing}
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