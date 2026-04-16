import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SectionTitle } from "../ui/SectionTitle";
import { TESTIMONIALS_META } from "../../constants";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "text-accent-500 fill-accent-500" : "text-slate-300 dark:text-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ meta, text, direction }) {
  return (
    <motion.div
      key={meta.id}
      initial={{ opacity: 0, x: direction * 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -60 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      <div className="h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <Quote className="w-10 h-10 text-primary-200 dark:text-primary-800" strokeWidth={1} />
          <StarRating rating={meta.rating} />
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-base lg:text-lg leading-relaxed flex-1 italic">
          "{text.text}"
        </p>
        <div className="flex items-center gap-4 mt-6 pt-4 sm:mt-8 sm:pt-6 border-t border-slate-100 dark:border-slate-700">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base ${meta.color}`}>
            {meta.avatar}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">{text.name}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              {text.role} · {text.location}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const testimonialTexts = t("testimonials.items", { returnObjects: true });
  const total = TESTIMONIALS_META.length;

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback(
    (index) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  return (
    <section
      id="testimonials"
      className="relative py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50 overflow-hidden"
      aria-label="Student testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-14">
          <SectionTitle
            eyebrow={t("testimonials.eyebrow")}
            title={t("testimonials.title")}
            highlight={t("testimonials.titleHighlight")}
            description={t("testimonials.description")}
            align="center"
            className="mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Slider */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden h-[430px] sm:h-[360px] lg:h-[320px]">
              <AnimatePresence initial={false} custom={direction}>
                {Array.isArray(testimonialTexts) && (
                  <TestimonialCard
                    key={TESTIMONIALS_META[current].id}
                    meta={TESTIMONIALS_META[current]}
                    text={testimonialTexts[current]}
                    direction={direction}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 dark:hover:bg-primary-900/20 dark:hover:text-primary-300 transition-all duration-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goNext}
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 dark:hover:bg-primary-900/20 dark:hover:text-primary-300 transition-all duration-200 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {TESTIMONIALS_META.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`transition-all duration-300 cursor-pointer rounded-full ${
                      i === current
                        ? "w-6 h-2 bg-primary-900 dark:bg-primary-500"
                        : "w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              <span className="text-sm text-slate-400 dark:text-slate-500 tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Side list — desktop only */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-3">
            {Array.isArray(testimonialTexts) &&
              TESTIMONIALS_META.map((meta, i) => (
                <motion.button
                  key={meta.id}
                  onClick={() => goTo(i)}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    i === current
                      ? "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${meta.color}`}>
                      {meta.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {testimonialTexts[i]?.name}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {testimonialTexts[i]?.role}
                      </div>
                    </div>
                    <div className="ml-auto shrink-0">
                      <StarRating rating={meta.rating} />
                    </div>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
