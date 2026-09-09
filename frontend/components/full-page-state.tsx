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
      <div className="w-full max-w-xl rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
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
