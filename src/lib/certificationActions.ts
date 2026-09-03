import { supabase } from "./supabase";
import type { Certification } from "./supabase";

const BUCKET = "certificates";

function uniqueFileName(file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
}

export async function uploadCertificationImage(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured");
  const path = uniqueFileName(file);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export type CertificationInput = {
  title: string;
  issuer: string;
  date: string;
  url: string;
  image_url?: string | null;
};

export async function getCertifications(): Promise<Certification[]> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Certification[]) ?? [];
}

export async function createCertification(
  input: CertificationInput,
): Promise<Certification> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("certifications")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Certification;
}

export async function updateCertification(
  id: string | number,
  input: CertificationInput,
): Promise<Certification> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("certifications")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Certification;
}

export async function deleteCertification(
  id: string | number,
): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}