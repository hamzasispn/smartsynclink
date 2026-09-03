import { readMedia } from "@/lib/media";

/**
 * Most a single range response returns.
 *
 * A <video> opens with `Range: bytes=0-`, which without a cap means the whole
 * file, base64 encoded, out of Postgres, on every seek. Capped, each response
 * is small and the browser simply asks for the next chunk.
 */
const CHUNK = 1024 * 1024;

const headersFor = (mime: string) => ({
  "content-type": mime,
  // The id is the content's only address and rows are never rewritten, so the
  // bytes at a given URL can never change — safe to cache forever.
  "cache-control": "public, max-age=31536000, immutable",
  "accept-ranges": "bytes",
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const match = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);

  if (match) {
    const start = match[1] ? Number(match[1]) : 0;
    const wantedEnd = match[2] ? Number(match[2]) : start + CHUNK - 1;

    // The slice happens in SQL — see readMedia. Asking past the end is fine,
    // Postgres returns what exists and the real end is derived from that.
    const file = await readMedia(id, {
      start,
      end: Math.min(wantedEnd, start + CHUNK - 1),
    });
    if (!file) return new Response("Not found", { status: 404 });

    if (start >= file.size || file.body.length === 0) {
      return new Response(null, {
        status: 416,
        headers: { "content-range": `bytes */${file.size}` },
      });
    }

    const end = start + file.body.length - 1;
    return new Response(new Uint8Array(file.body), {
      status: 206,
      headers: {
        ...headersFor(file.mime),
        "content-range": `bytes ${start}-${end}/${file.size}`,
        "content-length": String(file.body.length),
      },
    });
  }

  const file = await readMedia(id);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file.body), {
    headers: {
      ...headersFor(file.mime),
      "content-length": String(file.body.length),
    },
  });
}
