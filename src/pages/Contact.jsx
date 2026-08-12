import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FiClock,
  FiExternalLink,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
} from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'

/**
 * Support and enquiries.
 *
 * The form composes a `mailto:` link rather than posting somewhere: the API has
 * no contact endpoint, and a form that showed "message sent" while dropping the
 * message would be worse than no form at all. The button says what it does, and
 * the address is on the page for anyone who would rather write directly.
 */
const SUPPORT_EMAIL = 'support@buildify.example'

const enquiryTypes = [
  { value: 'general', label: 'General enquiry' },
  { value: 'order', label: 'An order I placed' },
  { value: 'vendor', label: 'Selling materials (vendor)' },
  { value: 'worker', label: 'Offering my trade (worker)' },
  { value: 'report', label: 'Report a listing or account' },
]

const channels = [
  {
    id: 'email',
    icon: FiMail,
    label: 'Email',
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    note: 'Best for anything needing a paper trail.',
  },
  {
    id: 'phone',
    icon: FiPhone,
    label: 'Phone',
    value: '+233 591 927 991',
    href: 'tel:+233591927991',
    note: 'Weekdays, for urgent order problems.',
  },
  {
    id: 'address',
    icon: FiMapPin,
    label: 'Office',
    value: 'Accra, Greater Accra, Ghana',
    href: null,
    note: 'Visits by appointment only.',
  },
]

const faqs = [
  {
    id: 'payment',
    question: 'How do I pay for an order?',
    answer:
      'Payment is arranged directly with the vendor. The marketplace records the order, the agreed prices and the fulfilment status, but does not process card payments.',
  },
  {
    id: 'delivery',
    question: 'Who handles delivery?',
    answer:
      'The vendor does. Each product listing shows where it can be collected from, and your delivery address is passed to every vendor on the order.',
  },
  {
    id: 'verification',
    question: 'What does a verified vendor mean?',
    answer:
      'An administrator has checked the business behind the account. Unverified vendors can still list, so treat the badge as one signal among several.',
  },
  {
    id: 'rating',
    question: 'Can a worker be rated without being hired?',
    answer:
      'No. A rating can only be left by the client who raised the job, and only once that job has been marked complete.',
  },
]

function Contact() {
  const { user } = useSelector((state) => state.auth)
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: '',
  })

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }))

  const topicLabel =
    enquiryTypes.find((type) => type.value === form.topic)?.label ?? 'Enquiry'

  const handleSubmit = (event) => {
    event.preventDefault()

    const subject = `[${topicLabel}] ${form.name || 'Marketplace enquiry'}`
    const body = [
      form.message,
      '',
      '---',
      `From: ${form.name}`,
      `Reply to: ${form.email}`,
      user ? `Account: ${user.email} (${user.role})` : 'Not signed in',
    ].join('\n')

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <main className="w-full">
      <section className="bg-ink text-white section-spacing">
        <div className="page-container grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="grid gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Contact
            </span>
            <h1 className="text-balance text-4xl font-black md:text-5xl">
              Talk to us about an order, a listing, or an account.
            </h1>
            <p className="max-w-2xl leading-7 text-on-ink">
              Problems with a specific order are usually fastest to solve from
              your dashboard, where the vendor and the current status are
              already attached. For everything else, the details are here.
            </p>
          </div>

          <div className="surface-panel grid gap-3 p-5 text-secondary">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
              <FiClock aria-hidden="true" />
              Response time
            </span>
            <p className="text-3xl font-black">1 working day</p>
            <p className="text-sm text-steel">
              Monday to Friday, 08:00–17:00 GMT. Reports of unsafe or fraudulent
              listings are looked at the same day.
            </p>
          </div>
        </div>
      </section>

      <section className="page-container grid gap-8 section-spacing lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <aside className="grid gap-5 lg:sticky lg:top-24">
          <div className="surface-panel grid gap-5 p-6">
            <h2 className="text-2xl font-black text-secondary">
              Ways to reach us
            </h2>
            <div className="grid gap-5">
              {channels.map((channel) => {
                const Icon = channel.icon

                return (
                  <div key={channel.id} className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-control bg-primary-50 text-primary-700">
                      <Icon aria-hidden="true" />
                    </div>
                    <div className="grid gap-1">
                      <span className="text-sm font-semibold text-steel">
                        {channel.label}
                      </span>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="font-bold text-secondary hover:text-primary-700"
                        >
                          {channel.value}
                        </a>
                      ) : (
                        <span className="font-bold text-secondary">
                          {channel.value}
                        </span>
                      )}
                      <span className="text-sm text-steel">{channel.note}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="surface-panel grid gap-3 p-6">
            <h2 className="text-xl font-black text-secondary">
              Faster than emailing
            </h2>
            <p className="text-sm leading-6 text-steel">
              Order status, vendor contact details and job progress are all on
              your dashboard.
            </p>
            <Link to="/dashboard" className="btn-primary w-fit">
              Go to dashboard
            </Link>
          </div>
        </aside>

        <section className="surface-panel p-6 sm:p-8">
          <div className="mb-8 grid gap-2">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
              Send a message
            </p>
            <h2 className="text-balance text-3xl font-black text-secondary">
              Write to the support team
            </h2>
            <p className="text-steel">
              This opens your email application with the message ready to send,
              so the reply lands in your own inbox.
            </p>
          </div>

          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="form-label">Your name</span>
              <input
                className="form-input"
                required
                minLength={2}
                placeholder="Your full name"
                value={form.name}
                onChange={update('name')}
              />
            </label>

            <label className="grid gap-2">
              <span className="form-label">Reply-to email</span>
              <input
                className="form-input"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
              />
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="form-label">What is it about?</span>
              <select
                className="form-input"
                value={form.topic}
                onChange={update('topic')}
              >
                {enquiryTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="form-label">Message</span>
              <textarea
                className="form-input min-h-40 resize-y"
                required
                minLength={20}
                placeholder="Include the order reference or the listing name if there is one - it saves a round trip."
                value={form.message}
                onChange={update('message')}
              />
            </label>

            <button type="submit" className="btn-primary min-h-12 sm:col-span-2">
              <FiExternalLink aria-hidden="true" />
              Open in email app
            </button>
          </form>
        </section>
      </section>

      <section className="bg-secondary-50 section-spacing">
        <div className="page-container grid gap-10">
          <SectionHeader
            eyebrow="Before you write"
            title="The questions we are asked most."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.id} className="surface-panel grid gap-3 p-6">
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-control bg-primary-50 text-primary-700">
                    <FiMessageSquare aria-hidden="true" />
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-secondary">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-steel">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
