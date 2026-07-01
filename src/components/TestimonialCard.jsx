function TestimonialCard({ testimonial }) {
  return (
    <article className="surface-panel grid gap-5 p-6">
      <p className="text-lg font-semibold leading-8 text-secondary">
        “{testimonial.quote}”
      </p>
      <div>
        <h3 className="font-bold text-secondary">{testimonial.name}</h3>
        <p className="text-sm text-steel">{testimonial.role}</p>
      </div>
    </article>
  )
}

export default TestimonialCard
