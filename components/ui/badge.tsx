import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Each tone pairs a tinted background with a text colour that passes AA on it.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "border-border bg-surface text-foreground",
        primary: "border-primary/30 bg-primary/10 text-primary",
        success: "border-success/40 bg-success/10 text-success-strong",
        warning: "border-warning/60 bg-warning/15 text-warning-strong",
        danger: "border-danger/40 bg-danger/10 text-danger-strong",
        harvest: "border-harvest/50 bg-harvest/10 text-harvest-strong",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
