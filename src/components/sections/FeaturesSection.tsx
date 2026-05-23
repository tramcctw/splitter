import { SectionHeading } from '../ui/SectionHeading'

const features = [
  { title: 'Auto Subtitle Formatter', description: 'Split long text into short, readable subtitle lines automatically.' },
  { title: 'Caption Splitter + Line Breaker', description: 'Create better subtitle rhythm with punctuation-aware line breaks.' },
  { title: 'SRT Generator and TXT Export', description: 'Export clean subtitle files for Shorts, Reels, and editor timelines.' },
]

export function FeaturesSection() {
  return (
    <section className="py-16">
      <SectionHeading eyebrow="Features" title="Built for fast subtitle workflows" />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-xl border border-neutral-200 bg-white p-4">
            <h3 className="text-sm font-medium text-neutral-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
