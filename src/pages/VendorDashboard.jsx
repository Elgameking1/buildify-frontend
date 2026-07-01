import { Link } from 'react-router-dom'
import {
  FiBox,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiTruck,
  FiUser,
} from 'react-icons/fi'

const statistics = [
  {
    id: 'revenue',
    label: 'Monthly Revenue',
    value: 'GH₵42,860',
    note: '+18% from last month',
    icon: FiTrendingUp,
  },
  {
    id: 'orders',
    label: 'Open Orders',
    value: '12',
    note: '5 pending dispatch',
    icon: FiShoppingBag,
  },
  {
    id: 'products',
    label: 'Active Products',
    value: '28',
    note: '6 low stock items',
    icon: FiPackage,
  },
  {
    id: 'fulfillment',
    label: 'Fulfillment Rate',
    value: '96%',
    note: 'Based on mock orders',
    icon: FiCheckCircle,
  },
]

const vendorProducts = [
  {
    id: 'PRD-201',
    name: 'Premium Portland Cement',
    category: 'Concrete',
    stock: 420,
    price: 'GH₵14',
    status: 'Active',
  },
  {
    id: 'PRD-202',
    name: 'High-Tensile Rebar Bundle',
    category: 'Steel',
    stock: 86,
    price: 'GH₵420',
    status: 'Active',
  },
  {
    id: 'PRD-203',
    name: 'Aluzinc Roofing Sheets',
    category: 'Roofing',
    stock: 24,
    price: 'GH₵58',
    status: 'Low stock',
  },
  {
    id: 'PRD-204',
    name: 'Ready-Mix Concrete C25',
    category: 'Concrete',
    stock: 32,
    price: 'GH₵135',
    status: 'Preorder',
  },
]

const vendorOrders = [
  {
    id: 'ORD-2041',
    customer: 'Adjei Developments',
    product: 'Premium Portland Cement',
    quantity: '120 bags',
    status: 'Ready for dispatch',
    total: 'GH₵1,680',
  },
  {
    id: 'ORD-2040',
    customer: 'North Ridge Contractors',
    product: 'High-Tensile Rebar Bundle',
    quantity: '6 bundles',
    status: 'Processing',
    total: 'GH₵2,520',
  },
  {
    id: 'ORD-2039',
    customer: 'Tema Site Works',
    product: 'Aluzinc Roofing Sheets',
    quantity: '30 sheets',
    status: 'Delivered',
    total: 'GH₵1,740',
  },
]

const vendorProfile = {
  name: 'Accra Build Supply',
  owner: 'Kofi Mensah',
  location: 'Accra Industrial Area',
  email: 'sales@accrabuild.example',
  rating: '4.8',
  verified: 'Verified Vendor',
  completion: '90%',
}

function VendorDashboard() {
  return (
    <main className="w-full">
      <section className="bg-secondary text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Vendor Dashboard
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Manage products, orders, and vendor performance.
            </h1>
            <p className="max-w-2xl leading-7 text-secondary-100">
              Mock vendor workspace for tracking catalog activity, order
              fulfillment, and supplier profile readiness.
            </p>
          </div>

          <div className="surface-panel grid gap-1 p-5 text-secondary">
            <span className="text-3xl font-black">Dashboard</span>
            <span className="text-sm font-semibold text-steel">
              4 alerts need attention
            </span>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((stat) => {
            const Icon = stat.icon

            return (
              <article key={stat.id} className="surface-panel grid gap-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid gap-1">
                    <span className="text-sm font-semibold text-steel">
                      {stat.label}
                    </span>
                    <span className="text-3xl font-black text-secondary">
                      {stat.value}
                    </span>
                  </div>
                  <div className="grid size-11 place-items-center rounded-control bg-primary-50 text-primary-700">
                    <Icon aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-steel">{stat.note}</p>
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
                    Products Table
                  </span>
                  <h2 className="text-2xl font-black text-secondary">
                    Vendor product catalog
                  </h2>
                </div>
                <button type="button" className="btn-primary">
                  Add Product
                </button>
              </div>

              <div className="hidden md:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-secondary-50 text-sm text-secondary">
                    <tr>
                      <th className="p-4 font-bold">Product</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Stock</th>
                      <th className="p-4 font-bold">Price</th>
                      <th className="p-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorProducts.map((product) => (
                      <tr key={product.id} className="border-t border-concrete">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-12 place-items-center rounded-control bg-secondary p-2">
                              <div className="construction-stripe size-full rounded-control" />
                            </div>
                            <div>
                              <p className="font-bold text-secondary">
                                {product.name}
                              </p>
                              <p className="text-sm text-steel">{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-semibold text-steel">
                          {product.category}
                        </td>
                        <td className="p-4 font-bold text-secondary">
                          {product.stock}
                        </td>
                        <td className="p-4 font-black text-secondary">
                          {product.price}
                        </td>
                        <td className="p-4">
                          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 md:hidden">
                {vendorProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-panel bg-secondary-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-secondary">
                          {product.name}
                        </p>
                        <p className="text-sm text-steel">
                          {product.category} • {product.id}
                        </p>
                      </div>
                      <span className="font-black text-secondary">
                        {product.price}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                      <span className="font-bold text-primary-700">
                        {product.status}
                      </span>
                      <span className="text-steel">{product.stock} in stock</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="surface-panel grid gap-5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
                    Orders
                  </span>
                  <h2 className="text-2xl font-black text-secondary">
                    Recent customer orders
                  </h2>
                </div>
                <Link to="/materials" className="btn-secondary">
                  View Marketplace
                </Link>
              </div>

              <div className="grid gap-4">
                {vendorOrders.map((order) => (
                  <article
                    key={order.id}
                    className="grid gap-4 rounded-panel border border-concrete bg-white p-4 lg:grid-cols-[1fr_auto] lg:items-center"
                  >
                    <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                      <div className="grid size-12 place-items-center rounded-control bg-primary-50 text-primary-700">
                        <FiTruck aria-hidden="true" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-secondary">
                            {order.product}
                          </h3>
                          <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-bold text-secondary-700">
                            {order.id}
                          </span>
                        </div>
                        <p className="text-sm text-steel">
                          {order.customer} • {order.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 lg:justify-end">
                      <span className="text-sm font-bold text-primary-700">
                        {order.status}
                      </span>
                      <span className="text-xl font-black text-secondary">
                        {order.total}
                      </span>
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
                  AB
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">
                    {vendorProfile.name}
                  </h2>
                  <p className="text-sm font-semibold text-steel">
                    {vendorProfile.verified}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-steel">
                <span className="inline-flex items-center gap-2">
                  <FiUser className="text-primary" aria-hidden="true" />
                  {vendorProfile.owner}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiBox className="text-primary" aria-hidden="true" />
                  {vendorProfile.location}
                </span>
                <span>{vendorProfile.email}</span>
                <span className="font-bold text-primary-700">
                  {vendorProfile.rating} vendor rating
                </span>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-steel">Profile completion</span>
                  <span className="text-secondary">
                    {vendorProfile.completion}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-secondary-100">
                  <div className="h-full w-[90%] rounded-full bg-primary" />
                </div>
              </div>

              <button type="button" className="btn-primary">
                <FiEdit3 aria-hidden="true" />
                Edit Profile
              </button>
            </section>

            <section className="surface-panel grid gap-4 p-6">
              <h2 className="text-xl font-black text-secondary">
                Dashboard Tasks
              </h2>
              <div className="grid gap-3">
                {[
                  'Restock roofing sheet inventory',
                  'Confirm dispatch for cement order',
                  'Upload updated vendor certificate',
                ].map((task) => (
                  <div
                    key={task}
                    className="flex items-start gap-3 rounded-control bg-secondary-50 p-3"
                  >
                    <FiClock
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

export default VendorDashboard
