import Link from "next/link";
import { getAwards } from "@/lib/supabase";
import AwardsList from "@/components/AwardsList";

export const revalidate = 60;

export default async function AwardsPage() {
  const awards = await getAwards();

  return (
    <>
      <div className="min-h-screen bg-[#eaeaea] py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto bg-white p-6 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-title hover:text-primary transition-colors mb-10"
          >
            <i className="ri-arrow-left-line text-lg"></i> Back to Portfolio
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-title">
            All Honors &amp; Awards
          </h1>

          <AwardsList awards={awards} />
        </div>
      </div>
    </>
  );
}