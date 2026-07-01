import { motion } from 'framer-motion'
import { FiArrowRight, FiSearch } from 'react-icons/fi'

function HeroSection() {
  return (
    <section className="page-container grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
      <motion.div
        className="stack-responsive max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <span className="w-fit rounded-full bg-primary-100 px-4 py-2 text-sm font-bold text-primary-700">
          Build faster with trusted suppliers
        </span>

        <div className="grid gap-5">
          <h1 className="text-balance text-4xl font-black leading-tight text-secondary md:text-5xl lg:text-6xl">
            Find construction materials and skilled workers in minutes.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-steel md:text-lg">
            Search for quality materials, reliable tradespeople, and the tools
            your project needs from one modern marketplace.
          </p>
        </div>

        <form className="surface-panel flex w-full max-w-2xl flex-col gap-3 p-2 sm:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-control bg-secondary-50 px-4 py-3 text-steel">
            <FiSearch className="shrink-0" aria-hidden="true" />
            <span className="sr-only">Search marketplace</span>
            <input
              type="search"
              className="w-full bg-transparent text-secondary outline-none placeholder:text-steel"
              placeholder="Search materials or workers"
            />
          </label>
          <button type="submit" className="btn-primary min-h-12 px-6">
            Search
            <FiArrowRight aria-hidden="true" />
          </button>
        </form>
      </motion.div>

      <motion.div
        className="relative min-h-[320px] overflow-hidden rounded-panel border border-concrete bg-secondary shadow-construction lg:min-h-[460px]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        aria-label="Construction marketplace illustration placeholder"
      >
        <div className="absolute inset-x-0 top-0 h-3 construction-stripe" />
        <div className="absolute inset-6 rounded-panel border border-white/10 bg-white/5" />
        <div className="absolute left-8 top-12 h-28 w-24 rounded-control bg-primary shadow-construction sm:left-12 sm:h-36 sm:w-32" />
        <div className="absolute bottom-10 right-8 h-36 w-36 rounded-full bg-accent/80 blur-sm sm:right-14 sm:h-48 sm:w-48" />
        <div className="absolute bottom-12 left-8 right-8 grid gap-4 sm:left-12 sm:right-12">
          <div className="h-4 w-2/3 rounded-full bg-white/80" />
          <div className="h-4 w-1/2 rounded-full bg-primary" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-20 rounded-control bg-white/15" />
            <div className="h-20 rounded-control bg-white/25" />
            <div className="h-20 rounded-control bg-white/15" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
