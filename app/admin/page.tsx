import { SignInWithFreebuff, SignOutButton } from "@freebuff/auth/react";
import Link from "next/link";
import AdminPanel from "@/components/AdminPanel";
import { requireAdmin } from "@/lib/admin";
import { getDb, listAnnouncements, listPrompts } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin · Band Nine",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const gate = await requireAdmin();

  if (!gate.ok) {
    return (
      <div className="mx-auto max-w-lg py-14">
        <div className="card p-6">
          <h1 className="font-serif text-2xl text-ink">Admin</h1>
          <p className="mt-2 text-[13px] leading-6 text-ink/55">{gate.message}</p>
          {gate.status === 401 && (
            <div className="mt-5">
              <SignInWithFreebuff returnTo="/admin" className="btn-primary inline-block" />
            </div>
          )}
          {gate.status !== 401 && gate.user && (
            <dl className="mt-4 space-y-1 rounded-lg bg-ink/[0.03] px-3 py-2.5 text-[11.5px] text-ink/55">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-ink/35">Account</dt>
                <dd className="min-w-0 break-all">{gate.user.email ?? gate.user.sub}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-ink/35">Sub</dt>
                <dd className="min-w-0 break-all">{gate.user.sub}</dd>
              </div>
            </dl>
          )}
          {gate.status !== 401 && gate.user && (
            <div className="mt-4">
              <SignOutButton className="btn-ghost inline-block" />
            </div>
          )}
        </div>
      </div>
    );
  }

  const db = await getDb();
  const [announcements, prompts] = db ? await Promise.all([listAnnouncements(db), listPrompts(db)]) : [[], []];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink/35">Staff only</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Admin</h1>
          <p className="mt-1 text-[12.5px] text-ink/50">
            Signed in as {gate.user.name ?? gate.user.email ?? "a Freebuff user"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/stats" className="btn-primary">
            Site stats →
          </Link>
          <SignOutButton className="btn-ghost" />
        </div>
      </div>
      <AdminPanel initialAnnouncements={announcements} initialPrompts={prompts} dbReady={Boolean(db)} />
    </div>
  );
}
