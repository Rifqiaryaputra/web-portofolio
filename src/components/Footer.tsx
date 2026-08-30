import type { Profile } from "@/lib/supabase";

function githubUsername(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts[0] ? `@${parts[0]}` : null;
  } catch {
    return null;
  }
}

function instagramValue(value?: string | null): {
  url: string;
  display: string;
} {
  if (!value) return { url: "#", display: "" };
  if (/^https?:\/\//i.test(value)) {
    return { url: value, display: value.replace(/^https?:\/\/(www\.)?/, "") };
  }
  const username = value.replace(/^@/, "");
  return { url: `https://instagram.com/${username}`, display: `@${username}` };
}

export default function Footer({ profile }: { profile: Profile }) {
  const instagram = instagramValue(profile.instagram);

  return (
    <footer className="mt-24 pt-10 flex flex-wrap justify-center lg:justify-between items-center gap-6 lg:gap-4 border-t border-gray-300">
      <a
        href={
          profile.email
            ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`
            : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-medium text-sm hover:text-primary transition-colors text-gray-800"
      >
        <i className="ri-mail-line text-xl"></i> {profile.email}
      </a>
      <a
        href={profile.github_url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-medium text-sm hover:text-primary transition-colors text-gray-800"
      >
        <i className="ri-github-fill text-xl"></i>{" "}
        {githubUsername(profile.github_url) ?? "GitHub"}
      </a>
      <a
        href={instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-medium text-sm hover:text-primary transition-colors text-gray-800"
      >
        <i className="ri-instagram-line text-xl"></i> {instagram.display}
      </a>
      <a
        href={profile.linkedin ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-medium text-sm hover:text-primary transition-colors text-gray-800"
      >
        <i className="ri-linkedin-box-line text-xl"></i>{" "}
        {profile.linkedin
          ? profile.linkedin.replace(/^https?:\/\/(www\.)?/, "")
          : ""}
      </a>
    </footer>
  );
}
