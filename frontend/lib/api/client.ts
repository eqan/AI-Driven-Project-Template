import { getApiBaseUrl } from "@/lib/env";

async function parseResponse(response: Response) {
  const rawText = await response.text();

  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    return { detail: rawText };
  }
}

function errorMessageFromResponse(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const record = payload as Record<string, unknown>;
  const detail = record.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  const message = record.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

export async function apiRequest<TResponse>(
  pathname: string,
  init: RequestInit,
  fallbackErrorMessage: string,
) {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiBaseUrl()}${pathname}`, {
    cache: "no-store",
    credentials: init.credentials ?? "omit",
    redirect: init.redirect ?? "error",
    referrerPolicy: init.referrerPolicy ?? "no-referrer",
    ...init,
    headers,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(errorMessageFromResponse(payload, fallbackErrorMessage));
  }

  return payload as TResponse;
}
