"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Guarantees every client-side route change lands at the top of the page,
 * while browser back/forward still restores the previous scroll position.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isHistoryPop = useRef(false);

  useEffect(() => {
    const onPop = () => {
      isHistoryPop.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (isHistoryPop.current) {
      isHistoryPop.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
