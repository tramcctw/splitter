import { faqItems } from '../../data/faq'
import { SectionHeading } from '../ui/SectionHeading'

export function FaqSection() {
  return (
    <section className="py-16">
      <SectionHeading eyebrow="FAQ" title="Quick answers" />
      <div className="mt-8 grid gap-3">
        {faqItems.map((item) => (
          <details key={item.question} className="rounded-xl border border-neutral-200 bg-white p-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-neutral-900">{item.question}</summary>
            <p className="mt-2 text-sm text-neutral-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
