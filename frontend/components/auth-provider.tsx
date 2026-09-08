"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  clearPersistedAuthSession,
  persistAuthSession,
  readPersistedAuthToken,
} from "@/lib/auth";
import { loginWithGoogleCredential, verifyAuthToken } from "@/lib/api/auth";
import type { AuthenticatedUser, AuthStatus } from "@/types/auth";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  token: string | null;
  error: string | null;
  signInWithGoogleCredential: (credential: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
}

function getInitialSessionState() {
  const token = readPersistedAuthToken();

  return {
    status: "loading" as AuthStatus,
    user: null,
    token,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialSessionState] = useState(getInitialSessionState);
  const [status, setStatus] = useState<AuthStatus>(initialSessionState.status);
  const [user, setUser] = useState<AuthenticatedUser | null>(initialSessionState.user);
  const [token, setToken] = useState<string | null>(initialSessionState.token);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function bootstrapSession() {
      const storedToken = readPersistedAuthToken();

      if (!storedToken) {
        if (!isCancelled) {
          setToken(null);
          setUser(null);
          setStatus("unauthenticated");
        }
        return;
      }

      if (!isCancelled) {
        setToken(storedToken);
        setUser(null);
      }

      try {
        const verifiedUser = await verifyAuthToken(storedToken);

        if (isCancelled) {
          return;
        }

        persistAuthSession({
          token: storedToken,
          user: verifiedUser,
        });

        setToken(storedToken);
        setUser(verifiedUser);
        setError(null);
        setStatus("authenticated");
      } catch (bootstrapError) {
        if (isCancelled) {
          return;
        }

        clearPersistedAuthSession();
        setToken(null);
        setUser(null);
        setError(getErrorMessage(bootstrapError));
        setStatus("unauthenticated");
      }
    }

    bootstrapSession();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function signInWithGoogleCredential(credential: string) {
    setError(null);
    setStatus("loading");

    try {
      const session = await loginWithGoogleCredential(credential);

      persistAuthSession(session);

      startTransition(() => {
        setToken(session.token);
        setUser(session.user);
        setStatus("authenticated");
      });
    } catch (signInError) {
      clearPersistedAuthSession();
      setToken(null);
      setUser(null);
      setStatus("unauthenticated");
      setError(getErrorMessage(signInError));
      throw signInError;
    }
  }

  function signOut() {
    clearPersistedAuthSession();

    startTransition(() => {
      setToken(null);
      setUser(null);
      setError(null);
      setStatus("unauthenticated");
    });
  }

  const value = {
    status,
    user,
    token,
    error,
    signInWithGoogleCredential,
    signOut,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
