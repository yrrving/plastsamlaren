import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import type { Group } from 'three'
import { useGameStore } from '../store/gameStore'

const INTERACT_DISTANCE = 2
const WALK_SPEED = 1.5
const WANDER_RADIUS = 8

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

  const currentPosRef = useRef<[number, number, number]>([...position])
  const walkTargetRef = useRef<[number, number, number]>([...position])
  const walkTimerRef = useRef(Math.random() * 3)

  const pickNewTarget = () => {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * WANDER_RADIUS
    walkTargetRef.current = [
      position[0] + Math.cos(angle) * dist,
      position[1],
      position[2] + Math.sin(angle) * dist,
    ]
  }

  useFrame((_state, delta) => {
    if (!ref.current) return

    if (fadeOut) {
      ref.current.scale.x -= delta * 0.5
      ref.current.scale.y -= delta * 0.5
      ref.current.scale.z -= delta * 0.5
      if (ref.current.scale.x <= 0) {
        ref.current.visible = false
      }
      return
    }
    if (happy) return

    // Random walk
    walkTimerRef.current -= delta
    if (walkTimerRef.current <= 0) {
      pickNewTarget()
      walkTimerRef.current = 2 + Math.random() * 4
    }

    const cur = currentPosRef.current
    const tgt = walkTargetRef.current
    const dx = tgt[0] - cur[0]
    const dz = tgt[2] - cur[2]
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist > 0.1) {
      const step = Math.min(WALK_SPEED * delta, dist)
      cur[0] += (dx / dist) * step
      cur[2] += (dz / dist) * step

      // Rotate toward movement direction
      const angle = Math.atan2(dx, dz)
      ref.current.rotation.y = angle
    }

    // Apply position + idle bob
    ref.current.position.x = cur[0]
    ref.current.position.y = Math.sin(Date.now() * 0.003) * 0.05
    ref.current.position.z = cur[2]

    // Distance check using current position
    const pdx = playerPosition[0] - cur[0]
    const pdz = playerPosition[2] - cur[2]
    const playerDist = Math.sqrt(pdx * pdx + pdz * pdz)
    setShowHint(playerDist < INTERACT_DISTANCE)
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
      <Billboard position={[0, 2, 0]} follow={true}>
        {!happy && (
          <Text
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
          >
            💧
          </Text>
        )}
        {happy && (
          <Text
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
          >
            😊
          </Text>
        )}
      </Billboard>

      {showHint && !happy && (
        <Billboard position={[0, 2.5, 0]} follow={true}>
          <Text
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
        </Billboard>
      )}
    </group>
  )
}
