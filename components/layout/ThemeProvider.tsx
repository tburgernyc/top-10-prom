"use client";

import { useEffect } from "react";

/**
 * Forces color-scheme: dark across the entire document.
 * Renders nothing — purely a side-effect client component.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
  }, []);

  return <>{children}</>;
}
