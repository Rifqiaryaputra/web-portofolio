"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "ri-dashboard-line" },
  { href: "/admin/profile", label: "Profile Information", icon: "ri-user-settings-line" },
  { href: "/admin/skills", label: "Skills & Tools", icon: "ri-tools-line" },
  { href: "/admin/experiences", label: "Experience", icon: "ri-briefcase-4-line" },
  { href: "/admin/education", label: "Education", icon: "ri-book-read-line" },
  { href: "/admin/projects", label: "Projects", icon: "ri-macbook-line" },
];

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside
      className={`bg-black text-white w-64 flex-shrink-0 flex-col h-full transition-all duration-300 z-20 absolute md:relative border-r-[2px] border-title ${
        open ? "flex w-full z-50 md:w-64" : "hidden"
      } md:flex`}
    >
      <div className="h-16 flex items-center px-6 border-b-[2px] border-title bg-black justify-between">
        <span className="font-bold text-xl tracking-wider text-primary">
          ADMIN PANEL
        </span>
        <button
          onClick={onClose}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-white/10 border-l-4 border-primary"
                    : "hover:bg-gray-800 border-l-4 border-transparent"
                }`}
              >
                <i className={`${item.icon} mr-3 text-lg`}></i> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <LogoutButton />
      </div>
    </aside>
  );
}