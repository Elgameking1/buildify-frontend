import { FiArrowRight, FiMail } from 'react-icons/fi'
import CategoryCard from '../components/CategoryCard'
import HeroSection from '../components/HeroSection'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import StepCard from '../components/StepCard'
import TestimonialCard from '../components/TestimonialCard'
import WorkerCard from '../components/WorkerCard'
import {
  featuredCategories,
  featuredProducts,
  featuredWorkers,
  howItWorksSteps,
  stats,
  testimonials,
  trustHighlights,
} from '../constants/homeData'

function Home() {
  return (
    <div className="w-full">
      <HeroSection />

      <section className="page-container grid gap-8 section-spacing">
        <div className="grid gap-4 rounded-panel bg-secondary p-5 text-white shadow-construction md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="grid gap-1 text-center md:text-left">
              <span className="text-3xl font-black text-primary">{stat.value}</span>
              <span className="text-sm font-semibold text-secondary-100">
                {stat.label}
              </span>
            </div>
          ))}
          <div className="hidden items-center justify-end md:flex">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-primary">
              Marketplace ready
            </span>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-10 section-spacing">
        <SectionHeader
          eyebrow="Featured Categories"
          title="Source every project essential from trusted categories."
          description="Browse the core construction supplies and services teams need most often."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-secondary-50 section-spacing">
        <div className="page-container grid gap-10">
          <SectionHeader
            eyebrow="Featured Products"
            title="High-demand materials, ready for your next build."
            description="Mock product listings that will later connect to live inventory."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-container grid gap-10 section-spacing">
        <SectionHeader
          eyebrow="Featured Workers"
          title="Find skilled tradespeople with proven project experience."
          description="Temporary worker cards showing the future marketplace profile format."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featuredWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      </section>

      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              How It Works
            </span>
            <h2 className="text-balance text-3xl font-black md:text-4xl">
              From search to site delivery in a clear workflow.
            </h2>
            <p className="leading-7 text-secondary-100">
              The marketplace will guide customers from discovery through
              purchase, hiring, and fulfillment.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {howItWorksSteps.map((step, index) => (
              <div key={step.id} className="rounded-panel bg-white p-5">
                <StepCard step={step} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container grid gap-10 section-spacing">
        <SectionHeader
          eyebrow="Testimonials"
          title="Built for contractors, developers, and site teams."
          description="Mock customer feedback to frame the marketplace value proposition."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </section>

      <section className="page-container section-spacing">
        <div className="grid gap-8 rounded-panel bg-primary p-6 shadow-construction lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-10">
          <div className="grid gap-5">
            <span className="w-fit rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white">
              Newsletter
            </span>
            <div className="grid gap-3">
              <h2 className="text-balance text-3xl font-black text-secondary-900 md:text-4xl">
                Get marketplace updates before launch.
              </h2>
              <p className="max-w-2xl leading-7 text-secondary-700">
                Receive new supplier announcements, worker onboarding updates,
                and early access notes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trustHighlights.map((item) => {
                const Icon = item.icon

                return (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-2 font-bold text-secondary-900"
                  >
                    <Icon aria-hidden="true" />
                    {item.label}
                  </span>
                )
              })}
            </div>
          </div>

          <form className="surface-panel grid gap-3 p-3 sm:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-3 rounded-control bg-secondary-50 px-4 py-3 text-steel">
              <FiMail aria-hidden="true" />
              <span className="sr-only">Email address</span>
              <input
                type="email"
                className="w-full bg-transparent text-secondary outline-none placeholder:text-steel"
                placeholder="you@example.com"
              />
            </label>
            <button type="submit" className="btn-secondary min-h-12">
              Subscribe
              <FiArrowRight aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home
