import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border border-primary bg-background text-primary hover:bg-surface",
        // On the dark header / hero
        inverse: "bg-white text-primary hover:bg-surface",
        ghost: "text-primary hover:bg-surface",
        destructive: "bg-danger-strong text-white hover:bg-danger-strong/90",
        link: "text-primary underline underline-offset-4",
      },
      size: {
        // All sizes keep a ≥ 48px tap target (spec §11)
        default: "min-h-12 px-5 text-base",
        lg: "min-h-14 px-7 text-lg",
        icon: "size-12",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
