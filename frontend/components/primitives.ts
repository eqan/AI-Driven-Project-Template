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
      md: "text-[2.2rem] sm:text-4xl",
      lg: "text-4xl sm:text-5xl xl:text-[3.9rem]",
    },
  },
  defaultVariants: {
    size: "md",
    color: "foreground",
  },
});

export const subtitle = tv({
  base: "my-2 block w-full max-w-full text-base leading-7 text-muted lg:text-[1.05rem]",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
