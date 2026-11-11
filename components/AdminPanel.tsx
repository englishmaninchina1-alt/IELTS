"use client";

import { useState } from "react";

type Announcement = {
  id: number;
  message: string;
  linkLabel: string | null;
  linkHref: string | null;
  tone: "info" | "success" | "warning";
  active: boolean;
  updatedAt: string;
};

type Prompt = {
  id: number;
  title: string;
  topic: string;
  kind: string;
  question: string;
  outline: string[];
  vocabulary: string[];
  active: boolean;
  updatedAt: string;
};

type Payload = { announcements: Announcement[]; prompts: Prompt[]; error?: string };

const input = "w-full rounded-lg border border-ink/15 bg-white px-2.5 py-2 text-[12.5px] text-ink/85 focus:border-tealDeep focus:outline-none";
const label = "text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/40";

export default function AdminPanel({
  initialAnnouncements,
  initialPrompts,
  dbReady,
}: {
  initialAnnouncements: Announcement[];
  initialPrompts: Prompt[];
  dbReady: boolean;
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [prompts, setPrompts] = useState(initialPrompts);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [aMessage, setAMessage] = useState("");
  const [aLabel, setALabel] = useState("");
  const [aHref, setAHref] = useState("");
  const [aTone, setATone] = useState<Announcement["tone"]>("info");

  const [pTitle, setPTitle] = useState("");
  const [pTopic, setPTopic] = useState("");
  const [pKind, setPKind] = useState("Opinion");
  const [pQuestion, setPQuestion] = useState("");
  const [pOutline, setPOutline] = useState("");
  const [pVocab, setPVocab] = useState("");

  const send = async (body: Record<string, unknown>, done: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as Payload;
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status}).`);
        return false;
      }
      setAnnouncements(data.announcements ?? []);
      setPrompts(data.prompts ?? []);
      setNotice(done);
      return true;
    } catch {
      setError("Could not reach the server.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {!dbReady && (
        <p className="rounded-xl border border-[#B45309]/25 bg-[#B45309]/[0.07] px-4 py-3 text-[12.5px] text-[#8A6100]">
          The database binding is not available in this runtime, so nothing can be saved.
        </p>
      )}
      {error && <p className="rounded-xl border border-coralDeep/30 bg-coral/10 px-4 py-3 text-[12.5px] text-coralDeep">{error}</p>}
      {notice && <p className="rounded-xl border border-limeDeep/30 bg-lime/10 px-4 py-3 text-[12.5px] text-limeDeep">{notice}</p>}

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { k: "Announcements", v: announcements.length },
          { k: "Live now", v: announcements.filter((a) => a.active).length },
          { k: "Writing prompts", v: prompts.length },
          { k: "Published", v: prompts.filter((p) => p.active).length },
        ].map((s) => (
          <div key={s.k} className="card p-3">
            <div className={label}>{s.k}</div>
            <div className="mt-1 font-serif text-2xl text-ink">{s.v}</div>
          </div>
        ))}
      </div>

      <section className="card p-5">
        <h2 className="font-serif text-xl text-ink">Site announcement</h2>
        <p className="mt-1 text-[12px] text-ink/45">Shown once at the top of every student page. The newest active one wins.</p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="a-message">
              Message
            </label>
            <textarea
              id="a-message"
              value={aMessage}
              onChange={(e) => setAMessage(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="New: full Listening mock 3 is live this week."
              className={`${input} mt-1 resize-y`}
            />
          </div>
          <div>
            <label className={label} htmlFor="a-label">
              Link label (optional)
            </label>
            <input id="a-label" value={aLabel} onChange={(e) => setALabel(e.target.value)} placeholder="Take the mock" className={`${input} mt-1`} />
          </div>
          <div>
            <label className={label} htmlFor="a-href">
              Link URL (optional)
            </label>
            <input id="a-href" value={aHref} onChange={(e) => setAHref(e.target.value)} placeholder="/listening/mock-2" className={`${input} mt-1`} />
          </div>
          <div>
            <label className={label} htmlFor="a-tone">
              Tone
            </label>
            <select id="a-tone" value={aTone} onChange={(e) => setATone(e.target.value as Announcement["tone"])} className={`${input} mt-1`}>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="btn-primary w-full !py-2 !text-[12.5px]"
              disabled={busy || !aMessage.trim()}
              onClick={async () => {
                const ok = await send(
                  { action: "announcement.create", message: aMessage, linkLabel: aLabel, linkHref: aHref, tone: aTone },
                  "Announcement published."
                );
                if (ok) {
                  setAMessage("");
                  setALabel("");
                  setAHref("");
                }
              }}
            >
              Publish announcement
            </button>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {announcements.length === 0 && <li className="text-[12.5px] text-ink/40">No announcements yet.</li>}
          {announcements.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-ink/10 bg-ink/[0.02] px-3 py-2">
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${a.active ? "bg-lime/20 text-limeDeep" : "bg-ink/10 text-ink/45"}`}>
                {a.active ? "Live" : "Hidden"}
              </span>
              <span className="min-w-0 flex-1 text-[12.5px] text-ink/75">{a.message}</span>
              <span className="text-[10.5px] uppercase tracking-[0.1em] text-ink/30">{a.tone}</span>
              <button
                className="text-[11.5px] font-semibold text-tealDeep hover:underline"
                disabled={busy}
                onClick={() => send({ action: "announcement.update", id: a.id, active: !a.active }, a.active ? "Announcement hidden." : "Announcement live.")}
              >
                {a.active ? "Hide" : "Show"}
              </button>
              <button
                className="text-[11.5px] font-semibold text-coralDeep hover:underline"
                disabled={busy}
                onClick={() => send({ action: "announcement.delete", id: a.id }, "Announcement deleted.")}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5">
        <h2 className="font-serif text-xl text-ink">Writing Task 2 prompts</h2>
        <p className="mt-1 text-[12px] text-ink/45">
          Published prompts appear in the Writing workspace dropdown, after the built-in eight. Published prompts have no model answer.
        </p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="p-title">
              Title
            </label>
            <input id="p-title" value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Remote work and cities" className={`${input} mt-1`} />
          </div>
          <div>
            <label className={label} htmlFor="p-topic">
              Topic
            </label>
            <input id="p-topic" value={pTopic} onChange={(e) => setPTopic(e.target.value)} placeholder="Cities and transport" className={`${input} mt-1`} />
          </div>
          <div>
            <label className={label} htmlFor="p-kind">
              Question type
            </label>
            <select id="p-kind" value={pKind} onChange={(e) => setPKind(e.target.value)} className={`${input} mt-1`}>
              {["Opinion", "Discussion", "Problem–solution", "Two-part", "Advantages"].map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="p-vocab">
              Vocabulary (comma separated)
            </label>
            <input id="p-vocab" value={pVocab} onChange={(e) => setPVocab(e.target.value)} placeholder="commuter belt, hollowed-out centre" className={`${input} mt-1`} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="p-question">
              Question
            </label>
            <textarea
              id="p-question"
              value={pQuestion}
              onChange={(e) => setPQuestion(e.target.value)}
              rows={3}
              placeholder="Some people believe that working from home will make large cities less attractive. To what extent do you agree or disagree?"
              className={`${input} mt-1 resize-y`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="p-outline">
              Outline — one step per line (optional)
            </label>
            <textarea
              id="p-outline"
              value={pOutline}
              onChange={(e) => setPOutline(e.target.value)}
              rows={3}
              placeholder={"Introduction: state a clear position\nBody 1: the case for decline\nConclusion: qualified agreement"}
              className={`${input} mt-1 resize-y`}
            />
          </div>
          <div className="sm:col-span-2">
            <button
              className="btn-primary !py-2 !text-[12.5px]"
              disabled={busy || !pTitle.trim() || !pTopic.trim() || !pQuestion.trim()}
              onClick={async () => {
                const ok = await send(
                  { action: "prompt.create", title: pTitle, topic: pTopic, kind: pKind, question: pQuestion, outline: pOutline, vocabulary: pVocab },
                  "Prompt published."
                );
                if (ok) {
                  setPTitle("");
                  setPTopic("");
                  setPQuestion("");
                  setPOutline("");
                  setPVocab("");
                }
              }}
            >
              Add prompt
            </button>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {prompts.length === 0 && <li className="text-[12.5px] text-ink/40">No admin prompts yet.</li>}
          {prompts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-ink/10 bg-ink/[0.02] px-3 py-2">
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${p.active ? "bg-lime/20 text-limeDeep" : "bg-ink/10 text-ink/45"}`}>
                {p.active ? "Live" : "Hidden"}
              </span>
              <span className="min-w-0 flex-1 text-[12.5px] text-ink/75">
                {p.title} <span className="text-ink/35">· {p.topic} · {p.kind}</span>
              </span>
              <button
                className="text-[11.5px] font-semibold text-tealDeep hover:underline"
                disabled={busy}
                onClick={() => send({ action: "prompt.update", id: p.id, active: !p.active }, p.active ? "Prompt unpublished." : "Prompt published.")}
              >
                {p.active ? "Unpublish" : "Publish"}
              </button>
              <button
                className="text-[11.5px] font-semibold text-coralDeep hover:underline"
                disabled={busy}
                onClick={() => send({ action: "prompt.delete", id: p.id }, "Prompt deleted.")}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
