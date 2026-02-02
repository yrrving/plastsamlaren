import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useGameStore } from '../store/gameStore'

const COLLECT_DISTANCE = 1.5

const PLASTIC_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#9b59b6', '#1abc9c', '#3498db']

interface Props {
  position: [number, number, number]
  onCollected: () => void
  colorIndex: number
  shape: 'box' | 'cylinder' | 'sphere'
}

export default function PlasticItem({ position, onCollected, colorIndex, shape }: Props) {
  const ref = useRef<Mesh>(null!)
  const [collected, setCollected] = useState(false)
  const collectPlastic = useGameStore((s) => s.collectPlastic)
  const playerPosition = useGameStore((s) => s.playerPosition)

  useFrame((_state, delta) => {
    if (collected) return
    ref.current.rotation.y += delta * 2

    // Collision check
    const dx = playerPosition[0] - position[0]
    const dz = playerPosition[2] - position[2]
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < COLLECT_DISTANCE) {
      setCollected(true)
      collectPlastic()
      onCollected()
    }
  })

  if (collected) return null

  const color = PLASTIC_COLORS[colorIndex % PLASTIC_COLORS.length]

  return (
    <mesh ref={ref} position={[position[0], position[1] + 0.3, position[2]]} castShadow>
      {shape === 'box' && <boxGeometry args={[0.4, 0.4, 0.4]} />}
      {shape === 'cylinder' && <cylinderGeometry args={[0.15, 0.15, 0.5, 6]} />}
      {shape === 'sphere' && <sphereGeometry args={[0.25, 6, 6]} />}
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  )
}
