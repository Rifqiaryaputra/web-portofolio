"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/profile": "Profile Information",
  "/admin/experiences": "Experience",
  "/admin/education": "Education",
  "/admin/skills": "Skills & Tools",
  "/admin/projects": "Projects",
};

function getPageTitle(pathname: string): string {
  const exact = PAGE_TITLES[pathname];
  if (exact) return exact;
  for (const [prefix, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(prefix) && prefix !== "/admin") return title;
  }
  return "Dashboard";
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="h-screen overflow-hidden flex">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className="h-16 bg-paper flex items-center justify-between px-4 sm:px-6 z-10 border-b-[2px] border-title">
          <div className="flex items-center">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-gray-500 hover:text-title mr-4"
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-title">
              {getPageTitle(pathname)}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary border-[2px] border-title flex items-center justify-center font-bold text-title">
              N
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}