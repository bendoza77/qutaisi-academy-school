import { useState, useEffect } from "react";

/**
 * Mounts its children once the browser is idle (or after `timeout` ms).
 *
 * Used for the floating helpers — nobody taps the chat bubble in the first
 * second, and keeping them out of the first render keeps the main thread free
 * for content.
 *
 * @param {{ timeout?: number, children: React.ReactNode }} props
 */
export function DeferUntilIdle({ timeout = 2000, children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(() => setReady(true), { timeout });
      return () => window.cancelIdleCallback(handle);
    }

    const timer = window.setTimeout(() => setReady(true), 800);
    return () => window.clearTimeout(timer);
  }, [timeout]);

  return ready ? children : null;
}
