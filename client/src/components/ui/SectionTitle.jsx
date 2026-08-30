import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { Eyebrow } from "./Eyebrow";
import { fadeUp } from "../../utils/motion";

const alignment = {
  left: "items-start text-left",
  center: "items-center text-center mx-auto",
  right: "items-end text-right",
};

/**
 * Section header: eyebrow → heading → description, with one fixed rhythm.
 *
 * `highlight` is rendered in the accent colour. If the word already appears in
 * `title` it is emphasised in place; otherwise it is appended — the CMS stores
 * some titles as a stem plus a highlight word.
 *
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   highlight?: string,
 *   description?: string,
 *   align?: keyof typeof alignment,
 *   light?: boolean,
 *   as?: 'h1'|'h2'|'h3',
 *   className?: string,
 *   id?: string
 * }} props
 */
export function SectionTitle({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  light = false,
  as: Heading = "h2",
  className,
  id,
}) {
  const renderTitle = () => {
    if (!highlight) return title;
    const idx = title.indexOf(highlight);
    const mark = <span className={light ? "gradient-text-light" : "gradient-text"}>{highlight}</span>;
    if (idx === -1) {
      return (
        <>
          {title.trimEnd()} {mark}
        </>
      );
    }
    return (
      <>
        {title.slice(0, idx)}
        {mark}
        {title.slice(idx + highlight.length)}
      </>
    );
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("flex max-w-2xl flex-col gap-4", alignment[align], className)}
    >
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}

      <Heading
        id={id}
        className={cn("text-h2", light ? "text-white" : "text-fg")}
      >
        {renderTitle()}
      </Heading>

      {description && (
        <p className={cn("max-w-xl text-body-lg", light ? "text-primary-100/85" : "text-fg-muted")}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

/** Preferred name going forward; `SectionTitle` is kept for existing imports. */
export const SectionHeader = SectionTitle;
