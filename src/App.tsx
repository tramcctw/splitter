import { FaqSection } from './components/sections/FaqSection'
import { FeaturesSection } from './components/sections/FeaturesSection'
import { HeroSection } from './components/sections/HeroSection'
import { SubtitleSplitterTool } from './components/splitter/SubtitleSplitterTool'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <main className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <HeroSection />
        <SubtitleSplitterTool />
        <FeaturesSection />
        <FaqSection />
      </main>
    </div>
  )
}

export default App
