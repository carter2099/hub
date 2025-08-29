import { useState } from 'react'
import LandingPage from './components/LandingPage'
import Showcase from './components/Showcase'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'showcase'>('landing')

  const handleEnterClick = () => {
    setCurrentView('showcase')
  }

  const handleBackClick = () => {
    setCurrentView('landing')
  }

  if (currentView === 'showcase') {
    return <Showcase onBack={handleBackClick} />
  }

  return <LandingPage onEnterClick={handleEnterClick} />
}

export default App
