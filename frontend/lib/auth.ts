import type { AuthenticatedUser, StoredAuthSession } from "@/types/auth";

export const AUTH_TOKEN_COOKIE = "project_template_auth_token";

function isBrowser() {
  return typeof window !== "undefined";
}

function decodeBase64Url(value: string) {
  if (!isBrowser()) {
    return null;
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  try {
    return window.atob(padded);
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): Partial<AuthenticatedUser> | null {
  const payload = token.split(".")[1];

  if (!payload) {
    return null;
  }

  const decoded = decodeBase64Url(payload);

  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as Partial<AuthenticatedUser>;
  } catch {
    return null;
  }
}

function getTokenMaxAge(token: string) {
  const payload = decodeJwtPayload(token);
  const expirySeconds = payload?.exp;

  if (!expirySeconds) {
    return 60 * 60 * 24 * 7;
  }

  const remaining = Math.floor(expirySeconds - Date.now() / 1000);

  return remaining > 0 ? remaining : 0;
}

function writeCookie(token: string) {
  if (!isBrowser()) {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const maxAge = getTokenMaxAge(token);

  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Priority=High${secure}`;
}

function clearCookie() {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function persistAuthSession(session: StoredAuthSession) {
  if (!isBrowser()) {
    return;
  }

  writeCookie(session.token);
}

export function readPersistedAuthToken() {
  if (!isBrowser()) {
    return null;
  }

  const cookiePrefix = `${AUTH_TOKEN_COOKIE}=`;
  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(cookiePrefix));

  if (!tokenCookie) {
    return null;
  }

  return decodeURIComponent(tokenCookie.slice(cookiePrefix.length));
}

export function clearPersistedAuthSession() {
  if (!isBrowser()) {
    return;
  }

  clearCookie();
}

export function isPublicPathname(pathname: string) {
  return pathname === "/auth";
}

export function sanitizeRedirectTarget(target: string | null | undefined) {
  if (!target || !target.startsWith("/") || target.startsWith("//")) {
    return "/";
  }

  return target;
}
