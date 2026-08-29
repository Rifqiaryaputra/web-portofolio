"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Skill,
  Tool,
  Experience,
  Education,
  Project,
  Profile,
} from "@/lib/supabase";
import { resolveFileUrl } from "@/lib/storage";
import SkillsSection from "./SkillsSection";
import ToolsSection from "./ToolsSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import ProjectsSection from "./ProjectsSection";
import ProfileSection from "./ProfileSection";

type Tab = "info" | "projects";

export default function PortfolioTabs({
  initialTab,
  profile,
  skills,
  tools,
  experiences,
  education,
  projects,
}: {
  initialTab: Tab;
  profile: Profile;
  skills: Skill[];
  tools: Tool[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
}) {
  const router = useRouter();
  const [active, setActive] = useState<Tab>(initialTab);

  function switchTab(tab: Tab) {
    setActive(tab);
    router.replace(`/?tab=${tab}`, { scroll: false });
  }

  const cvUrl = resolveFileUrl(profile.cv_url);
  const formattedName = profile.name
    ? profile.name.replace(/\s+/g, "_")
    : "Profile";
  const cvFilename = encodeURIComponent(`CV_${formattedName}.pdf`);
  const cvHref = cvUrl
    ? cvUrl.includes("?")
      ? `${cvUrl}&download=${cvFilename}`
      : `${cvUrl}?download=${cvFilename}`
    : "#download";

  return (
    <>
      <ProfileSection
        profile={profile}
        actions={
          <>
            {/* Tab controls (toggle buttons + download CV) */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="inline-flex rounded-[2rem] border-[2px] border-title p-1.5 shadow-brutal bg-white relative">
                <button
                  type="button"
                  onClick={() => switchTab("info")}
                  className={`px-6 md:px-8 py-2 md:py-2.5 rounded-full font-medium cursor-pointer transition-colors duration-300 ${
                    active === "info"
                      ? "bg-primary text-title"
                      : "text-gray-500 bg-transparent hover:text-title"
                  }`}
                >
                  Information
                </button>
                <button
                  type="button"
                  onClick={() => switchTab("projects")}
                  className={`px-6 md:px-8 py-2 md:py-2.5 rounded-full font-medium cursor-pointer transition-colors duration-300 ${
                    active === "projects"
                      ? "bg-primary text-title"
                      : "text-gray-500 bg-transparent hover:text-title"
                  }`}
                >
                  Projects
                </button>
              </div>

              <a
                href={cvHref}
                download={!!cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!cvUrl) {
                    e.preventDefault();
                    alert("Downloading CV simulation...");
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[2rem] border-[2px] border-title font-medium text-title bg-white shadow-brutal hover:bg-primary active:translate-x-[2px] active:translate-y-[2px] transition-all duration-300 text-sm md:text-base"
              >
                <i className="ri-download-line text-lg"></i> Download CV
              </a>
            </div>
          </>
        }
      />

      {/* Tab content */}
      <div className="main__area">
        {active === "info" ? (
          <div
            key="info"
            className="animate-fade-in grid grid-cols-1 lg:grid-cols-[280px_auto_1fr] gap-10 lg:gap-16"
          >
            {/* Left Column (Skills & Tools) */}
            <div className="flex flex-col gap-12">
              <SkillsSection skills={skills} />
              <ToolsSection tools={tools} />
            </div>

            {/* Divider */}
            <div className="hidden lg:block border-l-2 border-dashed border-title opacity-20 mx-auto"></div>

            {/* Right Column (Experience & Education) */}
            <div className="flex flex-col gap-12">
              <ExperienceSection experiences={experiences} />
              <EducationSection education={education} />
            </div>
          </div>
        ) : (
          <div key="projects" className="animate-fade-in">
            <ProjectsSection projects={projects} />
          </div>
        )}
      </div>
    </>
  );
}
