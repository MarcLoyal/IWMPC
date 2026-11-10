"use client";

import { useSyncExternalStore } from "react";
import { XIcon } from "lucide-react";

const KEY = "iwmpc-status-dismissed";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function read(stamp: string) {
  try {
    return sessionStorage.getItem(KEY) === stamp;
  } catch {
    return false;
  }
}

/**
 * Lets a visitor hide the "normal" banner for the rest of the browser session.
 * `stamp` identifies this status, so a newer status always shows again.
 */
export function DismissibleStatus({
  stamp,
  label,
  children,
}: {
  stamp: string;
  label: string;
  children: React.ReactNode;
}) {
  const dismissed = useSyncExternalStore(
    subscribe,
    () => read(stamp),
    () => false,
  );
  if (dismissed) return null;

  return (
    <div className="relative">
      {children}
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, stamp);
          } catch {}
          listeners.forEach((cb) => cb());
        }}
        className="absolute top-1/2 right-1 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-lg text-success-strong hover:bg-success/15"
      >
        <XIcon className="size-5" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}
