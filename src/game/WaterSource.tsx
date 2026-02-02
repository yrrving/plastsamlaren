import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import type { Group } from 'three'
import { useGameStore } from '../store/gameStore'

const INTERACT_DISTANCE = 2.5

export default function WaterSource({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null!)
  const [showHint, setShowHint] = useState(false)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const emptyBottles = useGameStore((s) => s.emptyBottles)
  const fillBottle = useGameStore((s) => s.fillBottle)

  useFrame(() => {
    const dx = playerPosition[0] - position[0]
    const dz = playerPosition[2] - position[2]
    const dist = Math.sqrt(dx * dx + dz * dz)
    setShowHint(dist < INTERACT_DISTANCE)

    // Animate water surface
    if (ref.current) {
      const water = ref.current.children.find((c) => c.userData.isWater)
      if (water) {
        water.position.y = 0.3 + Math.sin(Date.now() * 0.002) * 0.05
      }
    }
  })

  return (
    <group ref={ref} position={position}>
      {/* Basin */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[2, 2.2, 0.5, 12]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.3, 0]} userData={{ isWater: true }}>
        <cylinderGeometry args={[1.8, 1.8, 0.15, 12]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.7} />
      </mesh>
      {/* Center fountain pillar */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
      {/* Water spray top */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#74b9ff" transparent opacity={0.5} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.35}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        💧 Vattenkälla
      </Text>
      {showHint && (
        <Text
          position={[0, 1.7, 0]}
          fontSize={0.25}
          color={emptyBottles > 0 ? '#2ecc71' : '#e74c3c'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
          onClick={() => fillBottle()}
        >
          {emptyBottles > 0
            ? `Tryck F för att fylla (${emptyBottles} tomma)`
            : 'Inga tomma flaskor'}
        </Text>
      )}
    </group>
  )
}
