"use client";

import Script from "next/script";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { frontendEnv, hasConfiguredGoogleClientId } from "@/lib/env";
import { sanitizeRedirectTarget } from "@/lib/auth";

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            ux_mode?: "popup" | "redirect";
            context?: "signin" | "signup" | "use";
            cancel_on_tap_outside?: boolean;
            itp_support?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: "filled_black" | "outline" | "filled_blue" | "outline_dark";
              size: "large" | "medium" | "small";
              text:
                | "signin_with"
                | "signup_with"
                | "continue_with"
                | "signin";
              shape: "pill" | "rectangular";
              width?: number;
              logo_alignment?: "left" | "center";
            },
          ) => void;
        };
      };
    };
    __projectTemplateGoogleClientId?: string;
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Google sign-in did not complete. Please try again.";
}

export function GoogleSignIn() {
  const router = useRouter();
  const { clearError, error, signInWithGoogleCredential, status } = useAuth();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const initializedClientIdRef = useRef<string | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientId = frontendEnv.googleClientId;
  const missingConfigError = hasConfiguredGoogleClientId(clientId)
    ? null
    : "Set a real NEXT_PUBLIC_GOOGLE_CLIENT_ID before using Google sign-in.";

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const nextTarget = new URLSearchParams(window.location.search).get("next");
    router.replace(sanitizeRedirectTarget(nextTarget));
  }, [router, status]);

  useEffect(() => {
    if (missingConfigError || isScriptReady) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLocalError((currentError) => {
        if (currentError) {
          return currentError;
        }

        return "Google sign-in is taking longer than expected to load. Reload the page and verify network access if the button never appears.";
      });
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isScriptReady, missingConfigError]);

  const handleCredentialResponse = useEffectEvent(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        setLocalError("Google did not return a usable credential.");
        return;
      }

      clearError();
      setLocalError(null);
      setIsSubmitting(true);

      try {
        await signInWithGoogleCredential(response.credential);
        const nextTarget = new URLSearchParams(window.location.search).get("next");
        router.replace(sanitizeRedirectTarget(nextTarget));
      } catch (signInError) {
        setLocalError(getErrorMessage(signInError));
      } finally {
        setIsSubmitting(false);
      }
    },
  );

  useEffect(() => {
    if (!isScriptReady || !buttonRef.current) {
      return;
    }

    if (missingConfigError) {
      return;
    }

    const googleIdentity = window.google?.accounts?.id;

    if (!googleIdentity) {
      return;
    }

    buttonRef.current.innerHTML = "";

    if (
      initializedClientIdRef.current !== clientId &&
      window.__projectTemplateGoogleClientId !== clientId
    ) {
      googleIdentity.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: "popup",
        context: "signin",
        cancel_on_tap_outside: true,
        itp_support: true,
      });

      initializedClientIdRef.current = clientId;
      window.__projectTemplateGoogleClientId = clientId;
    }

    googleIdentity.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: Math.min(buttonRef.current.clientWidth || 360, 360),
      logo_alignment: "left",
    });
  }, [
    clientId,
    handleCredentialResponse,
    isScriptReady,
    missingConfigError,
  ]);

  const activeError = missingConfigError ?? localError ?? error;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          setIsScriptReady(true);

          if (!window.google?.accounts?.id) {
            setLocalError("Google Identity Services failed to initialize.");
          }
        }}
        onError={() => {
          setLocalError("Unable to load Google Identity Services.");
        }}
      />

      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 sm:p-5">
          <p className="text-sm leading-6 text-muted">
            Google is the configured sign-in method for this workspace.
          </p>

          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4">
            <div
              className="min-h-[44px] w-full max-w-[360px]"
              ref={buttonRef}
            />

            {!isScriptReady && !missingConfigError ? (
              <div className="mt-3 h-11 max-w-[360px] animate-pulse rounded-xl border border-[var(--line)] bg-slate-100" />
            ) : null}
          </div>
        </div>

        {isSubmitting ? (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-foreground">
            Finishing sign-in and verifying your session...
          </div>
        ) : status === "loading" ? (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-muted">
            Checking whether you already have an active session...
          </div>
        ) : null}

        {activeError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {activeError}
          </div>
        ) : null}
      </div>
    </>
  );
}
