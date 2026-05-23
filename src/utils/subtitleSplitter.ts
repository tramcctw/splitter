export type SplitOptions = {
  minWordsPerLine: number
  maxWordsPerLine: number
  maxCharsPerLine: number
}

const DEFAULT_OPTIONS: SplitOptions = {
  minWordsPerLine: 2,
  maxWordsPerLine: 5,
  maxCharsPerLine: 32,
}

const PUNCTUATION_BREAK = /([.!?;:])\s+/g
const SPACE_REGEX = /\s+/g
const CLAUSE_BREAKERS = new Set([
  'and',
  'but',
  'or',
  'so',
  'because',
  'while',
  'when',
  'if',
  'then',
  'though',
  'however',
])

const BAD_LINE_ENDINGS = new Set([
  'and',
  'or',
  'the',
  'a',
  'an',
  'to',
  'of',
  'in',
  'on',
  'at',
  'for',
  'with',
  'than',
  'but',
  'if',
])

const COLLOCATION_GROUPS = [
  ['fast', 'and', 'simple'],
  ['user', 'experience'],
  ['loading', 'speed'],
  ['more', 'important', 'than'],
  ['hundreds', 'of', 'features'],
  ['perform', 'better'],
  ['complicated', 'platforms'],
  ['one', 'thing'],
  ['simple', 'tool'],
]

type CollocationSpan = { start: number; end: number }

function normalizeText(text: string): string {
  return text.replace(SPACE_REGEX, ' ').trim()
}

function splitByPunctuation(text: string): string[] {
  const segments = text
    .replace(PUNCTUATION_BREAK, '$1\n')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  return segments.length > 0 ? segments : [text]
}

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, '')
}

function findCollocationSpans(words: string[]): CollocationSpan[] {
  const lowered = words.map(normalizeWord)
  const spans: CollocationSpan[] = []

  for (let i = 0; i < lowered.length; i += 1) {
    for (const group of COLLOCATION_GROUPS) {
      if (i + group.length > lowered.length) continue
      let matched = true
      for (let j = 0; j < group.length; j += 1) {
        if (lowered[i + j] !== group[j]) {
          matched = false
          break
        }
      }
      if (matched) {
        spans.push({ start: i, end: i + group.length - 1 })
      }
    }
  }

  return spans
}

function collocationBreakPenalty(
  breakIndexExclusive: number,
  spans: CollocationSpan[],
): number {
  let penalty = 0
  const lastLeft = breakIndexExclusive - 1
  const firstRight = breakIndexExclusive

  for (const span of spans) {
    if (span.start <= lastLeft && span.end >= firstRight) {
      penalty -= 12
    }
  }

  return penalty
}

function scoreBreakpoint(params: {
  words: string[]
  start: number
  breakIndexExclusive: number
  options: SplitOptions
  collocationSpans: CollocationSpan[]
}): number {
  const { words, start, breakIndexExclusive, options, collocationSpans } = params
  const lineWords = words.slice(start, breakIndexExclusive)
  const lineText = lineWords.join(' ')
  const lastWordRaw = lineWords[lineWords.length - 1] ?? ''
  const lastWord = normalizeWord(lastWordRaw)
  const nextWord = normalizeWord(words[breakIndexExclusive] ?? '')
  const lineLen = lineWords.length

  let score = 0

  if (/[,;:!?]$/.test(lastWordRaw)) score += 9
  if (CLAUSE_BREAKERS.has(nextWord)) score += 7

  // Prefer subtitle rhythm (2-4 words) over max-length packing.
  if (lineLen >= 2 && lineLen <= 4) score += 8
  else if (lineLen === 5) score += 3

  const idealChars = Math.min(22, options.maxCharsPerLine)
  score -= Math.abs(lineText.length - idealChars) * 0.15

  if (BAD_LINE_ENDINGS.has(lastWord)) score -= 16

  score += collocationBreakPenalty(breakIndexExclusive, collocationSpans)

  if (lineText.length > options.maxCharsPerLine) score -= 100

  return score
}

function splitSegmentWords(segment: string, options: SplitOptions): string[] {
  const words = segment.split(' ').filter(Boolean)
  if (words.length <= options.maxWordsPerLine && segment.length <= options.maxCharsPerLine) {
    return [segment]
  }

  const collocationSpans = findCollocationSpans(words)
  const lines: string[] = []
  let start = 0

  while (start < words.length) {
    const hardEnd = Math.min(start + options.maxWordsPerLine + 1, words.length)
    let bestEnd = Math.min(start + options.maxWordsPerLine, words.length)
    let bestScore = Number.NEGATIVE_INFINITY

    for (let i = start + options.minWordsPerLine; i <= hardEnd; i += 1) {
      const chunk = words.slice(start, i).join(' ')
      if (chunk.length > options.maxCharsPerLine + 8) break
      const score = scoreBreakpoint({
        words,
        start,
        breakIndexExclusive: i,
        options,
        collocationSpans,
      })

      if (score > bestScore) {
        bestScore = score
        bestEnd = i
      }
    }

    if (bestEnd <= start) {
      bestEnd = Math.min(start + options.minWordsPerLine, words.length)
    }

    const line = words.slice(start, bestEnd).join(' ')
    lines.push(line)
    start = bestEnd
  }

  return lines
}

function smoothRhythm(lines: string[], options: SplitOptions): string[] {
  if (lines.length < 2) return lines

  const result = [...lines]

  for (let i = 0; i < result.length - 1; i += 1) {
    const currentWords = result[i].split(' ')
    const nextWords = result[i + 1].split(' ')

    if (
      nextWords.length === 1 &&
      currentWords.length > options.minWordsPerLine &&
      !BAD_LINE_ENDINGS.has(normalizeWord(currentWords[currentWords.length - 2] ?? ''))
    ) {
      const shifted = currentWords.pop()
      if (shifted) {
        result[i] = currentWords.join(' ')
        result[i + 1] = [shifted, ...nextWords].join(' ')
      }
    }
  }

  return result
}

export function splitSubtitleText(input: string, customOptions?: Partial<SplitOptions>): string[] {
  const options = { ...DEFAULT_OPTIONS, ...customOptions }
  const cleaned = normalizeText(input)

  if (!cleaned) return []

  const punctuationChunks = splitByPunctuation(cleaned)
  const splitLines = punctuationChunks.flatMap((segment) => splitSegmentWords(segment, options))

  return smoothRhythm(splitLines, options)
}

export function splitSubtitleToText(input: string, customOptions?: Partial<SplitOptions>): string {
  return splitSubtitleText(input, customOptions).join('\n\n')
}
