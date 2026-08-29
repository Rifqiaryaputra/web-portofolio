"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/supabase";
import { deleteProject } from "@/lib/projectActions";
import ProjectModal from "@/components/admin/ProjectModal";

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [toast, setToast] = useState("");

  const fetchProjects = useCallback(async (): Promise<Project[]> => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as Project[]) ?? [];
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProjects();
        if (!cancelled) setProjects(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load projects",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchProjects]);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      setProjects(await fetchProjects());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load projects",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setModalOpen(true);
  }

  function handleSaved() {
    setToast(editing ? "Project updated." : "Project added.");
    refresh();
  }

  async function handleDelete(project: Project) {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`))
      return;
    try {
      await deleteProject(project.id);
      setToast("Project deleted.");
      refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete project",
      );
    }
  }

  return (
    <section className="max-w-[1120px] mx-auto">
      <div className="bg-paper border-[2px] border-title p-6 md:p-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="bg-primary text-title inline-block px-3 py-1 font-bold text-base border-[2px] border-title">
            Portfolio Projects
          </h2>
          <button
            type="button"
            onClick={openAdd}
            className="bg-white text-title px-6 py-2.5 rounded-full font-bold border-2 border-title shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-sm flex items-center hover:bg-primary"
          >
            <i className="ri-add-line mr-2"></i> Add Project
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
            Loading projects...
          </p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-500 text-sm font-medium py-8">
            No projects added yet.
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
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-bold border-r-2 border-title">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-bold border-r-2 border-title">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, i) => (
                  <tr
                    key={project.id}
                    className="border-b-2 border-title last:border-b-0 hover:bg-white transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500 font-bold">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden border-2 border-title bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              project.image_url ??
                              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=60"
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-title">
                            {project.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs font-bold px-2.5 py-1 border-2 border-title rounded ${
                          project.status === "Completed"
                            ? "bg-primary text-title"
                            : "bg-white text-title"
                        }`}
                      >
                        {project.status || "In Progress"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(
                        project.completion_date || project.created_at,
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(project)}
                          className="bg-white border-[2px] border-title text-title shadow-brutal w-9 h-9 flex items-center justify-center transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-primary"
                          title="Edit"
                        >
                          <i className="ri-edit-box-line text-lg"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(project)}
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

      <ProjectModal
        key={modalOpen ? (editing?.id ?? "new") : "closed"}
        open={modalOpen}
        project={editing}
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