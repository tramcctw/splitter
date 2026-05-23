type GenerateSRTOptions = {
  minDurationSec: number
  maxDurationSec: number
  speechRate: number
  baseDurationSec: number
  perWordSec: number
  perCharSec: number
}

const DEFAULT_SRT_OPTIONS: GenerateSRTOptions = {
  minDurationSec: 1.2,
  maxDurationSec: 3.0,
  speechRate: 1,
  baseDurationSec: 0.7,
  perWordSec: 0.22,
  perCharSec: 0.015,
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = Math.floor(safe % 60)
  const milliseconds = Math.min(
    999,
    Math.floor((safe - Math.floor(safe)) * 1000),
  )

  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  const ms = String(milliseconds).padStart(3, '0')

  return `${hh}:${mm}:${ss},${ms}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function estimateDuration(line: string, options: GenerateSRTOptions): number {
  const words = line.split(/\s+/).filter(Boolean).length
  const chars = line.length
  const raw =
    options.baseDurationSec +
    words * options.perWordSec +
    chars * options.perCharSec

  return clamp(raw / options.speechRate, options.minDurationSec, options.maxDurationSec)
}

export function generateSRT(lines: string[], customOptions?: Partial<GenerateSRTOptions>): string {
  const options: GenerateSRTOptions = { ...DEFAULT_SRT_OPTIONS, ...customOptions }
  const normalized = lines.map((line) => line.trim()).filter(Boolean)
  let cursor = 0

  const blocks = normalized.map((line, index) => {
    const start = cursor
    const duration = estimateDuration(line, options)
    const end = start + duration
    cursor = end

    return [
      String(index + 1),
      `${formatTime(start)} --> ${formatTime(end)}`,
      line,
      '',
    ].join('\r\n')
  })

  return blocks.join('\r\n')
}

export const buildSrt = generateSRT

export function downloadFile(content: string, filename: string, mimeType: string) {
  const safeContent = content.trim().length > 0 ? content : ''
  const blob = new Blob([safeContent], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
