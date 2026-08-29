import type { Experience } from "@/lib/supabase";

function descriptionLines(description?: string | null): string[] {
  if (!description) return [];
  return description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ExperienceSection({
  experiences,
}: {
  experiences: Experience[];
}) {
  if (experiences.length === 0) return null;
  return (
    <section className="experience">
      <h2 className="bg-primary text-title inline-block px-3 py-1 font-medium mb-8 text-sm md:text-base">
        Experience
      </h2>

      <div className="flex flex-col gap-8">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 sm:gap-8 text-sm md:text-[15px]"
          >
            <div className="font-bold text-gray-800 leading-snug">
              {exp.location ?? "Remote"}
              {" / "}
              <br />
              {exp.duration}
            </div>
            <div>
              <h3 className="font-bold text-base mb-3">{exp.role}</h3>
              <ul className="list-disc list-outside ml-4 text-gray-700 space-y-2">
                {descriptionLines(exp.description).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
