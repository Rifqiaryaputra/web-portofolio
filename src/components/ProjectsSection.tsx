import Link from "next/link";
import type { Project } from "@/lib/supabase";
import GitHubContributions from "./GitHubContributions";

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section>
      <GitHubContributions />

      <h2 className="bg-primary text-title inline-block px-3 py-1 font-medium mb-10 text-sm md:text-base">
        Jobs
      </h2>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500 text-sm font-medium py-8">
          No projects yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group active:translate-x-[2px] active:translate-y-[2px] flex flex-col h-full"
            >
              <div className="overflow-hidden mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    project.image_url ??
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={project.title}
                  className="w-full h-[250px] object-cover grayscale-0 md:grayscale transition-all duration-500 group-hover:scale-105 md:hover:grayscale-0"
                />
              </div>
              <h3 className="font-bold text-lg mb-2 text-title">{project.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {(typeof project.tags === "string"
                  ? project.tags.split(",")
                  : project.tags || []
                ).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2.5 py-1 border border-gray-300 rounded text-gray-700"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-1 text-sm font-bold text-title group-hover:text-primary transition-colors">
                  Lihat Detail <i className="ri-arrow-right-line text-lg"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
