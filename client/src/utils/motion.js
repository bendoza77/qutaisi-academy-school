/**
 * Shared motion vocabulary.
 *
 * Three rules keep the site from feeling animated-for-its-own-sake:
 *  1. Entrances move a short distance (16–24px) over 0.5–0.6s.
 *  2. Only opacity and transform are animated.
 *  3. Nothing loops. `<MotionConfig reducedMotion="user">` in App.jsx drops all
 *     of it for visitors who ask for reduced motion.
 */

export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Parent list that reveals its children one after another. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Standard `whileInView` config — reveal once, slightly before the edge. */
export const inView = { once: true, margin: "-80px" };
