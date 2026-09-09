type InfoCardProps = {
  title: string;
  description: string;
  kicker?: string;
};

export function InfoCard({ title, description, kicker }: InfoCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      {kicker ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent/75">
          {kicker}
        </p>
      ) : null}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
