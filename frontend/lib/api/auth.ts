import type {
  AuthenticatedUser,
  GoogleLoginResponse,
  StoredAuthSession,
  VerifyTokenResponse,
} from "@/types/auth";
import { apiRequest } from "@/lib/api/client";

function mapUser(user: Partial<AuthenticatedUser>): AuthenticatedUser {
  return {
    sub: user.sub ?? "",
    email: user.email ?? "",
    name: user.name ?? "Project User",
    picture: user.picture ?? "",
    exp: user.exp,
  };
}

export async function loginWithGoogleCredential(
  credential: string,
): Promise<StoredAuthSession> {
  const payload = await apiRequest<GoogleLoginResponse>(
    "/google-login",
    {
      method: "POST",
      body: JSON.stringify({ code: credential }),
    },
    "The authentication request failed.",
  );

  if (!payload?.result?.token) {
    throw new Error("The authentication request failed.");
  }

  return {
    token: payload.result.token,
    user: mapUser(payload.result.user_info),
  };
}

export async function verifyAuthToken(token: string): Promise<AuthenticatedUser> {
  const payload = await apiRequest<VerifyTokenResponse>(
    "/verify-token",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    "The authentication request failed.",
  );

  if (!payload?.user) {
    throw new Error("The authentication request failed.");
  }

  return mapUser(payload.user);
}
