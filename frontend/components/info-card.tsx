type InfoCardProps = {
  title: string;
  description: string;
  kicker?: string;
};

export function InfoCard({ title, description, kicker }: InfoCardProps) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(7,10,20,0.18)] backdrop-blur">
      {kicker ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
          {kicker}
        </p>
      ) : null}
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </article>
  );
}
