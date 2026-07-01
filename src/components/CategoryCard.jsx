function CategoryCard({ category }) {
  const Icon = category.icon

  return (
    <article className="surface-panel grid gap-4 p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="grid size-12 place-items-center rounded-control bg-primary-100 text-primary-700">
        <Icon size={22} aria-hidden="true" />
      </div>
      <div className="grid gap-2">
        <h3 className="text-lg font-bold text-secondary">{category.name}</h3>
        <p className="text-sm leading-6 text-steel">{category.description}</p>
      </div>
    </article>
  )
}

export default CategoryCard
