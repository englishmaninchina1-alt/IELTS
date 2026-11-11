"use client";

import { SignInWithFreebuff, SignOutButton, useFreebuffUser } from "@freebuff/auth/react";

/** Sign-in prompt or account strip shown above the saved progress. */
export default function ProgressAccount() {
  const { user, isLoading } = useFreebuffUser();
  if (isLoading) return null;

  if (user) {
    return (
      <div className="card mb-4 flex flex-wrap items-center gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-limeDeep">Saved to your account</p>
          <p className="mt-1 truncate text-[13px] font-semibold text-ink">
            {user.name || user.email || "Your Freebuff account"}
          </p>
          <p className="mt-0.5 text-[11.5px] leading-5 text-ink/45">
            Bands, vocabulary and your streak follow you to any device you sign in on.
          </p>
        </div>
        <SignOutButton returnTo="/progress" className="btn-ghost ml-auto" />
      </div>
    );
  }

  return (
    <div className="card mb-4 flex flex-wrap items-center gap-3 p-4">
      <div className="min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink/35">Keep your progress</p>
        <p className="mt-1 text-[13px] font-semibold text-ink">Sign in to save your bands, vocabulary and streak.</p>
        <p className="mt-0.5 text-[11.5px] leading-5 text-ink/45">
          Work still saves in this browser — signing in adds an account copy and syncs it across your devices.
        </p>
      </div>
      <SignInWithFreebuff returnTo="/progress" className="btn-primary sm:ml-auto">
        Sign in with Freebuff
      </SignInWithFreebuff>
    </div>
  );
}
