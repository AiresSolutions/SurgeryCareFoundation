import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PRODUCTION_BACKEND_PROXY_FALLBACK = "http://213.199.63.29/surgery-care-api";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function buildTargetUrl(request: NextRequest, path: string[]) {
  const backendOrigin =
    process.env.BACKEND_PROXY_ORIGIN ??
    (process.env.NODE_ENV === "production" ? PRODUCTION_BACKEND_PROXY_FALLBACK : undefined);

  if (!backendOrigin) {
    throw new Error("BACKEND_PROXY_ORIGIN is not configured");
  }

  const url = new URL(`${backendOrigin.replace(/\/$/, "")}/api/v1/${path.join("/")}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  return url;
}

async function proxy(request: NextRequest, path: string[]) {
  let target: URL;

  try {
    target = buildTargetUrl(request, path);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BACKEND_PROXY_NOT_CONFIGURED",
          message: error instanceof Error ? error.message : "Backend proxy is not configured",
        },
      },
      { status: 500 },
    );
  }

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase()) && key.toLowerCase() !== "set-cookie") {
      responseHeaders.append(key, value);
    }
  });

  const setCookieValues =
    typeof (upstream.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie === "function"
      ? (upstream.headers as Headers & { getSetCookie: () => string[] }).getSetCookie()
      : [];

  // Backend may set Domain=<its own host> (e.g. "localhost") which the
  // browser would reject when it sees this proxy's host. Strip Domain so
  // the cookie defaults to the request host.
  const rewriteCookie = (cookie: string) => cookie.replace(/;\s*Domain=[^;]*/gi, "");

  if (setCookieValues.length > 0) {
    setCookieValues.forEach((cookie) => responseHeaders.append("set-cookie", rewriteCookie(cookie)));
  } else {
    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) {
      responseHeaders.append("set-cookie", rewriteCookie(setCookie));
    }
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } },
) {
  return proxy(request, context.params.path);
}

export async function POST(
  request: NextRequest,
  context: { params: { path: string[] } },
) {
  return proxy(request, context.params.path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: { path: string[] } },
) {
  return proxy(request, context.params.path);
}

export async function PUT(
  request: NextRequest,
  context: { params: { path: string[] } },
) {
  return proxy(request, context.params.path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { path: string[] } },
) {
  return proxy(request, context.params.path);
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: { path: string[] } },
) {
  return proxy(request, context.params.path);
}
