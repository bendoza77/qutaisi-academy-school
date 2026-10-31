import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BUILT_BY } from "../../constants";
import { cn } from "../../utils/cn";
import { EASE } from "../../utils/motion";
import { Container } from "./Container";
import webiMark from "../../assets/webi-mark.webp";
import webiWordmark from "../../assets/webi-wordmark.webp";

const MARK_SIZE = { width: 230, height: 121 };
const WORDMARK_SIZE = { width: 245, height: 78 };

const LOGO_SIZES = {
  md: { tile: "px-3 py-2", mark: "h-6 sm:h-7", wordmark: "h-[1.125rem] sm:h-[1.3125rem]" },
  sm: { tile: "px-2.5 py-1.5", mark: "h-5", wordmark: "h-[0.9375rem]" },
};

/**
 * Studio logo. It always sits on white: the mark's darkest strokes and the
 * wordmark are navy, so they vanish on the academy's navy surfaces.
 * Becomes a link once BUILT_BY.url is set.
 */
function WebiLogo({ size = "md" }) {
  const { tile, mark, wordmark } = LOGO_SIZES[size];

  const logo = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-control bg-white shadow-sm",
        tile
      )}
    >
      <img src={webiMark} alt="" {...MARK_SIZE} className={cn("w-auto", mark)} />
      <img
        src={webiWordmark}
        alt={BUILT_BY.name}
        {...WORDMARK_SIZE}
        className={cn("w-auto", wordmark)}
      />
    </span>
  );

  if (!BUILT_BY.url) return logo;

  return (
    <a
      href={BUILT_BY.url}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 transition-opacity duration-200 hover:opacity-85"
    >
      {logo}
    </a>
  );
}

/**
 * Opens the footer rather than closing it: on phones the columns stack, so the
 * old spot under them sat roughly a full screen further down the page.
 */
export function WebiFooterCredit() {
  const { t } = useTranslation();

  return (
    <div className="border-b border-white/10">
      <Container>
        <div className="flex items-center gap-4 py-4 sm:gap-6">
          <p className="text-caption text-primary-200/70">{t("footer.builtBy")}</p>
          <span
            aria-hidden="true"
            className="h-px min-w-4 flex-1 bg-linear-to-r from-white/10 to-accent-300/60"
          />
          <WebiLogo />
        </div>
      </Container>
    </div>
  );
}

/** Closes the mobile menu — the one screen phone visitors reliably open. */
export function WebiDrawerCredit() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-3 border-t border-white/10 pt-4">
      <p className="text-caption text-primary-200/70">{t("footer.builtByShort")}</p>
      <WebiLogo size="sm" />
    </div>
  );
}

/**
 * The only credit visible without scrolling. It lives in the empty page margin
 * and starts at 1360px, where the 1280px layout leaves room for it, so it never
 * covers content. The header and dialogs stack above it (z-50+).
 */
export function WebiEdgeTab() {
  const { t } = useTranslation();

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden items-center min-[1360px]:flex">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ delay: 1.2, duration: 0.5, ease: EASE }}
        className="pointer-events-auto flex flex-col items-center gap-3 rounded-r-control bg-white px-1.5 py-3.5 shadow-lg"
      >
        <img src={webiMark} alt="" {...MARK_SIZE} className="h-auto w-6" />
        {/* Rotated images keep their unrotated box, so the wrapper sets the size. */}
        <span className="relative block h-10 w-[0.8125rem]">
          <img
            src={webiWordmark}
            alt={BUILT_BY.name}
            {...WORDMARK_SIZE}
            className="absolute top-1/2 left-1/2 h-[0.8125rem] w-10 max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-90"
          />
        </span>
        <span className="rotate-180 text-[0.6875rem] leading-none text-primary-700 [writing-mode:vertical-rl]">
          {t("footer.builtByShort")}
        </span>
      </motion.div>
    </div>
  );
}
