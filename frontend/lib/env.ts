const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, "") ?? "";
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

export const frontendEnv = Object.freeze({
  apiBaseUrl,
  googleClientId,
});

export function hasConfiguredGoogleClientId(clientId = frontendEnv.googleClientId) {
  return (
    clientId.length > 0 &&
    clientId !== "your-google-oauth-client-id.apps.googleusercontent.com"
  );
}

function isLocalApiHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

export function getApiBaseUrl() {
  if (!frontendEnv.apiBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in the frontend environment.");
  }

  let parsedApiUrl: URL;

  try {
    parsedApiUrl = new URL(frontendEnv.apiBaseUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must be a valid absolute URL.");
  }

  if (!["http:", "https:"].includes(parsedApiUrl.protocol)) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must use http or https.");
  }

  if (
    parsedApiUrl.protocol !== "https:" &&
    !isLocalApiHostname(parsedApiUrl.hostname)
  ) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL must use https outside local development.",
    );
  }

  if (
    typeof window !== "undefined" &&
    (parsedApiUrl.origin === window.location.origin ||
      parsedApiUrl.origin ===
        `${window.location.protocol}//${window.location.hostname}:3000`)
  ) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL must point to the backend server, not the frontend app.",
    );
  }

  return parsedApiUrl.toString().replace(/\/$/, "");
}
