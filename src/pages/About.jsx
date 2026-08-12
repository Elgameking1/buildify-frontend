import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiCheckCircle,
  FiPackage,
  FiShield,
  FiTool,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import { productsService } from '../services/productsService'
import { workersService } from '../services/workersService'

/**
 * What the marketplace is and how it is put together.
 *
 * The counters are read from the API rather than written into the copy: a
 * static "240+ vendors" on an about page is the first thing to go stale, and
 * the honest number is one query away.
 */
const objectives = [
  {
    id: 'catalogue',
    title: 'A single catalogue of materials',
    description:
      'Vendors list what they hold in stock, with unit pricing and live quantities, so buyers compare real availability instead of ringing round for quotes.',
    icon: FiPackage,
  },
  {
    id: 'workers',
    title: 'Skilled workers you can check',
    description:
      'Tradespeople publish their skills, day rate, region and availability. Ratings come only from clients whose job was actually completed.',
    icon: FiTool,
  },
  {
    id: 'orders',
    title: 'Orders that respect stock',
    description:
      'Checkout verifies and reserves stock under a database lock, so two buyers cannot be sold the same last pallet of cement.',
    icon: FiCheckCircle,
  },
  {
    id: 'trust',
    title: 'Accountability on both sides',
    description:
      'Vendors are verified by an administrator, jobs move through a fixed state machine, and every change notifies the other party.',
    icon: FiShield,
  },
]

const accountTypes = [
  {
    id: 'client',
    role: 'Client',
    icon: FiUsers,
    body: 'Browse materials, keep a server-side cart, place orders, hire workers and rate the finished job.',
  },
  {
    id: 'vendor',
    role: 'Vendor',
    icon: FiPackage,
    body: 'List and price products, track stock, and work an order queue line by line from pending to ready for dispatch.',
  },
  {
    id: 'worker',
    role: 'Worker',
    icon: FiTool,
    body: 'Publish skills, rate and availability, then accept, decline or start the job requests that come in.',
  },
]

const principles = [
  {
    id: 'honest-data',
    title: 'No invented numbers',
    body: 'Every figure on the site is computed from what is in the database. If there are three vendors, the site says three.',
  },
  {
    id: 'server-truth',
    title: 'The server decides',
    body: 'Pricing, stock, roles and permissions are settled server-side. The interface reflects those answers; it never assumes them.',
  },
  {
    id: 'scope',
    title: 'Deliberate scope',
    body: 'Online payment, delivery logistics and a mobile app are out of scope. Both are arranged directly between buyer and seller.',
  },
]

function About() {
  const { data: productData } = useQuery({
    queryKey: ['about-products'],
    queryFn: () => productsService.getProducts({ size: 1 }),
  })

  const { data: workerData } = useQuery({
    queryKey: ['about-workers'],
    queryFn: () => workersService.getWorkers({ size: 1 }),
  })

  const { data: categoryList } = useQuery({
    queryKey: ['categories'],
    queryFn: productsService.getCategories,
  })

  const { data: skillList } = useQuery({
    queryKey: ['skills'],
    queryFn: workersService.getSkills,
  })

  const counters = [
    { id: 'products', label: 'Materials listed', value: productData?.total },
    { id: 'workers', label: 'Skilled workers', value: workerData?.total },
    { id: 'categories', label: 'Categories', value: categoryList?.length },
    { id: 'skills', label: 'Trades covered', value: skillList?.length },
  ]

  return (
    <main className="w-full">
      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              About
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              One marketplace for construction materials and the people who use
              them.
            </h1>
            <p className="max-w-2xl leading-7 text-on-ink">
              Sourcing a project usually means two disconnected searches: one for
              supplies, another for a trusted tradesperson. This marketplace puts
              both on one account, with the same standard of verification on
              each side.
            </p>
          </div>

          <div className="surface-panel grid grid-cols-2 gap-4 p-5 text-secondary">
            {counters.map((counter) => (
              <div key={counter.id}>
                <span className="text-3xl font-black">
                  {counter.value ?? '—'}
                </span>
                <p className="text-sm text-steel">{counter.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container grid gap-10 section-spacing">
        <SectionHeader
          eyebrow="What it does"
          title="Four things the platform is responsible for."
          description="Each one is a working part of the system, not a roadmap item."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {objectives.map((objective) => {
            const Icon = objective.icon

            return (
              <article key={objective.id} className="surface-panel grid gap-4 p-6">
                <div className="grid size-12 place-items-center rounded-control bg-primary-100 text-primary-700">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div className="grid gap-2">
                  <h3 className="text-lg font-bold text-secondary">
                    {objective.title}
                  </h3>
                  <p className="text-sm leading-6 text-steel">
                    {objective.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="bg-secondary-50 section-spacing">
        <div className="page-container grid gap-10">
          <SectionHeader
            eyebrow="How accounts work"
            title="Three roles, one identity system."
            description="Which dashboard you get depends on the role chosen at registration."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {accountTypes.map((account) => {
              const Icon = account.icon

              return (
                <article key={account.id} className="surface-panel grid gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                      <Icon aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-black text-secondary">
                      {account.role}
                    </h3>
                  </div>
                  <p className="text-sm leading-6 text-steel">{account.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-container grid gap-10 section-spacing">
        <SectionHeader
          eyebrow="How it is built"
          title="Principles the code actually follows."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.id} className="surface-panel grid gap-3 p-6">
              <div className="flex items-center gap-2 text-primary-700">
                <FiTrendingUp aria-hidden="true" />
                <h3 className="text-lg font-bold text-secondary">
                  {principle.title}
                </h3>
              </div>
              <p className="text-sm leading-6 text-steel">{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-container section-spacing">
        <div className="grid gap-8 rounded-panel bg-primary p-6 shadow-construction lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div className="grid gap-3">
            <h2 className="text-balance text-3xl font-black text-secondary-900 md:text-4xl">
              Ready to source your next project?
            </h2>
            <p className="max-w-2xl leading-7 text-secondary-700">
              Browse the catalogue, or create an account to sell materials or
              offer your trade.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/materials" className="btn-secondary min-h-12">
              Browse materials
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/contact" className="btn min-h-12 bg-surface text-secondary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
