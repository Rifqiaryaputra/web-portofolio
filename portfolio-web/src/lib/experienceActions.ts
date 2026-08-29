import { supabase } from "./supabase";
import type { Experience } from "./supabase";

export type ExperienceInput = {
  role: string;
  location: string;
  duration: string;
  description: string;
};

export async function getExperiences(): Promise<Experience[]> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Experience[]) ?? [];
}

export async function createExperience(
  input: ExperienceInput,
): Promise<Experience> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("experiences")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Experience;
}

export async function updateExperience(
  id: string | number,
  input: ExperienceInput,
): Promise<Experience> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("experiences")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Experience;
}

export async function deleteExperience(
  id: string | number,
): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}