import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

const COOKIE = "mt_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

export type User = { id: number; name: string; email: string; isAdmin: boolean };

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email, u.is_admin
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha256(token), Date.now()) as
    | { id: number; name: string; email: string; is_admin: number }
    | undefined;
  if (!row) return null;
  return { id: row.id, name: row.name, email: row.email, isAdmin: row.is_admin === 1 };
}

/** Solo se puede llamar desde una Server Action o un Route Handler. */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
  db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(
    sha256(token),
    userId,
    Date.now() + MAX_AGE_SECONDS * 1000,
  );
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    // Por defecto no se exige HTTPS para que la demo funcione desde un celular en la red local.
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
  store.delete(COOKIE);
}
