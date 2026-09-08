import { GoogleSignIn } from "@/components/google-sign-in";

export default function AuthPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md items-center">
      <div className="w-full rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(120,168,255,0.12),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 shadow-[0_28px_110px_rgba(7,10,20,0.22)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/85">
          Authentication
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">
          Sign in with Google
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Continue to the app with your Google account.
        </p>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-black/12 p-5 dark:bg-white/4">
          <GoogleSignIn />
        </div>
      </div>
    </section>
  );
}
