import { GoogleSignIn } from "@/components/google-sign-in";

export default function AuthPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-lg items-center justify-center">
      <div className="w-full rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
          Sign in
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          Access your workspace
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
          Continue with Google to open the protected app. If you were heading to a
          specific page, you will return there after verification.
        </p>

        <div className="mt-8">
          <GoogleSignIn />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            "Single sign-in provider.",
            "Protected routes verify first.",
            "Failed sessions come back here.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-6 text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
