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
    <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(127,154,255,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_120px_rgba(7,10,20,0.22)] backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/80">
            {eyebrow}
          </p>

          <div className="max-w-4xl space-y-4">
            <h1 className={title({ size: "lg", color: "foreground" })}>{heading}</h1>
            <p className={subtitle({ class: "max-w-2xl text-base lg:text-lg" })}>
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
                      ? "rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                      : "rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
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
          <aside className="rounded-[28px] border border-white/10 bg-black/12 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] dark:bg-white/4">
            {asideTitle ? (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
                {asideTitle}
              </p>
            ) : null}
            {asideDescription ? (
              <p className="mt-4 text-sm leading-7 text-muted">{asideDescription}</p>
            ) : null}
          </aside>
        ) : null}
      </div>

      {metrics.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[24px] border border-white/10 bg-black/12 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] dark:bg-white/4"
            >
              <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {metric.value}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent/80">
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
