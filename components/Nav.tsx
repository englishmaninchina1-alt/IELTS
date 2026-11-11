"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "@/lib/store";
import { overallBand } from "@/lib/band";

const links = [
  { href: "/reading", label: "Reading" },
  { href: "/listening", label: "Listening" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  { href: "/pronunciation", label: "Pronunciation" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/grammar", label: "Grammar" },
  { href: "/coach", label: "AI Coach" },
  { href: "/tips", label: "Strategy" },
  { href: "/progress", label: "Progress" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { profile, ready } = useProfile();

  useEffect(() => setOpen(false), [pathname]);

  const latest = ["reading", "listening", "writing", "speaking"].map(
    (s) => profile.attempts.find((a) => a.skill === s)?.band ?? 0
  );
  const estimated = overallBand(latest.filter(Boolean));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-[13px] font-black text-ink">9</span>
          <span className="hidden text-[15px] font-semibold tracking-tight text-ink sm:block">
            Band Nine<span className="text-limeDeep">.</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
          {links.slice(0, 4).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition ${
                pathname.startsWith(l.href) ? "bg-ink/10 text-ink" : "text-ink/60 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className="mx-1.5 h-4 w-px bg-ink/10" />
          {links.slice(4).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition ${
                pathname.startsWith(l.href) ? "bg-ink/10 text-ink" : "text-ink/60 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {ready && estimated > 0 && (
            <Link
              href="/progress"
              className="hidden items-center gap-2 rounded-full border border-limeDeep/30 bg-lime/10 px-3 py-1.5 text-xs font-semibold text-limeDeep sm:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              Estimated {estimated.toFixed(1)}
            </Link>
          )}
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-ink/15 text-ink/70 lg:hidden"
          >
            <span className="text-lg leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper px-4 pb-4 pt-2 lg:hidden">
          <div className="grid grid-cols-2 gap-1.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  pathname.startsWith(l.href) ? "bg-ink/10 text-ink" : "text-ink/65"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
