"use client";

import { useEffect, useState } from "react";
import type { Award } from "@/lib/supabase";

export default function AwardsSection({ awards }: { awards: Award[] }) {
  const [viewing, setViewing] = useState<Award | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!viewing) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setViewing(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  if (awards.length === 0) return null;

  const isPdf = viewing?.image_url ? /\.pdf($|\?)/i.test(viewing.image_url) : false;

  return (
    <section className="awards pt-4">
      <h2 className="bg-primary text-title inline-block px-3 py-1 font-medium mb-6 text-sm md:text-base">
        Honors &amp; Awards
      </h2>
      <ul className="space-y-4 text-sm md:text-[15px]">
        {(isExpanded ? awards : awards.slice(0, 3)).map((award) => (
          <li key={award.id}>
            <div className="font-medium">
              {award.image_url ? (
                <button
                  type="button"
                  onClick={() => setViewing(award)}
                  className="font-bold text-black hover:text-primary transition-colors cursor-pointer bg-transparent border-0 p-0 text-left"
                >
                  {award.title}
                </button>
              ) : award.url ? (
                <a
                  href={award.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-black hover:text-primary transition-colors"
                >
                  {award.title}
                </a>
              ) : (
                <span className="font-bold">{award.title}</span>
              )}
              {award.issuer || award.year ? (
                <div className="text-gray-500">
                  {[award.issuer, award.year].filter(Boolean).join(" - ")}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {awards.length > 3 && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="text-sm font-semibold text-black hover:text-green-500 transition-colors mt-4 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
        >
          {isExpanded
            ? "Show less ➔"
            : `Show all ${awards.length} awards ➔`}
        </button>
      )}

      {viewing?.image_url ? (
        <>
          <div
            className="fixed inset-0 bg-title/80 backdrop-blur-sm z-50"
            onClick={() => setViewing(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-paper border-[2px] border-title shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-3xl overflow-hidden rounded-none"
              role="dialog"
              aria-modal="true"
            >
              <div className="px-6 py-4 border-b-[2px] border-title flex justify-between items-center bg-primary">
                <h3 className="text-lg font-bold text-title truncate">
                  {viewing.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setViewing(null)}
                  className="text-title bg-white border-[2px] border-title w-8 h-8 flex items-center justify-center shadow-brutal transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex-shrink-0 ml-4"
                  aria-label="Close"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              <div className="p-4 md:p-6 bg-white max-h-[70vh] overflow-auto flex flex-col items-center justify-center">
                {isPdf ? (
                  <iframe
                    src={viewing.image_url}
                    title={viewing.title}
                    className="w-full h-[60vh] border-2 border-title"
                  />
                ) : (
                  <img
                    src={viewing.image_url}
                    alt={viewing.title}
                    className="max-w-full max-h-full object-contain border-2 border-title"
                  />
                )}
                {viewing.url ? (
                  <a
                    href={viewing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-primary text-title font-bold px-5 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Verify Link ➔
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
