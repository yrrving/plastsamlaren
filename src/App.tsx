import { useGameStore } from './store/gameStore'
import StartScreen from './components/StartScreen'
import HUD from './components/HUD'
import Game from './game/Game'
import GameOverScreen from './components/GameOverScreen'

export default function App() {
  const started = useGameStore((s) => s.started)
  const timedGameOver = useGameStore((s) => s.timedGameOver)

  if (!started) {
    return <StartScreen />
  }

  if (timedGameOver) {
    return <GameOverScreen />
  }

  return (
    <>
      <Game />
      <HUD />
    </>
  )
}
