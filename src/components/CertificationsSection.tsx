"use client";

import { useEffect, useState } from "react";
import type { Certification } from "@/lib/supabase";

export default function CertificationsSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  const [viewing, setViewing] = useState<Certification | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!viewing) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setViewing(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  if (certifications.length === 0) return null;

  const isPdf = viewing?.image_url ? /\.pdf($|\?)/i.test(viewing.image_url) : false;

  return (
    <section className="certifications pt-4">
      <h2 className="bg-primary text-title inline-block px-3 py-1 font-medium mb-8 text-sm md:text-base">
        Certifications
      </h2>

      <div className="flex flex-col gap-6">
        {(isExpanded
          ? certifications
          : certifications.slice(0, 2)
        ).map((cert) => (
          <div
            key={cert.id}
            className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-8 text-sm md:text-[15px]"
          >
            <div className="font-bold text-gray-800">{cert.date}</div>
            <div>
              <h3 className="font-bold">{cert.title}</h3>
              {cert.issuer ? (
                <div className="text-gray-500 font-medium">{cert.issuer}</div>
              ) : null}
              {cert.image_url || cert.url ? (
                cert.image_url ? (
                  <button
                    type="button"
                    onClick={() => setViewing(cert)}
                    className="inline-flex items-center gap-1 text-black font-bold hover:text-primary transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    Lihat Sertifikat
                    <i className="ri-image-line"></i>
                  </button>
                ) : (
                  <a
                    href={cert.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black font-bold hover:text-primary transition-colors"
                  >
                    Lihat Sertifikat
                    <i className="ri-external-link-line"></i>
                  </a>
                )
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {certifications.length > 2 && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="text-sm font-semibold text-black hover:text-primary transition-colors mt-4 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
        >
          {isExpanded
            ? "Show less ➔"
            : `Show all ${certifications.length} certifications ➔`}
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
              <div className="p-4 md:p-6 bg-white max-h-[70vh] overflow-auto flex items-center justify-center">
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
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
