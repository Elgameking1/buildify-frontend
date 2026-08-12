import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
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
import { materialImage } from '../constants/materialImages'
import { apiErrorMessage } from '../services/api'
import { ordersService } from '../services/ordersService'
import { productsService } from '../services/productsService'
import { usersService } from '../services/usersService'

// Line status -> the label the table shows.
const STATUS_LABELS = {
  PENDING: 'Awaiting confirmation',
  CONFIRMED: 'Processing',
  READY: 'Ready for dispatch',
  CANCELLED: 'Cancelled',
}

const cedi = (amount) =>
  `GH₵${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`

function VendorDashboard() {
  const { user } = useSelector((state) => state.auth)

  const { data: productData } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: () => productsService.getMyProducts({ size: 50 }),
  })

  const { data: queueData } = useQuery({
    queryKey: ['vendor-queue'],
    queryFn: () => ordersService.getVendorQueue({ size: 50 }),
  })

  const vendorProducts = useMemo(
    () =>
      (productData?.items ?? []).map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        stock: product.stock,
        price: cedi(product.price),
        status: product.status === 'ACTIVE' ? 'Active' : product.status,
        // Kept so the row thumbnail can prefer the vendor's own upload over a
        // library photo.
        gallery: product.gallery,
      })),
    [productData],
  )

  const vendorOrders = useMemo(
    () =>
      (queueData?.items ?? []).map((line) => ({
        id: line.reference,
        lineId: line.id,
        rawStatus: line.status,
        customer: line.clientName,
        product: line.productName,
        quantity: String(line.quantity),
        status: STATUS_LABELS[line.status] ?? line.status,
        total: cedi(line.lineTotal),
      })),
    [queueData],
  )

  // Derived from the real queue rather than hard-coded: revenue counts only
  // lines this vendor has actually confirmed or dispatched.
  const statistics = useMemo(() => {
    const lines = queueData?.items ?? []
    const earned = lines
      .filter((line) => line.status === 'CONFIRMED' || line.status === 'READY')
      .reduce((total, line) => total + line.lineTotal, 0)
    const open = lines.filter((line) => line.status === 'PENDING').length
    const active = vendorProducts.filter((item) => item.status === 'Active').length
    const lowStock = vendorProducts.filter((item) => item.stock <= 20).length
    const ready = lines.filter((line) => line.status === 'READY').length

    return [
      {
        id: 'revenue',
        label: 'Confirmed Revenue',
        value: cedi(earned),
        note: `${lines.length} order lines`,
        icon: FiTrendingUp,
      },
      {
        id: 'orders',
        label: 'Open Orders',
        value: String(open),
        note: `${ready} ready for dispatch`,
        icon: FiShoppingBag,
      },
      {
        id: 'products',
        label: 'Active Products',
        value: String(active),
        note: `${lowStock} low stock items`,
        icon: FiPackage,
      },
      {
        id: 'fulfillment',
        label: 'Fulfillment Rate',
        value: lines.length
          ? `${Math.round((ready / lines.length) * 100)}%`
          : '-',
        note: 'Lines marked ready',
        icon: FiCheckCircle,
      },
    ]
  }, [queueData, vendorProducts])

  const queryClient = useQueryClient()
  const [showProductForm, setShowProductForm] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    description: '',
    category_id: '',
    unit: 'BAG',
    price: '',
    stock_qty: '',
  })

  // The category list drives the product form's dropdown; the API rejects a
  // product whose category does not exist.
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productsService.getCategories,
  })

  const createProduct = useMutation({
    mutationFn: () =>
      productsService.createProduct({
        ...draft,
        category_id: Number(draft.category_id),
        price: draft.price,
        stock_qty: Number(draft.stock_qty || 0),
        status: 'ACTIVE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowProductForm(false)
      setDraft({
        name: '',
        description: '',
        category_id: '',
        unit: 'BAG',
        price: '',
        stock_qty: '',
      })
      toast.success('Product listed')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not create the product.')),
  })

  const archive = useMutation({
    mutationFn: (productId) => productsService.archiveProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      // Archived rather than deleted, so existing orders keep their reference.
      toast.success('Product archived')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not archive the product.')),
  })


  const advance = useMutation({
    mutationFn: ({ lineId, status }) => ordersService.updateLineStatus(lineId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-queue'] })
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] })
      toast.success('Order line updated')
    },
    // The backend refuses PENDING -> READY with a 409: a line must be
    // confirmed before it can be dispatched.
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update the line.')),
  })

  const { data: vendorRecord } = useQuery({
    queryKey: ['vendor-profile'],
    queryFn: usersService.getVendorProfile,
  })

  const [editingProfile, setEditingProfile] = useState(false)
  const [profileDraft, setProfileDraft] = useState(null)

  const saveProfile = useMutation({
    mutationFn: () => usersService.updateVendorProfile(profileDraft),
    onSuccess: (updated) => {
      queryClient.setQueryData(['vendor-profile'], updated)
      setEditingProfile(false)
      toast.success('Vendor profile updated')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not save the profile.')),
  })

  const beginEditing = () => {
    setProfileDraft({
      businessName: vendorRecord?.businessName ?? '',
      description: vendorRecord?.description ?? '',
      location: vendorRecord?.location ?? '',
    })
    setEditingProfile(true)
  }

  const vendorProfile = {
    name: vendorRecord?.businessName ?? user?.name ?? 'Vendor',
    owner: user?.name ?? '—',
    location:
      vendorRecord?.location ||
      [user?.city, user?.region].filter(Boolean).join(', ') ||
      'No location set',
    email: user?.email ?? '—',
    // Verification is granted by an administrator, never self-assigned.
    verified: vendorRecord?.isVerified ? 'Verified vendor' : 'Unverified vendor',
  }

  const initials = (vendorProfile.name || '?')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Which parts of the storefront are filled in. Previously the label said
  // 60%/100% while the bar was pinned at 90% regardless.
  const profileFields = [
    vendorRecord?.businessName,
    vendorRecord?.description,
    vendorRecord?.location,
    user?.phone,
  ]
  const completion = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100,
  )

  // Work the vendor actually has waiting, read off the queue and the catalogue.
  const pendingLines = (queueData?.items ?? []).filter(
    (line) => line.status === 'PENDING',
  )
  const confirmedLines = (queueData?.items ?? []).filter(
    (line) => line.status === 'CONFIRMED',
  )
  const lowStockItems = vendorProducts.filter(
    (product) => product.status === 'Active' && product.stock <= 20,
  )

  const vendorTasks = [
    ...(pendingLines.length
      ? [
          `Confirm ${pendingLines.length} new order ${
            pendingLines.length === 1 ? 'line' : 'lines'
          }`,
        ]
      : []),
    ...(confirmedLines.length
      ? [
          `Dispatch ${confirmedLines.length} confirmed ${
            confirmedLines.length === 1 ? 'line' : 'lines'
          }`,
        ]
      : []),
    ...lowStockItems
      .slice(0, 3)
      .map((product) => `Restock ${product.name} - ${product.stock} left`),
    ...(vendorRecord && !vendorRecord.description
      ? ['Add a business description to your storefront']
      : []),
  ]

  return (
    <main className="w-full">
      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Vendor Dashboard
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Manage products, orders, and vendor performance.
            </h1>
            <p className="max-w-2xl leading-7 text-on-ink">
              Your live workspace for catalog activity, order fulfilment, and
              supplier profile readiness.
            </p>
          </div>

          <div className="surface-panel grid gap-1 p-5 text-secondary">
            <span className="text-3xl font-black">Dashboard</span>
            <span className="text-sm font-semibold text-steel">
              {vendorOrders.length} order lines
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
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowProductForm((open) => !open)}
                >
                  {showProductForm ? 'Cancel' : 'Add Product'}
                </button>
              </div>

              {showProductForm ? (
                <form
                  className="grid gap-4 border-b border-concrete p-5 md:grid-cols-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    createProduct.mutate()
                  }}
                >
                  <label className="grid gap-1">
                    <span className="form-label">Product name</span>
                    <input
                      className="form-input"
                      required
                      minLength={2}
                      value={draft.name}
                      onChange={(event) =>
                        setDraft({ ...draft, name: event.target.value })
                      }
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="form-label">Category</span>
                    <select
                      className="form-input"
                      required
                      value={draft.category_id}
                      onChange={(event) =>
                        setDraft({ ...draft, category_id: event.target.value })
                      }
                    >
                      <option value="">Select a category</option>
                      {(categories ?? []).map((category) => (
                        <option key={category.id} value={category.id}>
                          {'\u00a0'.repeat(category.depth * 2)}
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="form-label">Unit</span>
                    <select
                      className="form-input"
                      value={draft.unit}
                      onChange={(event) =>
                        setDraft({ ...draft, unit: event.target.value })
                      }
                    >
                      {['BAG', 'TON', 'PIECE', 'METRE', 'LITRE', 'BUNDLE'].map(
                        (unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="form-label">Price (GH₵)</span>
                    <input
                      className="form-input"
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={draft.price}
                      onChange={(event) =>
                        setDraft({ ...draft, price: event.target.value })
                      }
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="form-label">Stock quantity</span>
                    <input
                      className="form-input"
                      required
                      type="number"
                      min="0"
                      value={draft.stock_qty}
                      onChange={(event) =>
                        setDraft({ ...draft, stock_qty: event.target.value })
                      }
                    />
                  </label>
                  <label className="grid gap-1 md:col-span-2">
                    <span className="form-label">Description</span>
                    <textarea
                      className="form-input min-h-24 resize-y"
                      value={draft.description}
                      onChange={(event) =>
                        setDraft({ ...draft, description: event.target.value })
                      }
                    />
                  </label>
                  <button
                    type="submit"
                    className="btn-primary md:col-span-2"
                    disabled={createProduct.isPending}
                  >
                    {createProduct.isPending ? 'Saving…' : 'List product'}
                  </button>
                </form>
              ) : null}

              <div className="hidden md:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-secondary-50 text-sm text-secondary">
                    <tr>
                      <th className="p-4 font-bold">Product</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Stock</th>
                      <th className="p-4 font-bold">Price</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorProducts.map((product) => (
                      <tr key={product.id} className="border-t border-concrete">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={materialImage(product)}
                              alt=""
                              className="size-12 shrink-0 rounded-control bg-ink object-cover"
                              loading="lazy"
                            />
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
                        <td className="p-4">
                          {product.status !== 'ARCHIVED' ? (
                            <button
                              type="button"
                              className="btn-secondary px-3 py-1 text-sm"
                              disabled={archive.isPending}
                              onClick={() => archive.mutate(product.id)}
                            >
                              Archive
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {vendorProducts.length === 0 ? (
                <div className="grid gap-3 p-8 text-center">
                  <p className="font-bold text-secondary">
                    You have not listed anything yet
                  </p>
                  <p className="text-sm text-steel">
                    Use "Add Product" above to publish your first listing - it
                    goes live on the marketplace immediately.
                  </p>
                </div>
              ) : null}

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
                    className="grid gap-4 rounded-panel border border-concrete bg-surface p-4 lg:grid-cols-[1fr_auto] lg:items-center"
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
                      {order.rawStatus === 'PENDING' ? (
                        <button
                          type="button"
                          className="btn-primary px-3 py-1 text-sm"
                          disabled={advance.isPending}
                          onClick={() =>
                            advance.mutate({
                              lineId: order.lineId,
                              status: 'CONFIRMED',
                            })
                          }
                        >
                          Confirm
                        </button>
                      ) : null}
                      {order.rawStatus === 'CONFIRMED' ? (
                        <button
                          type="button"
                          className="btn-primary px-3 py-1 text-sm"
                          disabled={advance.isPending}
                          onClick={() =>
                            advance.mutate({ lineId: order.lineId, status: 'READY' })
                          }
                        >
                          Mark ready
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
                {vendorOrders.length === 0 ? (
                  <p className="text-steel">No orders yet.</p>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="grid gap-5">
            <section className="surface-panel grid gap-5 p-6">
              <div className="flex items-center gap-4">
                <div className="grid size-16 place-items-center rounded-full bg-primary text-xl font-black text-on-primary">
                  {initials}
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
                  {vendorProducts.length}{' '}
                  {vendorProducts.length === 1 ? 'listing' : 'listings'}
                </span>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-steel">Profile completion</span>
                  <span className="text-secondary">{completion}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-secondary-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>

              {editingProfile && profileDraft ? (
                <form
                  className="grid gap-3"
                  onSubmit={(event) => {
                    event.preventDefault()
                    saveProfile.mutate()
                  }}
                >
                  <label className="grid gap-1">
                    <span className="form-label">Business name</span>
                    <input
                      className="form-input"
                      required
                      minLength={2}
                      value={profileDraft.businessName}
                      onChange={(event) =>
                        setProfileDraft({
                          ...profileDraft,
                          businessName: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="form-label">Location</span>
                    <input
                      className="form-input"
                      value={profileDraft.location}
                      onChange={(event) =>
                        setProfileDraft({
                          ...profileDraft,
                          location: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="form-label">Description</span>
                    <textarea
                      className="form-input min-h-24 resize-y"
                      value={profileDraft.description}
                      onChange={(event) =>
                        setProfileDraft({
                          ...profileDraft,
                          description: event.target.value,
                        })
                      }
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={saveProfile.isPending}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button type="button" className="btn-primary" onClick={beginEditing}>
                  <FiEdit3 aria-hidden="true" />
                  Edit Profile
                </button>
              )}
            </section>

            <section className="surface-panel grid gap-4 p-6">
              <h2 className="text-xl font-black text-secondary">
                Dashboard Tasks
              </h2>
              {/* Derived from the queue and the catalogue, so the list empties
                  as the work is done. */}
              <div className="grid gap-3">
                {vendorTasks.length > 0 ? (
                  vendorTasks.map((task) => (
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
                  ))
                ) : (
                  <p className="text-sm text-steel">
                    Nothing outstanding. New orders will appear here.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default VendorDashboard
