// hooks/useNavigationLoading.ts
"use client";

import { useEffect, useState } from "react";

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let currentUrl = window.location.href;

    const handleStart = () => setIsLoading(true);
    const handleEnd = () => setIsLoading(false);

    // Handle link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href]");

      if (link?.getAttribute("href")?.startsWith("/")) {
        handleStart();
      }
    };

    // Override history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      handleStart();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function (...args) {
      handleStart();
      return originalReplaceState.apply(this, args);
    };

    // Check for URL changes
    const checkUrlChange = () => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        handleEnd();
      }
    };

    // Poll for changes (not ideal but works reliably)
    const interval = setInterval(checkUrlChange, 100);

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handleStart);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handleStart);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      clearInterval(interval);
    };
  }, []);

  return isLoading;
}
