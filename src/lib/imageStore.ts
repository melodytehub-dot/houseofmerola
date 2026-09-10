import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/* ── Shared validation / naming ───────────────────────────────────── */

export const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

export const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export function safeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const base =
    path
      .basename(name, ext)
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "image";
  return `${Date.now().toString(36)}-${base}${ext}`;
}

export type UploadTarget = "github" | "s3" | "local";

/**
 * Pick the upload backend from the environment. GitHub is preferred when a
 * token + repo are present; otherwise S3-compatible storage; otherwise the
 * local dev filesystem.
 */
export function pickUploadTarget(): UploadTarget {
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) return "github";
  const s3Keys = ["UPLOAD_ENDPOINT", "UPLOAD_BUCKET", "UPLOAD_ACCESS_KEY_ID", "UPLOAD_SECRET_ACCESS_KEY"] as const;
  if (s3Keys.every((k) => process.env[k])) return "s3";
  return "local";
}

/* ── GitHub Contents API ─────────────────────────────────────────── */

export interface GitHubUploadOpts {
  repo: string;
  token: string;
  branch?: string;
  path?: string;
  publicBase?: string;
  /** Override for testing (defaults to the GitHub REST API). */
  apiBase?: string;
}

export async function uploadToGitHub(opts: GitHubUploadOpts, filename: string, buf: Buffer): Promise<string> {
  const [owner, name] = opts.repo.split("/");
  if (!owner || !name) throw new Error("GITHUB_REPO must be 'owner/repo'.");

  const branch = opts.branch || "main";
  const repoPath = (opts.path || "public/images").replace(/^\/+|\/+$/g, "");
  const filePath = `${repoPath}/${filename}`;
  const apiBase = (opts.apiBase || "https://api.github.com").replace(/\/+$/, "");

  const res = await fetch(`${apiBase}/repos/${owner}/${name}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${opts.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Upload image ${filename}`,
      content: buf.toString("base64"),
      branch,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}${detail ? ` · ${detail.slice(0, 180)}` : ""}`);
  }

  const base = opts.publicBase?.trim();
  if (base && /^https?:/i.test(base)) {
    return `${base.replace(/\/+$/, "")}/${filename}`;
  }
  return `/images/${filename}`;
}

/* ── S3-compatible object storage (Cloudflare R2, Supabase, AWS, MinIO) ── */

export interface S3UploadOpts {
  endpoint: string;
  region?: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Public URL to prepend to the object key, e.g. a R2 public domain or an S3 CDN. */
  publicBase: string;
  forcePathStyle?: boolean;
}

export async function uploadToS3(opts: S3UploadOpts, filename: string, buf: Buffer, mime: string): Promise<string> {
  const client = new S3Client({
    region: opts.region || "auto",
    endpoint: opts.endpoint,
    forcePathStyle: opts.forcePathStyle !== false,
    credentials: { accessKeyId: opts.accessKeyId, secretAccessKey: opts.secretAccessKey },
  });
  await client.send(
    new PutObjectCommand({
      Bucket: opts.bucket,
      Key: filename,
      Body: buf,
      ContentType: mime,
    }),
  );
  return `${opts.publicBase.replace(/\/+$/, "")}/${filename}`;
}
