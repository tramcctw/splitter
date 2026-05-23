import { useMemo, useState } from 'react'
import { useSubtitleSplitter } from '../../hooks/useSubtitleSplitter'
import { downloadFile, generateSRT } from '../../utils/subtitleExport'

export function SubtitleSplitterTool() {
  const { inputText, setInputText, outputText, lines } = useSubtitleSplitter()
  const [copied, setCopied] = useState(false)
  const wordCount = useMemo(() => inputText.trim().split(/\s+/).filter(Boolean).length, [inputText])
  const hasOutput = lines.length > 0

  const handleCopy = async () => {
    if (!outputText) return
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      return
    }
  }

  return (
    <section aria-label="Subtitle Splitter Tool">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-medium text-neutral-900">Subtitle Splitter</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!hasOutput}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={() =>
                downloadFile(outputText, 'subtitle-splitter-output.txt', 'text/plain;charset=utf-8')
              }
              disabled={!hasOutput}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Export TXT
            </button>
            <button
              type="button"
              onClick={() =>
                downloadFile(generateSRT(lines), 'subtitle-splitter-output.srt', 'text/plain;charset=utf-8')
              }
              disabled={!hasOutput}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Export SRT
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <article>
            <label htmlFor="subtitle-input" className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
              Input
            </label>
            <textarea
              id="subtitle-input"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Paste text..."
              className="h-72 w-full resize-none rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </article>
          <article>
            <label htmlFor="subtitle-output" className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
              Output
            </label>
            <textarea
              id="subtitle-output"
              readOnly
              value={outputText}
              className="h-72 w-full resize-none rounded-md border border-neutral-200 bg-white p-3 text-sm leading-relaxed text-neutral-900 outline-none"
            />
          </article>
        </div>

        <p className="mt-3 text-xs text-neutral-500">{wordCount} words · {lines.length} lines · target 2-5 words/line</p>
      </div>
    </section>
  )
}
