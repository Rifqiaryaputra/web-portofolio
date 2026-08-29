import { supabase } from "./supabase";
import type { Tool } from "./supabase";

export type ToolInput = {
  name: string;
  icon_class: string;
  color_hex: string | null;
};

export async function getTools(): Promise<Tool[]> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Tool[]) ?? [];
}

export async function createTool(input: ToolInput): Promise<Tool> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("tools")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Tool;
}

export async function updateTool(
  id: string | number,
  input: ToolInput,
): Promise<Tool> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("tools")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Tool;
}

export async function deleteTool(id: string | number): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) throw new Error(error.message);
}