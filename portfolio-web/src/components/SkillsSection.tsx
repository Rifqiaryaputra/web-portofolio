import type { Skill } from "@/lib/supabase";

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;
  return (
    <section className="skills">
      <h2 className="bg-primary text-title inline-block px-3 py-1 font-medium mb-6 text-sm md:text-base">
        Skills
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm md:text-[15px]">
        {skills.map((skill) => (
          <li key={skill.id}>{skill.name}</li>
        ))}
      </ul>
    </section>
  );
}
