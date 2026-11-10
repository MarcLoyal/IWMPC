import { notFound } from "next/navigation";

// Any path without a page of its own gets the localized 404 (not-found.tsx).
export default function CatchAll() {
  notFound();
}
