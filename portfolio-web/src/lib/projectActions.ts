import { supabase } from "./supabase";
import type { Project } from "./supabase";

const BUCKET = "portfolio";

function uniqueFileName(file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `projects/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
}

export async function uploadProjectImages(files: File[]): Promise<string[]> {
  if (!supabase) return [];
  const urls: string[] = [];
  for (const file of files) {
    const path = uniqueFileName(file);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      console.error(`Upload failed (${file.name}):`, error.message);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export type ProjectInput = {
  title: string;
  description: string;
  tags: string;
  status: string;
  completion_date: string | null;
  last_setup_date: string | null;
  github_url: string | null;
  demo_url: string | null;
  images: string[];
};

function toPayload(input: ProjectInput) {
  return {
    ...input,
    image_url: input.images[0] ?? null,
  };
}

export async function createProject(input: ProjectInput): Promise<Project> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("projects")
    .insert(toPayload(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Project;
}

export async function updateProject(
  id: string | number,
  input: ProjectInput,
): Promise<Project> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("projects")
    .update(toPayload(input))
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Project;
}

export async function deleteProject(id: string | number): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}