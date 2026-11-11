"use client";

import { useCallback, useEffect, useState } from "react";
import type { Skill } from "./band";
import { EMPTY_PROFILE } from "./progress-shape";

export type Attempt = {
  id: string;
  skill: Skill;
  label: string;
  band: number;
  raw?: number;
  total?: number;
  date: string;
  minutes?: number;
};

export type VocabWord = { word: string; box: number; seen: number; correct: number; lastSeen: string };

export type Profile = {
  attempts: Attempt[];
  vocab: Record<string, VocabWord>;
  streak: { lastDay: string | null; days: number };
  target: number;
  testDate: string | null;
  name: string;
  coachHistory: { id: string; title: string; date: string }[];
};

const KEY = "ielts-boost-v1";

const empty: Profile = EMPTY_PROFILE;

export function loadProfile(): Profile {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as Profile) };
  } catch {
    return empty;
  }
}

export function saveProfile(p: Profile) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    window.dispatchEvent(new Event("ielts-profile"));
  } catch {
    /* storage full or blocked — progress is a convenience, not a requirement */
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
    const sync = () => setProfile(loadProfile());
    window.addEventListener("ielts-profile", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ielts-profile", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (p: Profile) => Profile) => {
    const next = fn(loadProfile());
    saveProfile(next);
    setProfile(next);
  }, []);

  const recordAttempt = useCallback(
    (a: Omit<Attempt, "id" | "date">) => {
      update((p) => {
        const today = new Date().toISOString().slice(0, 10);
        const streak =
          p.streak.lastDay === today
            ? p.streak
            : p.streak.lastDay === new Date(Date.now() - 864e5).toISOString().slice(0, 10)
              ? { lastDay: today, days: p.streak.days + 1 }
              : { lastDay: today, days: 1 };
        return {
          ...p,
          streak,
          attempts: [
            { ...a, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString() },
            ...p.attempts,
          ].slice(0, 200),
        };
      });
    },
    [update]
  );

  const latestBySkill = useCallback(
    (skill: Skill) => profile.attempts.find((a) => a.skill === skill),
    [profile.attempts]
  );

  return { profile, update, recordAttempt, latestBySkill, ready };
}

export function bandTrend(attempts: Attempt[], skill: Skill): number[] {
  return attempts
    .filter((a) => a.skill === skill)
    .slice(0, 8)
    .map((a) => a.band)
    .reverse();
}
