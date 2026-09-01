import sharp from "sharp";
import { sql } from "./db";

export type MediaItem = {
  id: string;
  filename: string;
  mime: string;
  width: number | null;
  height: number | null;
  bytes: number;
  url: string;
};

const MAX_UPLOAD = 12 * 1024 * 1024; // what we accept before resizing
const MAX_VIDEO = 64 * 1024 * 1024; // videos are stored as-is, so cap harder
const MAX_EDGE = 1920;

/**
 * Accepts a browser File, normalises it, and stores it.
 *
 * Everything becomes webp at most 1920px on its long edge — a phone photo
 * dropped into the logo field would otherwise be a 6MB row served on every
 * page load. SVG is passed through untouched because rasterising it would
 * defeat the point of uploading one.
 *
 * Video is stored byte for byte — no re-encode. Transcoding would mean ffmpeg
 * on the request path, and a marketing clip is already delivered compressed.
 */
export async function storeUpload(file: File): Promise<MediaItem> {
  const isVideo = file.type.startsWith("video/");
  if (!isVideo && !file.type.startsWith("image/")) {
    throw new Error("That is not an image or a video.");
  }

  const cap = isVideo ? MAX_VIDEO : MAX_UPLOAD;
  if (file.size > cap) {
    throw new Error(
      `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is ${cap / 1024 / 1024}MB.`,
    );
  }

  const input = Buffer.from(await file.arrayBuffer());
  let data = input;
  let mime = "image/webp";
  let width: number | null = null;
  let height: number | null = null;

  if (isVideo || file.type === "image/svg+xml") {
    mime = file.type;
  } else {
    const image = sharp(input).rotate(); // honour EXIF orientation
    const meta = await image.metadata();
    const resized =
      (meta.width ?? 0) > MAX_EDGE || (meta.height ?? 0) > MAX_EDGE
        ? image.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside" })
        : image;
    const out = await resized.webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
    data = out.data;
    width = out.info.width;
    height = out.info.height;
  }

  const name = file.name.replace(/\.[^.]+$/, "") || "image";
  const rows = await sql`
    insert into media (filename, mime, width, height, bytes, data)
    values (${name}, ${mime}, ${width}, ${height}, ${data.length},
            decode(${data.toString("base64")}, 'base64'))
    returning id`;

  const id = rows[0].id as string;
  return { id, filename: name, mime, width, height, bytes: data.length, url: `/api/media/${id}` };
}

export async function listMedia(limit = 60): Promise<MediaItem[]> {
  const rows = await sql`
    select id, filename, mime, width, height, bytes
    from media order by created_at desc limit ${limit}`;
  return rows.map((r) => ({ ...(r as Omit<MediaItem, "url">), url: `/api/media/${r.id}` }));
}

/** base64 round-trip: the driver hands bytea back as a hex string otherwise. */
export async function readMedia(id: string) {
  const rows = await sql`
    select mime, encode(data, 'base64') as b64 from media where id = ${id}`;
  if (!rows[0]) return null;
  return {
    mime: rows[0].mime as string,
    body: Buffer.from(rows[0].b64 as string, "base64"),
  };
}

export async function deleteMedia(id: string) {
  await sql`delete from media where id = ${id}`;
}
