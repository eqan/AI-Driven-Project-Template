type FullPageStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function FullPageState({
  eyebrow,
  title,
  description,
  action,
}: FullPageStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-8 text-center shadow-[0_30px_120px_rgba(10,14,28,0.28)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/85">
          {eyebrow}
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground">
          {title}
        </h1>
        <p className="mt-4 text-base leading-8 text-muted">{description}</p>
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
