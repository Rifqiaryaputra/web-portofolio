import type { Tool } from "@/lib/supabase";

export default function ToolsSection({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;
  return (
    <section className="tools">
      <h2 className="bg-primary text-title inline-block px-3 py-1 font-medium mb-6 text-sm md:text-base">
        Tools &amp; Technologies
      </h2>
      <ul className="space-y-4 text-sm md:text-[15px] font-medium text-gray-800">
        {tools.map((tool) => (
          <li key={tool.id} className="flex items-center gap-3">
            <i
              className={`${tool.icon_class ?? "ri-tools-fill"} text-xl`}
              style={tool.color_hex ? { color: tool.color_hex } : undefined}
            ></i>
            {tool.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
