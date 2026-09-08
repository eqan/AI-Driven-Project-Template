import { GoogleSignIn } from "@/components/google-sign-in";

export default function AuthPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-4xl items-center justify-center">
      <div className="w-full rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(127,154,255,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_120px_rgba(7,10,20,0.24)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-emerald-400/18 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100">
              Workspace access
            </div>

            <div className="space-y-4">
              <h1 className="max-w-md text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                Sign in to your workspace
              </h1>
              <p className="max-w-lg text-sm leading-7 text-foreground/74 sm:text-base">
                Use your Google account to continue. If you were heading to a
                protected route, you will return there after verification.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Google handles identity for this workspace.",
                "Protected routes open only after session verification.",
                "Expired sessions return here with a clear next step.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-white/8 bg-black/12 px-4 py-3 text-sm leading-6 text-muted dark:bg-white/4"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-6 shadow-[0_24px_80px_rgba(7,10,20,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/85">
              Sign in
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">
              Continue with Google
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              One sign-in method, one clear next step.
            </p>

            <div className="mt-6">
              <GoogleSignIn />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
