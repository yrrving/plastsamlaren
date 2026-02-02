import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import type { Group } from 'three'
import { useGameStore } from '../store/gameStore'

const INTERACT_DISTANCE = 2

const NPC_COLORS = ['#e67e22', '#9b59b6', '#1abc9c', '#e74c3c', '#2ecc71']

interface Props {
  id: string
  position: [number, number, number]
  colorIndex: number
}

export default function ThirstyNPC({ id, position, colorIndex }: Props) {
  const ref = useRef<Group>(null!)
  const [showHint, setShowHint] = useState(false)
  const [happy, setHappy] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const filledBottles = useGameStore((s) => s.filledBottles)
  const giveBottle = useGameStore((s) => s.giveBottle)
  const markNpcHelped = useGameStore((s) => s.markNpcHelped)

  useFrame((_state, delta) => {
    if (fadeOut) {
      if (ref.current) {
        ref.current.scale.x -= delta * 0.5
        ref.current.scale.y -= delta * 0.5
        ref.current.scale.z -= delta * 0.5
        if (ref.current.scale.x <= 0) {
          ref.current.visible = false
        }
      }
      return
    }
    if (happy) return

    const dx = playerPosition[0] - position[0]
    const dz = playerPosition[2] - position[2]
    const dist = Math.sqrt(dx * dx + dz * dz)
    setShowHint(dist < INTERACT_DISTANCE)

    // Idle bob
    if (ref.current) {
      ref.current.position.y = Math.sin(Date.now() * 0.003) * 0.05
    }
  })

  const handleGive = () => {
    if (happy) return
    if (giveBottle()) {
      setHappy(true)
      setShowHint(false)
      markNpcHelped(id)
      setTimeout(() => setFadeOut(true), 2000)
    }
  }

  // Key listener is handled in HUD component

  const bodyColor = happy ? '#2ecc71' : NPC_COLORS[colorIndex % NPC_COLORS.length]

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.9, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#f5c6a0" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 1.35, 0.23]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.08, 1.35, 0.23]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Speech bubble */}
      {!happy && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
        >
          💧
        </Text>
      )}
      {happy && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
        >
          😊
        </Text>
      )}

      {showHint && !happy && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.22}
          color={filledBottles > 0 ? '#2ecc71' : '#e74c3c'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
          onClick={handleGive}
        >
          {filledBottles > 0
            ? 'Tryck G för att ge vatten'
            : 'Inga fyllda flaskor'}
        </Text>
      )}
    </group>
  )
}
