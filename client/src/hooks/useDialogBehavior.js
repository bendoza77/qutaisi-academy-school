import { useEffect } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Everything a modal surface (drawer, dialog) owes the keyboard and the page:
 * body scroll lock without layout shift, Escape to dismiss, a focus trap, and
 * focus returned to whatever opened it.
 *
 * @param {{ open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement> }} options
 */
export function useDialogBehavior({ open, onClose, ref }) {
  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement;
    const { body, documentElement } = document;

    // Lock scrolling, padding out the gap the scrollbar leaves behind.
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    // Move focus into the surface.
    const focusTimer = window.setTimeout(() => {
      const first = ref.current?.querySelector(FOCUSABLE);
      (first ?? ref.current)?.focus?.();
    }, 20);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;

      const items = Array.from(ref.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [open, onClose, ref]);
}
