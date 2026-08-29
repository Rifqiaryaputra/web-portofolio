import { supabase } from "./supabase";
import type { Education } from "./supabase";

export type EducationInput = {
  year: string;
  degree: string;
};

export async function getEducation(): Promise<Education[]> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Education[]) ?? [];
}

export async function createEducation(
  input: EducationInput,
): Promise<Education> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("education")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Education;
}

export async function updateEducation(
  id: string | number,
  input: EducationInput,
): Promise<Education> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("education")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Education;
}

export async function deleteEducation(
  id: string | number,
): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);
}