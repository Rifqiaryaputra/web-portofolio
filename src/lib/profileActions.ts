import { supabase } from "./supabase";
import type { Profile } from "./supabase";

const BUCKET = "portfolio";

function uniqueFileName(prefix: string, file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${prefix}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
}

export async function uploadProfileFile(
  prefix: "avatar" | "cv" | "favicon",
  file: File,
): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured");
  const path = uniqueFileName(prefix, file);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export type ProfileInput = {
  name: string;
  greeting: string;
  bio: string;
  email: string;
  github_url: string | null;
  instagram: string;
  linkedin: string;
  avatar_url: string | null;
  favicon_url: string | null;
  cv_url: string | null;
};

export async function getProfileRecord(): Promise<Profile | null> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Profile) ?? null;
}

export async function saveProfile(
  profile: Profile | null,
  input: ProfileInput,
): Promise<Profile> {
  if (!supabase) throw new Error("Supabase is not configured");
  if (profile) {
    const { data, error } = await supabase
      .from("profile")
      .update(input)
      .eq("id", profile.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Profile;
  }
  const { data, error } = await supabase
    .from("profile")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Profile;
}