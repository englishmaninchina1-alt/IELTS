# Band Nine — IELTS practice that scores you honestly

An interactive IELTS preparation site covering all four papers, built with Next.js 15 (App Router) and Tailwind.

## What is in it

| Area | What it does |
| --- | --- |
| **Reading** | 2 full Academic mock tests (6 passages, 80 questions) on current topics: night trains, AI and work, smart cities, vertical farming, the attention economy, the right to repair. Exam-style question types, 60-minute timer, per-question explanations. |
| **Listening** | 2 full tests (8 sections, 80 questions). Recordings are spoken live by the browser's speech engine — no audio files, no downloads, three accents, adjustable speed, play-once exam mode, transcripts after submission. |
| **Writing** | 5 Task 1 charts (rendered as live SVG) and 8 Task 2 questions with idea banks. Live word count, exam timers, and feedback against the four official criteria. |
| **Speaking** | Part 1 / 2 / 3 question banks, real exam timers (1 min prep + 2 min), recording, optional live transcription, and a criteria estimate. |
| **Vocabulary** | 100 topic-organised entries with collocations, examples and band level. Browse, flashcards and quiz, with progress saved locally. |
| **Grammar** | 7 sentence-structure lessons with weak → strong upgrades, a linking-word reference by rhetorical function, 15 common errors and a variety drill. |
| **AI Coach** | Identifies the topic of any question, offers positions/arguments/examples, and turns the student's own brainstorm into a structured sample answer. |
| **Strategy** | Per-skill tactics, traps, time budgets, band descriptors in plain English and exam-day advice. |
| **Progress** | Overall band (mean of four skills, rounded), per-skill trends, attempt history, target and test date. Saved in `localStorage`, and to D1 under the student's Freebuff account once they sign in. |

## Scoring

- **Reading / Listening** use the published raw-score (out of 40) to band conversion tables — exact, not estimated.
- **Writing / Speaking** are scored on the four official criteria from measurable features of the response and returned as a *diagnostic estimate*. The UI labels this clearly; it is not an examiner's mark.
- **Overall** band is the mean of the four skills rounded to the nearest 0.5, matching IELTS' own rule.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Optional: language-model drafts for the AI Coach

The coach works with no keys at all — it uses a deterministic idea engine in `lib/coach.ts`. To have drafts written by an LLM instead, set an OpenAI-compatible key:

```
ZAI_API_KEY=...            # or OPENAI_API_KEY
ZAI_API_BASE=https://api.z.ai/api/paas/v4
COACH_MODEL=glm-4-flash
```

The key is read only in `app/api/coach/route.ts` (server-side) and never reaches the browser. The result panel tells the student which engine produced the draft.

## Notes

- Independent study tool, not affiliated with the IELTS partners.
- Progress never leaves the browser.
- Listening audio depends on `window.speechSynthesis`; Chrome, Edge and Safari are the best targets.
