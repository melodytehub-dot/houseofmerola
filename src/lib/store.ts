/* ────────────────────────────────────────────────────────────────
 * Persistence layer for the admin / site content.
 *
 * Backends (in order of preference):
 *   1. Postgres via the Neon serverless driver, production, durable,
 *      serverless-friendly. Requires env DATABASE_URL (a Neon, Supabase
 *      or other Postgres connection string). Use @neondatabase/serverless.
 *   2. A local JSON file , development only (writable filesystem).
 *   3. In-memory , last resort; not durable across serverless instances.
 * ──────────────────────────────────────────────────────────────── */
import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { neon } from "@neondatabase/serverless";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "store.json");

const inMemory = new Map<string, string>();

/* ── Postgres (Neon) backend ────────────────────────────────────── */

let _sql: ReturnType<typeof neon> | null = null;
let _ready: Promise<void> | null = null;

function dbUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
}

function hasDb(): boolean {
  return Boolean(dbUrl());
}

function sqlClient() {
  if (!_sql) _sql = neon(dbUrl()!);
  return _sql;
}

/** Ensure the two-column KV table exists (runs once, retries on a transient failure). */
function ensureDbReady(): Promise<void> {
  if (!_ready) {
    _ready = (async () => {
      await sqlClient()`create table if not exists hm_kv (
        key text primary key,
        value text not null,
        updated_at timestamptz not null default now()
      )`;
    })().catch((e) => {
      _ready = null;
      throw e;
    });
  }
  return _ready;
}

async function pgGet(key: string): Promise<string | null> {
  await ensureDbReady();
  const sql = sqlClient();
  const rows = (await sql`select value from hm_kv where key = ${key}`) as { value: string }[];
  return rows[0]?.value ?? null;
}

async function pgSet(key: string, value: string): Promise<void> {
  await ensureDbReady();
  await sqlClient()`insert into hm_kv (key, value)
    values (${key}, ${value})
    on conflict (key) do update set value = excluded.value, updated_at = now()`;
}

async function fileGet(key: string): Promise<string | null> {
  try {
    const raw = await readFile(FILE_PATH, "utf8");
    const data = JSON.parse(raw) as Record<string, string>;
    return data[key] ?? null;
  } catch {
    return null;
  }
}

async function fileSet(key: string, value: string): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    let data: Record<string, string> = {};
    try {
      data = JSON.parse(await readFile(FILE_PATH, "utf8"));
    } catch {
      /* start fresh */
    }
    data[key] = value;
    await writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch {
    /* filesystem may be read-only (Vercel); fall through to memory */
    inMemory.set(key, value);
  }
}

export async function readRaw(key: string): Promise<string | null> {
  if (hasDb()) {
    try {
      return await pgGet(key);
    } catch {
      /* fall through to file/memory */
    }
  }
  const fromFile = await fileGet(key);
  if (fromFile !== null) return fromFile;
  return inMemory.get(key) ?? null;
}

export async function writeRaw(key: string, value: string): Promise<void> {
  if (hasDb()) {
    try {
      await pgSet(key, value);
      return;
    } catch {
      /* fall through */
    }
  }
  await fileSet(key, value);
}

export async function readJson<T>(key: string): Promise<T | null> {
  const raw = await readRaw(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  await writeRaw(key, JSON.stringify(value));
}

/** Used for admin authorisation, not secret, but opaque. */
export function hashPassword(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}
