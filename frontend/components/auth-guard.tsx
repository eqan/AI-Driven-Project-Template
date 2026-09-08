"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { isPublicPathname, sanitizeRedirectTarget } from "@/lib/auth";
import { useAuth } from "@/components/auth-provider";

function FullPageStatus({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-lg rounded-[32px] border border-white/10 bg-white/6 p-8 text-center shadow-[0_30px_120px_rgba(10,14,28,0.32)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/85">
          {eyebrow}
        </p>
        <h1 className="mt-5 text-3xl font-semibold text-foreground">{title}</h1>
        <p className="mt-4 text-base leading-7 text-muted">{description}</p>
      </div>
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const publicPath = isPublicPathname(pathname);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!publicPath && status === "unauthenticated") {
      const nextTarget = `${pathname}${window.location.search}`;
      router.replace(`/auth?next=${encodeURIComponent(nextTarget)}`);
      return;
    }

    if (publicPath && status === "authenticated") {
      const nextTarget = new URLSearchParams(window.location.search).get("next");
      router.replace(sanitizeRedirectTarget(nextTarget));
    }
  }, [pathname, publicPath, router, status]);

  if (!publicPath && status === "loading") {
    return (
      <FullPageStatus
        eyebrow="Secure Access"
        title="Checking your session"
        description="We’re verifying your Google sign-in before loading the app."
      />
    );
  }

  if (!publicPath && status !== "authenticated") {
    return (
      <FullPageStatus
        eyebrow="Redirecting"
        title="Sign-in required"
        description="Protected pages stay behind Google authentication. Taking you to the login screen now."
      />
    );
  }

  if (publicPath && status === "authenticated") {
    return (
      <FullPageStatus
        eyebrow="Authenticated"
        title="You’re already signed in"
        description="Taking you back into the app."
      />
    );
  }

  return <>{children}</>;
}
