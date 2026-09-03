import {
  getProfile,
  getSkills,
  getTools,
  getExperiences,
  getEducation,
  getAwards,
  getCertifications,
  getProjects,
} from "@/lib/supabase";
import PortfolioTabs from "@/components/PortfolioTabs";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const [
    profile,
    skills,
    tools,
    experiences,
    education,
    awards,
    certifications,
    projects,
  ] = await Promise.all([
    getProfile(),
    getSkills(),
    getTools(),
    getExperiences(),
    getEducation(),
    getAwards(),
    getCertifications(),
    getProjects(),
  ]);

  if (!profile) return null;

  return (
    <main className="max-w-[1120px] mx-auto my-12 bg-paper shadow-[0_10px_40px_rgba(0,0,0,0.03)] px-8 py-16 md:px-16 md:py-24 overflow-hidden relative">
      <PortfolioTabs
        initialTab={tab === "projects" ? "projects" : "info"}
        profile={profile}
        skills={skills}
        tools={tools}
        experiences={experiences}
        education={education}
        awards={awards}
        certifications={certifications}
        projects={projects}
      />

      <Footer profile={profile} />
    </main>
  );
}