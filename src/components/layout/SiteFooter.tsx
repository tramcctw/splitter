export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Subtitle Splitter</p>
        <p>Frontend-only MVP.</p>
      </div>
    </footer>
  )
}
