import { title, subtitle } from "@/components/primitives";

type PageHeaderProps = {
  eyebrow: string;
  heading: string;
  description: string;
};

export function PageHeader({
  eyebrow,
  heading,
  description,
}: PageHeaderProps) {
  return (
    <header className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        {eyebrow}
      </p>
      <div className="max-w-3xl space-y-3">
        <h1 className={title({ size: "lg", color: "foreground" })}>{heading}</h1>
        <p className={subtitle({ class: "max-w-2xl text-base lg:text-lg" })}>
          {description}
        </p>
      </div>
    </header>
  );
}
