import { ApiError } from "./api-error";
import type { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

interface RequestOptions {
  signal?: AbortSignal;
  params?: Record<string, string | number | boolean | undefined>;
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (json.success && json.data?.accessToken) {
    setAccessToken(json.data.accessToken);
    return json.data.accessToken;
  }
  return null;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = BASE_URL.startsWith("http")
    ? new URL(`${BASE_URL}${path}`)
    : new URL(
        `${BASE_URL}${path}`,
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
      );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

function buildHeaders(body?: unknown): HeadersInit {
  const headers: Record<string, string> = {};
  if (!isFormData(body)) {
    headers["Content-Type"] = "application/json";
  }
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts?: RequestOptions,
): Promise<T> {
  const url = buildUrl(path, opts?.params);
  const requestBody =
    body === undefined ? undefined : isFormData(body) ? body : JSON.stringify(body);

  const res = await fetch(url, {
    method,
    headers: buildHeaders(body),
    credentials: "include",
    body: requestBody,
    signal: opts?.signal,
  });

  // Handle 401 — attempt token refresh once
  if (res.status === 401 && accessToken) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;
    if (newToken) {
      // Retry the original request with new token
      const retryRes = await fetch(url, {
        method,
        headers: buildHeaders(body),
        credentials: "include",
        body: requestBody,
        signal: opts?.signal,
      });
      const retryJson: ApiResponse<T> = await retryRes.json();
      if (!retryJson.success) {
        throw new ApiError(
          retryRes.status,
          retryJson.error.code,
          retryJson.error.message,
          retryJson.error.details,
        );
      }
      return retryJson.data;
    }
    // Refresh failed — throw auth error
    throw new ApiError(401, "UNAUTHORIZED", "Session expired. Please log in again.");
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new ApiError(
      res.status,
      json.error.code,
      json.error.message,
      json.error.details,
    );
  }

  return json.data;
}

async function downloadBinary(
  path: string,
  opts?: RequestOptions,
): Promise<{ blob: Blob; filename: string | null }> {
  const url = buildUrl(path, opts?.params);

  const doFetch = () =>
    fetch(url, {
      method: "GET",
      headers: buildHeaders(),
      credentials: "include",
      signal: opts?.signal,
    });

  let res = await doFetch();

  if (res.status === 401 && accessToken) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;
    if (newToken) {
      res = await doFetch();
    } else {
      throw new ApiError(401, "UNAUTHORIZED", "Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    let message = `Download failed (${res.status})`;
    let code = "DOWNLOAD_FAILED";
    try {
      const json = await res.json();
      if (json?.error?.message) message = json.error.message;
      if (json?.error?.code) code = json.error.code;
    } catch {
      // Non-JSON error body — keep the generic message.
    }
    throw new ApiError(res.status, code, message);
  }

  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition");
  const match = cd?.match(/filename="?([^";]+)"?/);
  return { blob, filename: match?.[1] ?? null };
}

export const apiClient = {
  get<T>(path: string, opts?: RequestOptions) {
    return request<T>("GET", path, undefined, opts);
  },
  post<T>(path: string, body?: unknown, opts?: RequestOptions) {
    return request<T>("POST", path, body, opts);
  },
  patch<T>(path: string, body?: unknown, opts?: RequestOptions) {
    return request<T>("PATCH", path, body, opts);
  },
  delete<T>(path: string, opts?: RequestOptions) {
    return request<T>("DELETE", path, undefined, opts);
  },
  download(path: string, opts?: RequestOptions) {
    return downloadBinary(path, opts);
  },
};
