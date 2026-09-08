"use client";

import Script from "next/script";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
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
              theme: "filled_black" | "outline" | "filled_blue";
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

function isConfiguredGoogleClientId(clientId: string) {
  return (
    clientId.length > 0 &&
    clientId !== "your-google-oauth-client-id.apps.googleusercontent.com"
  );
}

export function GoogleSignIn() {
  const router = useRouter();
  const { clearError, error, signInWithGoogleCredential, status } = useAuth();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const initializedClientIdRef = useRef<string | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const missingConfigError = isConfiguredGoogleClientId(clientId)
    ? null
    : "Set a real NEXT_PUBLIC_GOOGLE_CLIENT_ID before using Google sign-in.";

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
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      shape: "pill",
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

      <div className="space-y-5">
        <div
          className="rounded-[20px] border border-white/8 bg-white/3 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          ref={buttonRef}
        />

        {isSubmitting || status === "loading" ? (
          <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-foreground">
            Finishing sign-in and verifying your session...
          </div>
        ) : null}

        {activeError ? (
          <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {activeError}
          </div>
        ) : null}
      </div>
    </>
  );
}
