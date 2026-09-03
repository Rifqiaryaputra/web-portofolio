import { supabase } from "./supabase";
import type { Award } from "./supabase";

const BUCKET = "awards";

function uniqueFileName(file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
}

export async function uploadAwardImage(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured");
  const path = uniqueFileName(file);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export type AwardInput = {
  title: string;
  issuer: string;
  year: string;
  url: string;
  image_url?: string | null;
};

export async function getAwards(): Promise<Award[]> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("awards")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Award[]) ?? [];
}

export async function createAward(
  input: AwardInput,
): Promise<Award> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("awards")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Award;
}

export async function updateAward(
  id: string | number,
  input: AwardInput,
): Promise<Award> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("awards")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Award;
}

export async function deleteAward(
  id: string | number,
): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("awards").delete().eq("id", id);
  if (error) throw new Error(error.message);
}