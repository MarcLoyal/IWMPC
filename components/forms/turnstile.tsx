"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      language?: string;
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileReady?: () => void;
  }
}

/** Cloudflare Turnstile widget. Reports the token (or null when it expires). */
export function Turnstile({
  siteKey,
  language,
  onToken,
}: {
  siteKey: string;
  language: string;
  onToken: (token: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    let id: string | undefined;
    const mount = () => {
      if (!ref.current || !window.turnstile || id) return;
      id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        language,
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(null),
        "error-callback": () => onTokenRef.current(null),
      });
    };
    if (window.turnstile) mount();
    else window.onTurnstileReady = mount;
    return () => {
      if (id) window.turnstile?.remove(id);
    };
  }, [siteKey, language]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileReady"
        strategy="afterInteractive"
      />
      <div ref={ref} />
    </>
  );
}
