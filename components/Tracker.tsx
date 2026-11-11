"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Records one page view per navigation. Server-side code enriches the view with
 * country, device and referrer classification; nothing here identifies a user.
 * Honours Do Not Track and Global Privacy Control, and never fires for /admin.
 */
function sessionId(): string {
  try {
    const existing = window.sessionStorage.getItem("bn-sid");
    if (existing) return existing;
    const fresh = Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.sessionStorage.setItem("bn-sid", fresh);
    return fresh;
  } catch {
    return "anonymous";
  }
}

export default function Tracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (last.current === pathname) return;
    last.current = pathname;

    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;

    const body = JSON.stringify({
      path: pathname,
      href: window.location.href,
      referrer: document.referrer,
      sid: sessionId(),
    });

    // sendBeacon survives the page being closed; fetch+keepalive is the fallback.
    const ok =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));

    if (!ok) {
      void fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
