import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/* ----------------------------- Types ----------------------------- */

export type Skill = {
  id: number | string;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  sort_order?: number | null;
};

export type Tool = {
  id: number | string;
  name: string;
  icon_class?: string | null;
  color_hex?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  sort_order?: number | null;
};

export type Experience = {
  id: number | string;
  role: string;
  location?: string | null;
  duration?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  sort_order?: number | null;
};

export type Education = {
  id: number | string;
  year?: string | null;
  degree?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  sort_order?: number | null;
};

export type Project = {
  id: number | string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  tags?: string | string[] | null;
  status?: string | null;
  completion_date?: string | null;
  last_setup_date?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  sort_order?: number | null;
};

export type Profile = {
  id: number | string;
  name: string;
  greeting?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  favicon_url?: string | null;
  cv_url?: string | null;
  email?: string | null;
  github_url?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

/* --------------------------- Queries --------------------------- */

async function queryTable<T>(
  table: string,
  orderBy?: string,
  ascending = true,
): Promise<T[]> {
  if (!supabase) return [];
  try {
    let query = supabase.from(table).select("*");
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }
    const { data, error } = await query;
    if (error) {
      console.error(`Supabase error (${table}):`, error.message);
      return [];
    }
    return (data as T[]) ?? [];
  } catch (err) {
    console.error(`Supabase request failed (${table}):`, err);
    return [];
  }
}

export async function getSkills(): Promise<Skill[]> {
  return queryTable<Skill>("skills", "id");
}

export async function getTools(): Promise<Tool[]> {
  return queryTable<Tool>("tools", "id");
}

export async function getExperiences(): Promise<Experience[]> {
  return queryTable<Experience>("experiences", "id");
}

export async function getEducation(): Promise<Education[]> {
  return queryTable<Education>("education", "id");
}

export async function getProjects(): Promise<Project[]> {
  return queryTable<Project>("projects", "created_at", false);
}

export async function getProjectById(
  id: string | number,
): Promise<Project | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as Project;
  } catch (err) {
    console.error("Supabase request failed (project):", err);
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as Profile;
  } catch (err) {
    console.error("Supabase request failed (profile):", err);
    return null;
  }
}