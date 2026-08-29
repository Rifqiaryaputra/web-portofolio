"use client";

import { useCallback, useEffect, useState } from "react";
import type { Skill, Tool } from "@/lib/supabase";
import { getSkills, deleteSkill } from "@/lib/skillActions";
import { getTools, deleteTool } from "@/lib/toolActions";
import SkillModal from "@/components/admin/SkillModal";
import ToolModal from "@/components/admin/ToolModal";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skillModal, setSkillModal] = useState(false);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [toolModal, setToolModal] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [toast, setToast] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, t] = await Promise.all([getSkills(), getTools()]);
      setSkills(s);
      setTools(t);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, t] = await Promise.all([getSkills(), getTools()]);
        if (!cancelled) {
          setSkills(s);
          setTools(t);
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

  async function handleDeleteSkill(s: Skill) {
    if (!confirm(`Delete skill "${s.name}"?`)) return;
    try {
      await deleteSkill(s.id);
      setToast("Skill deleted.");
      loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  async function handleDeleteTool(t: Tool) {
    if (!confirm(`Delete tool "${t.name}"?`)) return;
    try {
      await deleteTool(t.id);
      setToast("Tool deleted.");
      loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <section className="max-w-[1120px] mx-auto">
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-100 border-[2px] border-title text-sm font-bold text-title">
          <i className="ri-error-warning-line mr-2"></i>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Professional Skills */}
        <div className="bg-paper border-[2px] border-title p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="bg-primary text-title inline-block px-3 py-1 font-bold text-base border-[2px] border-title">
              Professional Skills
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditSkill(null);
                setSkillModal(true);
              }}
              className="bg-white text-title px-4 py-2 rounded-full font-bold border-2 border-title shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-xs flex items-center hover:bg-primary"
            >
              <i className="ri-add-line mr-1"></i> Add Skill
            </button>
          </div>
          <div className="flex-1 bg-white border-[2px] border-title p-4 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            {loading ? (
              <p className="text-center text-gray-500 text-sm font-medium py-8">
                Loading...
              </p>
            ) : skills.length === 0 ? (
              <p className="text-center text-gray-500 text-sm font-medium py-8">
                No skills added yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {skills.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between py-2 border-b-[1px] border-dashed border-gray-300 last:border-0 group"
                  >
                    <span className="text-title font-medium text-sm">
                      <span className="text-primary mr-2">•</span>
                      {s.name}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setEditSkill(s);
                          setSkillModal(true);
                        }}
                        className="text-title hover:text-primary p-1"
                        title="Edit"
                      >
                        <i className="ri-edit-box-line text-lg"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(s)}
                        className="text-title hover:text-red-500 p-1"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Tools & Tech */}
        <div className="bg-paper border-[2px] border-title p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="bg-primary text-title inline-block px-3 py-1 font-bold text-base border-[2px] border-title">
              Tools & Tech
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditTool(null);
                setToolModal(true);
              }}
              className="bg-white text-title px-4 py-2 rounded-full font-bold border-2 border-title shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-xs flex items-center hover:bg-primary"
            >
              <i className="ri-add-line mr-1"></i> Add Tool
            </button>
          </div>
          <div className="flex-1 bg-white border-[2px] border-title p-4 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            {loading ? (
              <p className="text-center text-gray-500 text-sm font-medium py-8">
                Loading...
              </p>
            ) : tools.length === 0 ? (
              <p className="text-center text-gray-500 text-sm font-medium py-8">
                No tools added yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {tools.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between py-2 border-b-[1px] border-dashed border-gray-300 last:border-0 group"
                  >
                    <div className="flex items-center gap-3">
                      <i
                        className={`${t.icon_class || "ri-tools-line"} text-xl`}
                        style={{
                          color: t.color_hex || "hsl(0, 0%, 4%)",
                        }}
                      ></i>
                      <span className="text-title font-bold text-sm">
                        {t.name}
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setEditTool(t);
                          setToolModal(true);
                        }}
                        className="text-title hover:text-primary p-1"
                        title="Edit"
                      >
                        <i className="ri-edit-box-line text-lg"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTool(t)}
                        className="text-title hover:text-red-500 p-1"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <SkillModal
        key={skillModal ? (editSkill?.id ?? "new") : "closed-skill"}
        open={skillModal}
        skill={editSkill}
        onClose={() => setSkillModal(false)}
        onSaved={() => {
          setToast(editSkill ? "Skill updated." : "Skill added.");
          loadAll();
        }}
      />

      <ToolModal
        key={toolModal ? (editTool?.id ?? "new") : "closed-tool"}
        open={toolModal}
        tool={editTool}
        onClose={() => setToolModal(false)}
        onSaved={() => {
          setToast(editTool ? "Tool updated." : "Tool added.");
          loadAll();
        }}
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