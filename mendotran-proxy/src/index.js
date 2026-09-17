const UPSTREAM = "https://mendotran.oba.visionblo.com/oba_api/api/where/";

function withCors(headers) {
  const h = new Headers(headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type");
  return h;
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: withCors({}) });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers: withCors({}) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, "");
    if (!path || path.includes("..") || !path.endsWith(".json")) {
      return new Response("Not found", { status: 404, headers: withCors({}) });
    }

    const upstreamUrl = UPSTREAM + path + url.search;
    const upstreamResponse = await fetch(upstreamUrl, {
      cf: { cacheTtl: 15, cacheEverything: true },
    });

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: withCors(upstreamResponse.headers),
    });
  },
};
