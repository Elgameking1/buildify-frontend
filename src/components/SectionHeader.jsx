function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mx-auto grid max-w-3xl gap-3 text-center">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
        {eyebrow}
      </span>
      <h2 className="text-balance text-3xl font-black text-secondary md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-7 text-steel">{description}</p>
      ) : null}
    </div>
  )
}

export default SectionHeader
