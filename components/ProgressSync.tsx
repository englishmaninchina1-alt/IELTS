"use client";

import { useEffect, useRef, useState } from "react";
import { loadProfile, saveProfile } from "@/lib/store";
import { mergeProfiles, sanitizeProfile } from "@/lib/progress-shape";

/**
 * Keeps the browser's progress and the signed-in student's saved copy in step.
 * Signed-out visitors never leave the page: the endpoint answers 401 and local
 * storage carries on as before.
 */
export default function ProgressSync() {
  const [signedIn, setSignedIn] = useState(false);
  const pulled = useRef(false);

  useEffect(() => {
    if (pulled.current) return;
    pulled.current = true;

    void (async () => {
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as { profile?: unknown };
        const remote = sanitizeProfile(body.profile);
        const merged = remote ? mergeProfiles(loadProfile(), remote) : loadProfile();
        saveProfile(merged);
        setSignedIn(true);

        if (remote && JSON.stringify(remote) === JSON.stringify(merged)) return;
        if (!merged.attempts.length && !Object.keys(merged.vocab).length) return;

        await fetch("/api/progress", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ profile: merged }),
        });
      } catch {
        /* offline or signed out: local progress still works */
      }
    })();
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const push = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void fetch("/api/progress", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ profile: loadProfile() }),
        }).catch(() => {});
      }, 1200);
    };

    window.addEventListener("ielts-profile", push);
    return () => {
      window.removeEventListener("ielts-profile", push);
      if (timer) clearTimeout(timer);
    };
  }, [signedIn]);

  return null;
}
