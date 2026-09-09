type ListPanelProps = {
  eyebrow: string;
  title: string;
  items: string[];
};

export function ListPanel({ eyebrow, title, items }: ListPanelProps) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/75">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h3>

      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-4 text-sm leading-6 text-muted"
          >
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}
