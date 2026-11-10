"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

function SheetContent({
  className,
  children,
  side = "right",
  closeLabel,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "left" | "right";
  closeLabel: string;
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/60 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        className={cn(
          "fixed inset-y-0 z-50 flex w-[85%] max-w-sm flex-col gap-4 overflow-y-auto bg-background p-5 shadow-xl data-[state=closed]:animate-out data-[state=open]:animate-in",
          side === "right" &&
            "right-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          side === "left" &&
            "left-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-3 right-3 inline-flex size-12 items-center justify-center rounded-lg text-primary hover:bg-surface">
          <XIcon className="size-6" aria-hidden="true" />
          <span className="sr-only">{closeLabel}</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
};
