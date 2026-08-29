import type { Education } from "@/lib/supabase";

export default function EducationSection({
  education,
}: {
  education: Education[];
}) {
  if (education.length === 0) return null;
  return (
    <section className="education pt-4">
      <h2 className="bg-primary text-title inline-block px-3 py-1 font-medium mb-8 text-sm md:text-base">
        Education
      </h2>

      <div className="flex flex-col gap-6">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-8 text-sm md:text-[15px]"
          >
            <div className="font-bold text-gray-800">{edu.year}</div>
            <div className="font-medium">{edu.degree}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
