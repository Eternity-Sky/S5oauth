"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile: any;
    onTurnstileSuccess: (token: string) => void;
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
}

export default function TurnstileWidget({ siteKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load the script only if it's not already there
    if (!document.querySelector('script[src*="turnstile/v0/api.js"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const renderWidget = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            if (inputRef.current) {
              inputRef.current.value = token;
            }
          },
        });
      } else {
        // Retry after a short delay if Turnstile isn't ready
        setTimeout(renderWidget, 100);
      }
    };

    renderWidget();
  }, [siteKey]);

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div ref={containerRef}></div>
      {/* 隐藏输入框，供表单提交时获取 token */}
      <input type="hidden" name="cf-turnstile-response" ref={inputRef} required />
    </div>
  );
}
