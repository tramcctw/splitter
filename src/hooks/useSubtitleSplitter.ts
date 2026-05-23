import { useMemo, useState } from 'react'
import { splitSubtitleText } from '../utils/subtitleSplitter'

export function useSubtitleSplitter() {
  const [inputText, setInputText] = useState('')

  const lines = useMemo(() => splitSubtitleText(inputText), [inputText])
  const outputText = useMemo(() => lines.join('\n\n'), [lines])

  return {
    inputText,
    setInputText,
    lines,
    outputText,
  }
}
