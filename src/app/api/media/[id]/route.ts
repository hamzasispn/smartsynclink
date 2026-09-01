import { readMedia } from "@/lib/media";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const file = await readMedia(id);
  if (!file) return new Response("Not found", { status: 404 });

  // The id is the content's only address and rows are never rewritten, so the
  // bytes at a given URL can never change — safe to cache forever.
  const headers: Record<string, string> = {
    "content-type": file.mime,
    "cache-control": "public, max-age=31536000, immutable",
    "accept-ranges": "bytes",
  };

  // Byte ranges matter for video: seeking the timeline is a range request, and
  // Safari refuses to play a source that doesn't answer one at all.
  const range = request.headers.get("range");
  const match = range?.match(/^bytes=(\d*)-(\d*)$/);

  if (match && file.mime.startsWith("video/")) {
    const size = file.body.length;
    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;

    if (start >= size || end < start) {
      return new Response(null, {
        status: 416,
        headers: { "content-range": `bytes */${size}` },
      });
    }

    return new Response(new Uint8Array(file.body.subarray(start, end + 1)), {
      status: 206,
      headers: {
        ...headers,
        "content-range": `bytes ${start}-${end}/${size}`,
        "content-length": String(end - start + 1),
      },
    });
  }

  return new Response(new Uint8Array(file.body), {
    headers: { ...headers, "content-length": String(file.body.length) },
  });
}
