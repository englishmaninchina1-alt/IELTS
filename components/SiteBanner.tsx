"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Announcement = {
  id: number;
  message: string;
  linkLabel: string | null;
  linkHref: string | null;
  tone: "info" | "success" | "warning";
  updatedAt: string;
};

const DISMISS_KEY = "ielts-banner-dismissed";

const TONE: Record<Announcement["tone"], string> = {
  info: "border-tealDeep/25 bg-teal/10 text-tealDeep",
  success: "border-limeDeep/30 bg-lime/15 text-limeDeep",
  warning: "border-[#B45309]/25 bg-[#B45309]/[0.07] text-[#8A6100]",
};

export default function SiteBanner() {
  const pathname = usePathname();
  const [items, setItems] = useState<Announcement[]>([]);
  const [hidden, setHidden] = useState<number[]>([]);

  useEffect(() => {
    let live = true;
    fetch("/api/site-banner")
      .then((r) => (r.ok ? r.json() : { announcements: [] }))
      .then((data: { announcements?: Announcement[] }) => {
        if (live && Array.isArray(data.announcements)) setItems(data.announcements.slice(0, 1));
      })
      .catch(() => {});
    try {
      const raw = window.localStorage.getItem(DISMISS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setHidden(Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : []);
    } catch {
      /* ignore */
    }
    return () => {
      live = false;
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;
  const banner = items.find((i) => !hidden.includes(i.id));
  if (!banner) return null;

  const dismiss = () => {
    const next = [...hidden, banner.id].slice(-20);
    setHidden(next);
    try {
      window.localStorage.setItem(DISMISS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-[12.5px] leading-6 ${TONE[banner.tone]}`}>
      <p className="min-w-0 flex-1">
        {banner.message}
        {banner.linkHref && banner.linkLabel && (
          <a
            href={banner.linkHref}
            className="ml-2 font-semibold underline underline-offset-2"
            {...(banner.linkHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {banner.linkLabel} →
          </a>
        )}
      </p>
      <button onClick={dismiss} aria-label="Dismiss announcement" className="shrink-0 text-ink/35 transition hover:text-ink/70">
        ×
      </button>
    </div>
  );
}
