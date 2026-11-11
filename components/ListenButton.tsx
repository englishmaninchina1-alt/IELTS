"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Plays text back in a natural British voice via /api/tts.
 * Audio is fetched once per text and cached in memory for the session.
 */
export default function ListenButton({ text, className = "btn-ghost" }: { text: string; className?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [message, setMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setState("idle");
  }, []);

  const play = useCallback(async () => {
    if (state === "playing") {
      stop();
      return;
    }
    setMessage("");
    setState("loading");
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(data.error ?? "Audio is unavailable right now.");
        setState("error");
        return;
      }

      const blob = await res.blob();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = audioRef.current ?? new Audio();
      audio.src = url;
      audio.onended = () => setState("idle");
      audio.onerror = () => setState("error");
      audioRef.current = audio;
      await audio.play();
      setState("playing");
    } catch {
      setMessage("Your browser blocked playback.");
      setState("error");
    }
  }, [state, stop, text]);

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" onClick={play} className={className} aria-live="polite">
        {state === "loading" ? "Preparing voice…" : state === "playing" ? "■ Stop" : "🔊 British voice"}
      </button>
      {state === "error" && message && <span className="text-[11px] leading-5 text-[#8A6100]">{message}</span>}
    </span>
  );
}
