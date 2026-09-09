import NextLink from "next/link";

import { subtitle, title } from "@/components/primitives";

type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type HeroMetric = {
  value: string;
  label: string;
  note: string;
};

type HeroBannerProps = {
  eyebrow: string;
  heading: string;
  description: string;
  actions?: HeroAction[];
  metrics?: HeroMetric[];
  asideTitle?: string;
  asideDescription?: string;
};

export function HeroBanner({
  eyebrow,
  heading,
  description,
  actions = [],
  metrics = [],
  asideTitle,
  asideDescription,
}: HeroBannerProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr] xl:items-start">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/75">
            {eyebrow}
          </p>

          <div className="max-w-3xl space-y-3">
            <h1 className={title({ size: "lg", color: "foreground" })}>{heading}</h1>
            <p className={subtitle({ class: "max-w-2xl" })}>
              {description}
            </p>
          </div>

          {actions.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {actions.map((action) => (
                <NextLink
                  key={action.href}
                  className={
                    action.variant === "secondary"
                      ? "rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-strong)]"
                      : "rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
                  }
                  href={action.href}
                >
                  {action.label}
                </NextLink>
              ))}
            </div>
          ) : null}
        </div>

        {asideTitle || asideDescription ? (
          <aside className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5">
            {asideTitle ? (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/75">
                {asideTitle}
              </p>
            ) : null}
            {asideDescription ? (
              <p className="mt-4 text-sm leading-6 text-muted">{asideDescription}</p>
            ) : null}
          </aside>
        ) : null}
      </div>

      {metrics.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5"
            >
              <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {metric.value}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent/75">
                {metric.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">{metric.note}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
