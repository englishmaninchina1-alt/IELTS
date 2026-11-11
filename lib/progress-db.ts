import { ensureSchema, type D1 } from "./db";

/** One saved profile per signed-in student, keyed on their Freebuff subject. */
export type StoredProgress = { data: string; updatedAt: string };

export async function loadProgress(db: D1, sub: string): Promise<StoredProgress | null> {
  await ensureSchema(db);
  const row = await db
    .prepare("SELECT data, updated_at FROM student_progress WHERE user_sub = ?")
    .bind(sub)
    .first<{ data: string; updated_at: string }>();
  return row ? { data: row.data, updatedAt: row.updated_at } : null;
}

export async function saveProgress(db: D1, sub: string, email: string | null, data: string): Promise<string> {
  await ensureSchema(db);
  const row = await db
    .prepare(
      `INSERT INTO student_progress (user_sub, email, data)
       VALUES (?, ?, ?)
       ON CONFLICT(user_sub) DO UPDATE SET data = excluded.data, email = excluded.email, updated_at = datetime('now')
       RETURNING updated_at`
    )
    .bind(sub, email, data)
    .first<{ updated_at: string }>();
  return row?.updated_at ?? new Date().toISOString();
}
