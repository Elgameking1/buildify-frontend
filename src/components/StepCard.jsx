function StepCard({ step, index }) {
  const Icon = step.icon

  return (
    <article className="grid gap-4">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-ink font-bold text-white">
          {index + 1}
        </span>
        <div className="grid size-10 place-items-center rounded-control bg-primary-100 text-primary-700">
          <Icon aria-hidden="true" />
        </div>
      </div>
      <div className="grid gap-2">
        <h3 className="text-lg font-bold text-secondary">{step.title}</h3>
        <p className="text-sm leading-6 text-steel">{step.description}</p>
      </div>
    </article>
  )
}

export default StepCard
