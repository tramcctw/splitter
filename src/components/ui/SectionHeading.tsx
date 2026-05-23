type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">{eyebrow}</p> : null}
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">{title}</h2>
      {description ? <p className="mt-2 text-sm text-neutral-600">{description}</p> : null}
    </header>
  )
}
