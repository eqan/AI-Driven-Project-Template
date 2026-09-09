import { tv } from "tailwind-variants";

export const title = tv({
  base: "inline font-semibold tracking-[-0.05em] leading-[0.95] text-balance",
  variants: {
    color: {
      blue: "text-accent",
      foreground: "text-foreground",
      muted: "text-muted",
    },
    size: {
      sm: "text-3xl sm:text-4xl",
      md: "text-3xl sm:text-[2.6rem]",
      lg: "text-4xl sm:text-[2.9rem] xl:text-[3.2rem]",
    },
  },
  defaultVariants: {
    size: "md",
    color: "foreground",
  },
});

export const subtitle = tv({
  base: "my-2 block w-full max-w-full text-base leading-7 text-muted",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
