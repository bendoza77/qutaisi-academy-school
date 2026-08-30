import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Section } from "../ui/Section";
import { StockImage } from "../ui/StockImage";
import { PHOTOS } from "../../constants/media";
import { fadeUp, stagger, inView } from "../../utils/motion";

const listVariants = stagger(0.09);

/**
 * A quiet band of three photographs, used to break up long stretches of type
 * on the inner pages.
 *
 * It takes keys from PHOTOS rather than URLs, and reads its alt text from the
 * `media` block in the locale files — so the same strip is described correctly
 * in Georgian without the page having to think about it.
 *
 * @param {{
 *   photos: (keyof typeof PHOTOS)[],
 *   tone?: 'canvas'|'subtle'|'brand',
 *   space?: 'none'|'compact'|'default'|'tall',
 *   ratio?: '1/1'|'4/3'|'3/2'|'16/9',
 *   className?: string
 * }} props
 */
export function PhotoStrip({ photos, tone = "subtle", space = "compact", ratio = "4/3", className }) {
  const { t } = useTranslation();

  return (
    <Section tone={tone} space={space} className={className}>
      <motion.ul
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6"
      >
        {photos.map((key) => (
          <motion.li key={key} variants={fadeUp}>
            <StockImage
              id={PHOTOS[key]}
              alt={t(`media.${key}`)}
              ratio={ratio}
              sizes="(min-width: 640px) 30vw, 92vw"
            />
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
