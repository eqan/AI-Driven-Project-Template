"use client";

import { useEffect } from "react";

import { FullPageState } from "@/components/full-page-state";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FullPageState
      action={(
        <button
          className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      )}
      description="A route-level error interrupted the workspace. You can retry the segment without leaving the app."
      eyebrow="Route Error"
      title="Something went wrong."
    />
  );
}
