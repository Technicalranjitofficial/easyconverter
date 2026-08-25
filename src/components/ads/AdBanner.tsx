"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

// Replace with your actual AdSense publisher ID
const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Silently ignore — happens when AdSense script hasn't loaded yet
    }
  }, []);

  // During development or before AdSense approval, show a placeholder
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/60
                    border border-dashed border-slate-200 dark:border-slate-700 text-slate-400
                    text-xs font-mono ${className}`}
        style={{ minHeight: 90 }}
      >
        AdSense · slot: {slot}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
