"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/supabase";
import {
  uploadProjectImages,
  createProject,
  updateProject,
} from "@/lib/projectActions";

type Props = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSaved: (project: Project) => void;
};

function initialForm(project: Project | null) {
  return {
    title: project?.title ?? "",
    description: project?.description ?? "",
    tags:
      typeof project?.tags === "string"
        ? project.tags
        : (project?.tags ?? []).join(","),
    status: project?.status || "In Progress",
    completion_date: project?.completion_date ?? "",
    last_setup_date: project?.last_setup_date ?? "",
    github_url: project?.github_url ?? "",
    demo_url: project?.demo_url ?? "",
  };
}

export default function ProjectModal({
  open,
  project,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState(() => initialForm(project));
  const [existingImages, setExistingImages] = useState<string[]>(() =>
    Array.isArray(project?.images) ? project.images : [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const previewsRef = useRef<string[]>([]);

  useEffect(
    () => () => {
      previewsRef.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => {
      const next = [...prev, ...files.map((f) => URL.createObjectURL(f))];
      previewsRef.current = next;
      return next;
    });
    e.target.value = "";
  }

  function removeNewFile(i: number) {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[i]);
      const next = prev.filter((_, idx) => idx !== i);
      previewsRef.current = next;
      return next;
    });
  }

  function removeExisting(i: number) {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
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
      const uploaded = await uploadProjectImages(newFiles);
      const images = [...existingImages, ...uploaded];
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        tags: form.tags.trim(),
        status: form.status,
        completion_date: form.completion_date || null,
        last_setup_date: form.last_setup_date || null,
        github_url: form.github_url.trim() || null,
        demo_url: form.demo_url.trim() || null,
        images,
      };
      const saved = project
        ? await updateProject(project.id, payload)
        : await createProject(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save project",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const isEdit = !!project;

  return (
    <>
      <div className="fixed inset-0 bg-title/80 backdrop-blur-sm z-50" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-paper border-[2px] border-title shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-2xl overflow-hidden rounded-none max-h-[90vh] flex flex-col">
          <div className="px-6 py-4 border-b-[2px] border-title flex justify-between items-center bg-primary flex-shrink-0">
            <h3 className="text-lg font-bold text-title">
              {isEdit ? "Edit Project" : "Add Project"}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-title mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. E-commerce Platform"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-title mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    required
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none resize-y"
                    placeholder="Short description of the project..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-title mb-2">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tags: e.target.value }))
                    }
                    required
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. React, Node.js, Tailwind"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={form.completion_date}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        completion_date: e.target.value,
                      }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-title mb-2">
                    Last Setup / Updated Date
                  </label>
                  <input
                    type="date"
                    value={form.last_setup_date}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        last_setup_date: e.target.value,
                      }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Github Repo URL
                  </label>
                  <input
                    type="url"
                    value={form.github_url}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        github_url: e.target.value,
                      }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="https://github.com/user/repo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-title mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={form.demo_url}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        demo_url: e.target.value,
                      }))
                    }
                    className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-title mb-2">
                    Gallery Images
                  </label>
                  <div className="border-2 border-dashed border-title rounded p-4 bg-background">
                    {(existingImages.length > 0 || previews.length > 0) && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {existingImages.map((url, i) => (
                          <div key={`e-${i}`} className="relative group">
                            <img
                              src={url}
                              alt=""
                              className="h-20 w-20 object-cover border-2 border-title"
                            />
                            <button
                              type="button"
                              onClick={() => removeExisting(i)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-title text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                        {previews.map((url, i) => (
                          <div key={`n-${i}`} className="relative group">
                            <img
                              src={url}
                              alt=""
                              className="h-20 w-20 object-cover border-2 border-title"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewFile(i)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-title text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFiles}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-sm font-bold text-title bg-white border-2 border-title px-4 py-2 shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                    >
                      <i className="ri-upload-2-line mr-2"></i>
                      Choose Images
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold mb-4">
                  {error}
                </p>
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
                  {saving
                    ? "Saving..."
                    : isEdit
                      ? "Update Project"
                      : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}