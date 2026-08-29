"use client";

import { useState } from "react";
import type { Tool } from "@/lib/supabase";
import {
  createTool,
  updateTool,
  type ToolInput,
} from "@/lib/toolActions";

type Props = {
  open: boolean;
  tool: Tool | null;
  onClose: () => void;
  onSaved: (t: Tool) => void;
};

function init(tool: Tool | null): ToolInput {
  return {
    name: tool?.name ?? "",
    icon_class: tool?.icon_class ?? "",
    color_hex: tool?.color_hex ?? null,
  };
}

export default function ToolModal({ open, tool, onClose, onSaved }: Props) {
  const [form, setForm] = useState(() => init(tool));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Tool name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = tool
        ? await updateTool(tool.id, form)
        : await createTool(form);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-title/80 backdrop-blur-sm z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-paper border-[2px] border-title shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-md overflow-hidden rounded-none">
          <div className="px-6 py-4 border-b-[2px] border-title flex justify-between items-center bg-primary">
            <h3 className="text-lg font-bold text-title">
              {tool ? "Edit Tool" : "Add Tool"}
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
              <div className="mb-5">
                <label className="block text-sm font-bold text-title mb-2">
                  Tool Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                  placeholder="e.g. React"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-title mb-2">
                  Remix Icon Class
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.icon_class}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        icon_class: e.target.value,
                      }))
                    }
                    className="flex-1 rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                    placeholder="e.g. ri-reactjs-line"
                    required
                  />
                  <a
                    href="https://remixicon.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white border-2 border-title shadow-brutal flex items-center justify-center rounded"
                    title="Find icons"
                  >
                    <i className="ri-search-line font-bold"></i>
                  </a>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-title mb-2">
                  Icon Color (Hex)
                </label>
                <input
                  type="text"
                  value={form.color_hex ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      color_hex: e.target.value || null,
                    }))
                  }
                  className="w-full rounded px-4 py-2.5 bg-background border-2 border-gray-300 focus:border-title focus:outline-none"
                  placeholder="e.g. #61DAFB"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold mb-4">{error}</p>
              )}

              <div className="flex justify-end gap-4 mt-8">
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
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}