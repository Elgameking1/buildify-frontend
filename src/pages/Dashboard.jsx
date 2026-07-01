import { Link } from 'react-router-dom'
import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi'

const overviewCards = [
  {
    id: 'orders',
    label: 'Active Orders',
    value: '4',
    note: '2 arriving this week',
    icon: FiShoppingCart,
  },
  {
    id: 'hires',
    label: 'Worker Hires',
    value: '3',
    note: '1 job starts tomorrow',
    icon: FiBriefcase,
  },
  {
    id: 'spend',
    label: 'Monthly Spend',
    value: 'GH₵8,420',
    note: '+12% from last month',
    icon: FiTrendingUp,
  },
  {
    id: 'completed',
    label: 'Completed Jobs',
    value: '18',
    note: 'Across materials and labor',
    icon: FiCheckCircle,
  },
]

const recentOrders = [
  {
    id: 'ORD-1024',
    product: 'Premium Portland Cement',
    vendor: 'Accra Build Supply',
    status: 'In transit',
    total: 'GH₵1,680',
    date: 'Jul 2, 2026',
  },
  {
    id: 'ORD-1023',
    product: 'High-Tensile Rebar Bundle',
    vendor: 'Tema Steel Works',
    status: 'Processing',
    total: 'GH₵2,520',
    date: 'Jul 1, 2026',
  },
  {
    id: 'ORD-1022',
    product: 'Aluzinc Roofing Sheets',
    vendor: 'North Ridge Roofing',
    status: 'Delivered',
    total: 'GH₵1,740',
    date: 'Jun 29, 2026',
  },
]

const recentHires = [
  {
    id: 'HIRE-304',
    worker: 'Akua Serwaa',
    role: 'Site Plumber',
    status: 'Confirmed',
    date: 'Jul 3, 2026',
  },
  {
    id: 'HIRE-303',
    worker: 'Daniel Mensah',
    role: 'Masonry Specialist',
    status: 'In progress',
    date: 'Jul 1, 2026',
  },
  {
    id: 'HIRE-302',
    worker: 'Ama Owusu',
    role: 'Licensed Electrician',
    status: 'Completed',
    date: 'Jun 27, 2026',
  },
]

const profileSummary = {
  name: 'Nana Adjei',
  role: 'Client Account',
  company: 'Adjei Developments',
  location: 'Accra, Ghana',
  email: 'nana@example.com',
  completion: '82%',
}

function Dashboard() {
  return (
    <main className="w-full">
      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Client Dashboard
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Track your materials, worker hires, and project activity.
            </h1>
            <p className="max-w-2xl leading-7 text-secondary-100">
              A frontend-only dashboard showing mock marketplace activity for a
              construction client account.
            </p>
          </div>
          <div className="surface-panel grid gap-1 p-5 text-secondary">
            <span className="text-3xl font-black">Today</span>
            <span className="text-sm font-semibold text-steel">
              3 updates need review
            </span>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => {
            const Icon = card.icon

            return (
              <article key={card.id} className="surface-panel grid gap-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid gap-1">
                    <span className="text-sm font-semibold text-steel">
                      {card.label}
                    </span>
                    <span className="text-3xl font-black text-secondary">
                      {card.value}
                    </span>
                  </div>
                  <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                    <Icon aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-steel">{card.note}</p>
              </article>
            )
          })}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-start">
          <div className="grid gap-8">
            <section className="surface-panel overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-concrete p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                    Recent Orders
                  </span>
                  <h2 className="text-2xl font-black text-secondary">
                    Material purchases
                  </h2>
                </div>
                <Link to="/materials" className="btn-secondary">
                  Browse Materials
                </Link>
              </div>

              <div className="hidden md:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-secondary-50 text-sm text-secondary">
                    <tr>
                      <th className="p-4 font-bold">Order</th>
                      <th className="p-4 font-bold">Product</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Total</th>
                      <th className="p-4 font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-concrete">
                        <td className="p-4 font-bold text-secondary">
                          {order.id}
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-secondary">
                              {order.product}
                            </p>
                            <p className="text-sm text-steel">{order.vendor}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 font-black text-secondary">
                          {order.total}
                        </td>
                        <td className="p-4 text-sm text-steel">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 md:hidden">
                {recentOrders.map((order) => (
                  <article key={order.id} className="rounded-panel bg-secondary-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-secondary">{order.product}</p>
                        <p className="text-sm text-steel">{order.vendor}</p>
                      </div>
                      <span className="font-black text-secondary">
                        {order.total}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                      <span className="font-bold text-primary-700">
                        {order.status}
                      </span>
                      <span className="text-steel">{order.date}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="surface-panel grid gap-5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                    Recent Hires
                  </span>
                  <h2 className="text-2xl font-black text-secondary">
                    Worker bookings
                  </h2>
                </div>
                <Link to="/workers" className="btn-accent">
                  Find Workers
                </Link>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {recentHires.map((hire) => (
                  <article
                    key={hire.id}
                    className="rounded-panel border border-concrete bg-white p-4"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-full bg-primary text-sm font-black text-secondary-900">
                        {hire.worker
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary">
                          {hire.worker}
                        </h3>
                        <p className="text-sm text-steel">{hire.role}</p>
                      </div>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <span className="inline-flex items-center gap-2 font-semibold text-primary-700">
                        <FiClock aria-hidden="true" />
                        {hire.status}
                      </span>
                      <span className="text-steel">{hire.date}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="grid gap-5">
            <section className="surface-panel grid gap-5 p-6">
              <div className="flex items-center gap-4">
                <div className="grid size-16 place-items-center rounded-full bg-primary text-xl font-black text-secondary-900">
                  NA
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">
                    {profileSummary.name}
                  </h2>
                  <p className="text-sm font-semibold text-steel">
                    {profileSummary.role}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-steel">
                <span className="inline-flex items-center gap-2">
                  <FiUser className="text-primary" aria-hidden="true" />
                  {profileSummary.company}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiPackage className="text-primary" aria-hidden="true" />
                  {profileSummary.location}
                </span>
                <span>{profileSummary.email}</span>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-steel">Profile completion</span>
                  <span className="text-secondary">
                    {profileSummary.completion}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-secondary-100">
                  <div className="h-full w-[82%] rounded-full bg-primary" />
                </div>
              </div>

              <Link to="/profile" className="btn-primary">
                View Profile
              </Link>
            </section>

            <section className="surface-panel grid gap-4 p-6">
              <h2 className="text-xl font-black text-secondary">Next Steps</h2>
              <div className="grid gap-3">
                {[
                  'Confirm delivery address for cement order',
                  'Review plumber hire request',
                  'Complete account billing details',
                ].map((task) => (
                  <div
                    key={task}
                    className="flex items-start gap-3 rounded-control bg-secondary-50 p-3"
                  >
                    <FiCheckCircle
                      className="mt-1 shrink-0 text-primary-700"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold text-secondary">
                      {task}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
