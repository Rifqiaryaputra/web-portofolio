import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById, getProfile } from "@/lib/supabase";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80";

function parseTags(tags?: string | string[] | null): string[] {
  return (typeof tags === "string" ? tags.split(",") : tags || [])
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, profile] = await Promise.all([
    getProjectById(id),
    getProfile(),
  ]);

  if (!project) notFound();

  const tags = parseTags(project.tags);
  const status = project.status ?? "In Progress";
  const isCompleted = status === "Completed";
  const images =
    Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : project.image_url
        ? [project.image_url]
        : [FALLBACK_IMAGE];

  return (
    <main className="max-w-[1120px] mx-auto my-6 bg-paper shadow-[0_10px_40px_rgba(0,0,0,0.03)] px-8 pt-8 pb-16 md:px-16 md:pt-10 md:pb-24 overflow-hidden relative flex flex-col">
      <Link
        href="/?tab=projects"
        className="inline-flex items-center gap-2 text-sm font-bold text-title hover:text-primary transition-colors mb-10"
      >
        <i className="ri-arrow-left-line text-lg"></i> Kembali ke Portofolio
      </Link>

      <div className="flex flex-col md:grid md:grid-cols-2 md:items-center gap-10 my-auto">
        <div className="flex flex-col gap-4">
          <div className="w-full overflow-hidden rounded-2xl aspect-square bg-gray-50">
            <div className="flex h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth">
              {images.map((src, i) => (
                <div
                  key={i}
                  id={`gallery-${i}`}
                  className="min-w-full h-full snap-center shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${project.title} - ${i + 1}`}
                    className="w-full h-full object-cover object-center bg-gray-50 snap-center"
                  />
                </div>
              ))}
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-2">
              {images.map((_, i) => (
                <a
                  key={i}
                  href={`#gallery-${i}`}
                  aria-label={`Go to image ${i + 1}`}
                  className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-primary transition-colors"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-title">
            {project.title}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            {project.description}
          </p>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2.5 py-1 border border-gray-300 rounded text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Status
                </p>
                <span
                  className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full ${
                    isCompleted
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Completed
                </p>
                <p className="text-sm font-semibold text-title">
                  {formatDate(project.completion_date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Created by
                </p>
                <p className="text-sm font-semibold text-title">
                  {profile?.name ?? "—"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Last Setup / Updated
                </p>
                <p className="text-sm font-semibold text-title">
                  {project.last_setup_date
                    ? new Date(project.last_setup_date).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "—"}
                </p>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex flex-wrap gap-4">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-[2px] border-title font-bold text-sm bg-white shadow-brutal hover:bg-primary active:translate-x-[2px] active:translate-y-[2px] transition-all duration-300"
                >
                  <i className="ri-github-fill text-lg"></i> Github Repo
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-[2px] border-title font-bold text-sm bg-white shadow-brutal hover:bg-primary active:translate-x-[2px] active:translate-y-[2px] transition-all duration-300"
                >
                  <i className="ri-external-link-line text-lg"></i> Link Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
