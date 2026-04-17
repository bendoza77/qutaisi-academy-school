import { motion } from 'framer-motion'

export function PageHero({ eyebrow, title, highlight, subtitle }) {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-700/30 blur-3xl"
        />
        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl"
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-blue-100 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
              {eyebrow}
            </span>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            {title}
            {highlight && (
              <> <span className="gradient-text-light">{highlight}</span></>
            )}
          </h1>

          {subtitle && (
            <p className="text-blue-100/80 text-lg sm:text-xl max-w-2xl leading-relaxed mt-2">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
