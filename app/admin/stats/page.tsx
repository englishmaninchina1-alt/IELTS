import { SignInWithFreebuff, SignOutButton } from "@freebuff/auth/react";
import Link from "next/link";
import StatsPanel from "@/components/StatsPanel";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Site stats · Band Nine",
  robots: { index: false, follow: false },
};

export default async function StatsPage() {
  const gate = await requireAdmin();

  if (!gate.ok) {
    return (
      <div className="mx-auto max-w-lg py-14">
        <div className="card p-6">
          <h1 className="font-serif text-2xl text-ink">Site stats</h1>
          <p className="mt-2 text-[13px] leading-6 text-ink/55">{gate.message}</p>
          {gate.status === 401 && (
            <div className="mt-5">
              <SignInWithFreebuff returnTo="/admin/stats" className="btn-primary inline-block" />
            </div>
          )}
          {gate.status !== 401 && gate.user && (
            <div className="mt-4">
              <SignOutButton className="btn-ghost inline-block" />
            </div>
          )}
          <Link href="/admin" className="mt-4 inline-block text-[12px] font-semibold text-tealDeep hover:underline">
            ← Back to admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink/35">Staff only</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Site stats</h1>
          <p className="mt-1 text-[12.5px] text-ink/50">
            Who visits, where they come from, and what they read. Signed in as {gate.user.name ?? gate.user.email ?? "a Freebuff user"}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="btn-ghost">
            ← Admin
          </Link>
          <SignOutButton className="btn-ghost" />
        </div>
      </div>
      <StatsPanel />
    </div>
  );
}
