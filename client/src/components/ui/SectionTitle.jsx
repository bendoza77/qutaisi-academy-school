import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   highlight?: string,
 *   description?: string,
 *   align?: 'left'|'center'|'right',
 *   light?: boolean,
 *   className?: string
 * }} props
 */
export function SectionTitle({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  light = false,
  className,
}) {
  const alignment = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  // Replace highlight word in title
  const renderTitle = () => {
    if (!highlight) return title;
    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex flex-col gap-3 max-w-2xl", alignment[align], className)}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full w-fit",
            light
              ? "bg-white/15 text-blue-100"
              : "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight",
          light ? "text-white" : "text-slate-900 dark:text-white"
        )}
      >
        {renderTitle()}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base sm:text-lg leading-relaxed max-w-xl",
            light ? "text-blue-100/80" : "text-slate-500 dark:text-slate-400"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
