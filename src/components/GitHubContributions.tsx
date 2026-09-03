"use client";

import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(() =>
  import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-8 text-gray-400 text-sm font-medium">
        Loading contributions...
      </div>
    ),
  },
);

const GITHUB_USERNAME = "Rifqiaryaputra";

const CALENDAR_THEME = {
  light: [
    "#f0f4f0",
    "#c8e9b0",
    "#a3dd7e",
    "#7cc94a",
    "#4a9d2f",
  ],
  dark: [
    "#333",
    "#3a5a20",
    "#4a7a2b",
    "#5c9a34",
    "#7cc94a",
  ],
};

export default function GitHubContributions() {
  return (
    <div className="w-full bg-paper border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 mb-12">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="inline-flex items-center gap-2">
          <i className="ri-github-fill text-xl text-title"></i>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-title hover:text-primary transition-colors"
          >
            @{GITHUB_USERNAME}
          </a>
        </div>
        <span className="text-sm text-gray-600 font-medium">
          GitHub Contributions
        </span>
      </div>

      <div className="w-full overflow-x-auto max-w-full">
        <GitHubCalendar
          username={GITHUB_USERNAME}
          theme={CALENDAR_THEME}
          colorScheme="light"
          fontSize={12}
          blockSize={14}
          blockMargin={4}
        />
      </div>

      <p className="mt-4 text-xs text-gray-500 font-medium">
        Total contributions and activity shown for the current year.
      </p>
    </div>
  );
}
