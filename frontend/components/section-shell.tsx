type SectionShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            {title}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-muted">{description}</p>
      </div>

      {children}
    </section>
  );
}
