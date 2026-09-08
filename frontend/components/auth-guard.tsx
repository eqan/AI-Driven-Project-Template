"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { FullPageState } from "@/components/full-page-state";
import { useAuth } from "@/components/auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      const nextTarget = `${pathname}${window.location.search}`;
      router.replace(`/auth?next=${encodeURIComponent(nextTarget)}`);
    }
  }, [pathname, router, status]);

  if (status === "loading") {
    return (
      <FullPageState
        eyebrow="Secure Access"
        title="Checking your session"
        description="We’re verifying your Google sign-in before loading the protected workspace."
      />
    );
  }

  if (status !== "authenticated") {
    return (
      <FullPageState
        eyebrow="Redirecting"
        title="Sign-in required"
        description="Protected routes stay behind Google authentication. Taking you to the sign-in screen now."
      />
    );
  }

  return <>{children}</>;
}
