import { useMemo, useState } from 'react'
import { splitSubtitleText } from '../utils/subtitleSplitter'

const DEFAULT_TEXT = 'Most people waste hours every day without realizing it.'

export function useSubtitleSplitter() {
  const [inputText, setInputText] = useState(DEFAULT_TEXT)

  const lines = useMemo(() => splitSubtitleText(inputText), [inputText])
  const outputText = useMemo(() => lines.join('\n\n'), [lines])

  return {
    inputText,
    setInputText,
    lines,
    outputText,
  }
}
