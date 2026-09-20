import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import {
  ALLOWED_EXT,
  MIME_BY_EXT,
  pickUploadTarget,
  safeFilename,
  uploadToGitHub,
  uploadToS3,
} from "@/lib/imageStore";

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, AVIF or GIF image." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.byteLength === 0) {
    return NextResponse.json({ error: "Empty file." }, { status: 400 });
  }
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large (max 6 MB). Compress it first." }, { status: 413 });
  }

  const filename = safeFilename(file.name);
  const mime = MIME_BY_EXT[ext] || "application/octet-stream";
  const target = pickUploadTarget();

  // 1) GitHub Contents API, when a token + repo are configured.
  if (target === "github") {
    try {
      const url = await uploadToGitHub(
        {
          repo: process.env.GITHUB_REPO!,
          token: process.env.GITHUB_TOKEN!,
          branch: process.env.GITHUB_BRANCH,
          path: process.env.GITHUB_PATH,
          publicBase: process.env.GITHUB_PUBLIC_BASE,
          apiBase: process.env.GITHUB_API_BASE,
        },
        filename,
        buf,
      );
      return NextResponse.json({ url });
    } catch (err) {
      return NextResponse.json(
        { error: `GitHub upload failed: ${err instanceof Error ? err.message : "unknown"}` },
        { status: 502 },
      );
    }
  }

  // 2) S3-compatible object storage, Cloudflare R2, Supabase, AWS, MinIO.
  if (target === "s3") {
    try {
      const base = (process.env.UPLOAD_PUBLIC_BASE || `/images`).trim();
      const url = await uploadToS3(
        {
          endpoint: process.env.UPLOAD_ENDPOINT!,
          region: process.env.UPLOAD_REGION,
          bucket: process.env.UPLOAD_BUCKET!,
          accessKeyId: process.env.UPLOAD_ACCESS_KEY_ID!,
          secretAccessKey: process.env.UPLOAD_SECRET_ACCESS_KEY!,
          publicBase: base,
          forcePathStyle: process.env.UPLOAD_FORCE_PATH_STYLE !== "false",
        },
        filename,
        buf,
        mime,
      );
      return NextResponse.json({ url });
    } catch (err) {
      return NextResponse.json(
        { error: `S3 upload failed: ${err instanceof Error ? err.message : "unknown"}` },
        { status: 502 },
      );
    }
  }

  // 3) Local / dev filesystem, writes into public/images.
  try {
    const rel = path.join("public", "images");
    await mkdir(rel, { recursive: true });
    await writeFile(path.join(rel, filename), buf);
    return NextResponse.json({ url: `/images/${filename}` });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not save image: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 500 },
    );
  }
}

