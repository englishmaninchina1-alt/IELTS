import type { Skill } from "./band";
import type { Attempt, Profile, VocabWord } from "./store";

/**
 * Validation and merging for saved progress. Pure functions with no React and
 * no server imports, so the API route and the browser share one definition of
 * what a valid profile is.
 */

const SKILLS: Skill[] = ["reading", "listening", "writing", "speaking"];

export const EMPTY_PROFILE: Profile = {
  attempts: [],
  vocab: {},
  streak: { lastDay: null, days: 0 },
  target: 7,
  testDate: null,
  name: "",
  coachHistory: [],
};

const MAX_ATTEMPTS = 200;
const MAX_WORDS = 2000;
const MAX_HISTORY = 100;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function num(value: unknown, min: number, max: number): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

function int(value: unknown, min: number, max: number): number | null {
  const n = num(value, min, max);
  return n === null ? null : Math.round(n);
}

function isoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function toAttempt(value: unknown): Attempt | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const skill = SKILLS.includes(raw.skill as Skill) ? (raw.skill as Skill) : null;
  const id = text(raw.id, 64);
  const label = text(raw.label, 160);
  const band = num(raw.band, 0, 9);
  const date = isoDate(raw.date);
  if (!skill || !id || !label || band === null || !date) return null;

  const attempt: Attempt = { id, skill, label, band, date };
  const rawScore = int(raw.raw, 0, 400);
  const total = int(raw.total, 0, 400);
  const minutes = int(raw.minutes, 0, 600);
  if (rawScore !== null) attempt.raw = rawScore;
  if (total !== null) attempt.total = total;
  if (minutes !== null) attempt.minutes = minutes;
  return attempt;
}

function toWord(key: string, value: unknown): [string, VocabWord] | null {
  const word = text(key, 60);
  if (!word || !value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  return [
    word,
    {
      word,
      box: int(raw.box, 0, 5) ?? 0,
      seen: int(raw.seen, 0, 100000) ?? 0,
      correct: int(raw.correct, 0, 100000) ?? 0,
      lastSeen: isoDate(raw.lastSeen) ?? new Date(0).toISOString(),
    },
  ];
}

/** Coerces untrusted JSON into a Profile, or null when it is not an object. */
export function sanitizeProfile(input: unknown): Profile | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const raw = input as Record<string, unknown>;

  const attempts = Array.isArray(raw.attempts)
    ? raw.attempts
        .map(toAttempt)
        .filter((a): a is Attempt => a !== null)
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .slice(0, MAX_ATTEMPTS)
    : [];

  const vocab: Record<string, VocabWord> = {};
  if (raw.vocab && typeof raw.vocab === "object" && !Array.isArray(raw.vocab)) {
    for (const [key, value] of Object.entries(raw.vocab as Record<string, unknown>)) {
      const entry = toWord(key, value);
      if (entry) vocab[entry[0]] = entry[1];
    }
  }

  const streakRaw = (raw.streak && typeof raw.streak === "object" ? raw.streak : {}) as Record<string, unknown>;
  const streakDay =
    typeof streakRaw.lastDay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(streakRaw.lastDay) ? streakRaw.lastDay : null;

  const testDate = typeof raw.testDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.testDate) ? raw.testDate : null;

  const coachHistory = Array.isArray(raw.coachHistory)
    ? raw.coachHistory
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const item = entry as Record<string, unknown>;
          const id = text(item.id, 64);
          const title = text(item.title, 160);
          const date = isoDate(item.date);
          return id && title && date ? { id, title, date } : null;
        })
        .filter((entry): entry is { id: string; title: string; date: string } => entry !== null)
        .slice(0, MAX_HISTORY)
    : [];

  return {
    attempts,
    vocab,
    streak: { lastDay: streakDay, days: int(streakRaw.days, 0, 10000) ?? 0 },
    target: num(raw.target, 4, 9) ?? 7,
    testDate,
    name: text(raw.name, 80),
    coachHistory,
  };
}

export function isEmptyProfile(profile: Profile): boolean {
  return profile.attempts.length === 0 && Object.keys(profile.vocab).length === 0;
}

/**
 * Combines the browser's copy with the account's copy. Attempts and coach
 * sessions are unioned by id, vocabulary keeps the furthest learning box, the
 * streak keeps the later day, and explicit settings on this device win.
 */
export function mergeProfiles(local: Profile, remote: Profile): Profile {
  const attempts = new Map<string, Attempt>();
  for (const attempt of [...local.attempts, ...remote.attempts]) {
    const existing = attempts.get(attempt.id);
    if (!existing || Date.parse(attempt.date) > Date.parse(existing.date)) attempts.set(attempt.id, attempt);
  }

  const vocab: Record<string, VocabWord> = { ...remote.vocab };
  for (const [key, word] of Object.entries(local.vocab)) {
    const other = vocab[key];
    if (!other) {
      vocab[key] = word;
      continue;
    }
    vocab[key] = {
      word: key,
      box: Math.max(other.box, word.box),
      seen: Math.max(other.seen, word.seen),
      correct: Math.max(other.correct, word.correct),
      lastSeen: word.lastSeen > other.lastSeen ? word.lastSeen : other.lastSeen,
    };
  }
  const trimmedVocab = Object.fromEntries(
    Object.entries(vocab)
      .sort((a, b) => (a[1].lastSeen < b[1].lastSeen ? 1 : -1))
      .slice(0, MAX_WORDS)
  );

  const localDay = local.streak.lastDay ?? "";
  const remoteDay = remote.streak.lastDay ?? "";
  const streak = {
    lastDay: localDay > remoteDay ? local.streak.lastDay : remote.streak.lastDay,
    days: Math.max(local.streak.days, remote.streak.days),
  };

  const coachHistory = new Map<string, { id: string; title: string; date: string }>();
  for (const item of [...local.coachHistory, ...remote.coachHistory]) {
    if (!coachHistory.has(item.id)) coachHistory.set(item.id, item);
  }

  return {
    attempts: [...attempts.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, MAX_ATTEMPTS),
    vocab: trimmedVocab,
    streak,
    target: isEmptyProfile(local) ? remote.target : local.target,
    testDate: local.testDate ?? remote.testDate,
    name: local.name || remote.name,
    coachHistory: [...coachHistory.values()]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, MAX_HISTORY),
  };
}
