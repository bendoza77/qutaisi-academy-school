import { useState, useEffect, useRef } from "react";

/**
 * Animates a number from 0 to `end` when `isActive` becomes true.
 * @param {number} end - The target number
 * @param {number} duration - Animation duration in ms
 * @param {boolean} isActive - Trigger the animation
 * @returns {number} - Current animated value
 */
export function useCounter(end, duration = 2000, isActive = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [isActive, end, duration]);

  return count;
}
