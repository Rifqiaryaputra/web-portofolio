export function resolveFileUrl(value?: string | null): string {
  if (!value) return "";
  if (value.startsWith("#")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return value;

  const base = process.env.NEXT_PUBLIC_UPLOADS_BASE ?? "";
  const rel = value.startsWith("storage/") ? `/${value}` : `/storage/${value}`;

  return base ? `${base}${rel}` : rel;
}
