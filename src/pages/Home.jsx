import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { FiArrowRight, FiPackage, FiUsers } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import HeroSection from '../components/HeroSection'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import StepCard from '../components/StepCard'
import WorkerCard from '../components/WorkerCard'
import { howItWorksSteps, trustHighlights } from '../constants/homeData'
import { productsService } from '../services/productsService'
import { workersService } from '../services/workersService'

function Home() {
  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ['home-products'],
    queryFn: () => productsService.getProducts({ size: 6, sort: 'newest' }),
  })

  const { data: workerData, isLoading: workersLoading } = useQuery({
    queryKey: ['home-workers'],
    queryFn: () => workersService.getWorkers({ size: 3, sort: 'rating' }),
  })

  const { data: categoryList } = useQuery({
    queryKey: ['categories'],
    queryFn: productsService.getCategories,
  })

  const featuredProducts = productData?.items ?? []
  const featuredWorkers = workerData?.items ?? []

  // Counted, not claimed. An em dash while the request is in flight beats a
  // zero that reads as "this marketplace is empty".
  const stats = [
    { id: 'products', label: 'Materials listed', value: productData?.total },
    { id: 'workers', label: 'Skilled workers', value: workerData?.total },
    { id: 'categories', label: 'Categories', value: categoryList?.length },
  ]

  // Only the top-level categories are shown on the landing page; the
  // sub-categories would overwhelm the grid.
  const featuredCategories = useMemo(
    () =>
      (categoryList ?? [])
        .filter((category) => category.depth === 0)
        .slice(0, 8)
        .map((category) => ({
          id: category.id,
          name: category.name,
          description: 'Browse available listings',
        })),
    [categoryList],
  )

  return (
    <main className="w-full">
      <HeroSection />

      <section className="page-container grid gap-8 section-spacing">
        <div className="grid gap-4 rounded-panel bg-ink p-5 text-white shadow-construction md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="grid gap-1 text-center md:text-left">
              <span className="text-3xl font-black text-primary">
                {stat.value ?? '—'}
              </span>
              <span className="text-sm font-semibold text-on-ink">
                {stat.label}
              </span>
            </div>
          ))}
          <div className="hidden items-center justify-end md:flex">
            <Link
              to="/register"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-white/20"
            >
              Join the marketplace
            </Link>
          </div>
        </div>
      </section>

      {featuredCategories.length > 0 ? (
        <section className="page-container grid gap-10 section-spacing">
          <SectionHeader
            eyebrow="Categories"
            title="Source every project essential from one catalogue."
            description="The top-level categories vendors are listing under right now."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-secondary-50 section-spacing">
        <div className="page-container grid gap-10">
          <SectionHeader
            eyebrow="Latest Materials"
            title="High-demand materials, ready for your next build."
            description="The newest listings from suppliers on the marketplace."
          />

          {productsLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="surface-panel h-72 animate-pulse bg-concrete/40"
                />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Link to="/materials" className="btn-secondary mx-auto w-fit">
                See all materials
                <FiArrowRight aria-hidden="true" />
              </Link>
            </>
          ) : (
            <div className="surface-panel grid gap-4 p-8 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-50 text-primary-700">
                <FiPackage size={28} aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-black text-secondary">
                No materials listed yet
              </h3>
              <p className="text-steel">
                Vendor accounts can list their first product from the vendor
                dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="page-container grid gap-10 section-spacing">
        <SectionHeader
          eyebrow="Top Rated Workers"
          title="Find skilled tradespeople with proven project ratings."
          description="Ranked by the ratings clients left after completed jobs."
        />

        {workersLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="surface-panel h-64 animate-pulse bg-concrete/40"
              />
            ))}
          </div>
        ) : featuredWorkers.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
            <Link to="/workers" className="btn-accent mx-auto w-fit">
              Browse all workers
              <FiArrowRight aria-hidden="true" />
            </Link>
          </>
        ) : (
          <div className="surface-panel grid gap-4 p-8 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-50 text-primary-700">
              <FiUsers size={28} aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-black text-secondary">
              No worker profiles yet
            </h3>
            <p className="text-steel">
              Register as a worker to publish your skills, rate and availability.
            </p>
          </div>
        )}
      </section>

      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              How It Works
            </span>
            <h2 className="text-balance text-3xl font-black md:text-4xl">
              From search to site delivery in a clear workflow.
            </h2>
            <p className="leading-7 text-on-ink">
              The marketplace takes you from discovery through purchase, hiring
              and fulfilment - with each step recorded on both sides.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {howItWorksSteps.map((step, index) => (
              <div key={step.id} className="rounded-panel bg-surface p-5">
                <StepCard step={step} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container section-spacing">
        <div className="grid gap-8 rounded-panel bg-primary p-6 shadow-construction lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-10">
          <div className="grid gap-5">
            <span className="w-fit rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
              What you can rely on
            </span>
            <div className="grid gap-3">
              <h2 className="text-balance text-3xl font-black text-secondary-900 md:text-4xl">
                Checks that run on every order and every hire.
              </h2>
              <p className="max-w-2xl leading-7 text-secondary-700">
                None of this is optional or manual - it is enforced by the
                platform on each transaction.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trustHighlights.map((item) => {
                const Icon = item.icon

                return (
                  <span
                    key={item.id}
                    className="inline-flex items-start gap-2 font-bold text-secondary-900"
                  >
                    <Icon className="mt-1 shrink-0" aria-hidden="true" />
                    {item.label}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="surface-panel grid gap-4 p-6">
            <h3 className="text-2xl font-black text-secondary">
              Start with an account
            </h3>
            <p className="leading-7 text-steel">
              Buying, selling and offering a trade all run off one login. Pick
              the role that fits and the right dashboard follows.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/register" className="btn-primary min-h-12">
                Create account
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link to="/about" className="btn-secondary min-h-12">
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
