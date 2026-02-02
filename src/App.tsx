import { useGameStore } from './store/gameStore'
import StartScreen from './components/StartScreen'
import HUD from './components/HUD'
import Game from './game/Game'

export default function App() {
  const started = useGameStore((s) => s.started)

  if (!started) {
    return <StartScreen />
  }

  return (
    <>
      <Game />
      <HUD />
    </>
  )
}
