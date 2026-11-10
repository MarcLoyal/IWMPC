import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "min-h-12 w-full rounded-lg border border-muted-foreground/60 bg-background px-3 text-lg placeholder:text-muted-foreground aria-invalid:border-danger-strong aria-invalid:ring-1 aria-invalid:ring-danger-strong",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
