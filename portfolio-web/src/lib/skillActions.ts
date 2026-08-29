import { supabase } from "./supabase";
import type { Skill } from "./supabase";

export type SkillInput = {
  name: string;
};

export async function getSkills(): Promise<Skill[]> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Skill[]) ?? [];
}

export async function createSkill(input: SkillInput): Promise<Skill> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("skills")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Skill;
}

export async function updateSkill(
  id: string | number,
  input: SkillInput,
): Promise<Skill> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("skills")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Skill;
}

export async function deleteSkill(id: string | number): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
}