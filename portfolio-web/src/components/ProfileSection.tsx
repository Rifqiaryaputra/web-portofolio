import type { ReactNode } from "react";
import type { Profile } from "@/lib/supabase";
import { resolveFileUrl } from "@/lib/storage";

export default function ProfileSection({
  profile,
  actions,
}: {
  profile: Profile;
  actions?: ReactNode;
}) {
  return (
    <section className="mb-8 md:mb-12">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        {/* Profile Info */}
        <div className="order-2 md:order-1">
          <p className="text-xl md:text-2xl mb-1">
            {profile.greeting ?? "Hello I'm"}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            {profile.name}
          </h1>

          {/* Profile Description */}
          <div>
            <h2 className="bg-primary text-title inline-block px-3 py-1 font-medium mb-4 text-sm md:text-base">
              Profile
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-[15px]">
              {profile.bio}
            </p>
          </div>

          {actions}
        </div>

        {/* Profile Image */}
        <div className="flex justify-center md:justify-end relative mt-10 md:mt-0 px-8 order-1 md:order-2">
          <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[420px]">
            <div className="absolute inset-[-1.5rem] border-[2px] border-dashed border-title transform rotate-[4deg] z-0"></div>
            {resolveFileUrl(profile.avatar_url) ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={resolveFileUrl(profile.avatar_url)}
                alt={profile.name}
                className="relative z-10 w-full h-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
              />
            ) : (
              <div className="relative z-10 w-full h-full border-[2px] border-title bg-white flex items-center justify-center">
                <i className="ri-user-line text-8xl text-gray-300"></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
