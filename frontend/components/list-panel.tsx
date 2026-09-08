type ListPanelProps = {
  eyebrow: string;
  title: string;
  items: string[];
};

export function ListPanel({ eyebrow, title, items }: ListPanelProps) {
  return (
    <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-6 shadow-[0_24px_95px_rgba(7,10,20,0.18)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-foreground">
        {title}
      </h3>

      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-4 text-sm leading-7 text-muted dark:bg-white/4"
          >
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}
