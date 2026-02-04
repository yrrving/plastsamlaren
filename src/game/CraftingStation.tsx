import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import type { Group } from 'three'
import { useGameStore } from '../store/gameStore'

const INTERACT_DISTANCE = 2.5

export default function CraftingStation({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null!)
  const [showHint, setShowHint] = useState(false)
  const [flash, setFlash] = useState(false)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const plastic = useGameStore((s) => s.plastic)
  const craftBottle = useGameStore((s) => s.craftBottle)

  useFrame(() => {
    const dx = playerPosition[0] - position[0]
    const dz = playerPosition[2] - position[2]
    const dist = Math.sqrt(dx * dx + dz * dz)
    setShowHint(dist < INTERACT_DISTANCE)
  })

  const handleCraft = () => {
    if (craftBottle()) {
      setFlash(true)
      setTimeout(() => setFlash(false), 300)
    }
  }

  // Listen for E key when nearby
  useFrame(() => {
    // Key handling done in HUD for simplicity
  })

  return (
    <group ref={ref} position={position}>
      {/* Table top */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2, 0.15, 1.2]} />
        <meshStandardMaterial color={flash ? '#f1c40f' : '#8B4513'} />
      </mesh>
      {/* Legs */}
      {[[-0.8, 0.4, -0.4], [0.8, 0.4, -0.4], [-0.8, 0.4, 0.4], [0.8, 0.4, 0.4]].map(
        (p, i) => (
          <mesh key={i} position={p as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        )
      )}
      {/* Tools on table */}
      <mesh position={[0.3, 1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.15]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
      <mesh position={[-0.3, 1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 6]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      {showHint && (
        <Billboard position={[0, 2.0, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
          <Text
            fontSize={0.45}
            color={plastic >= 5 ? '#2ecc71' : '#e74c3c'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#000"
            fontWeight="bold"
            onClick={handleCraft}
          >
            {plastic >= 5
              ? `[B] Bygg flaska (${plastic} plast)`
              : `Behöver 5 plast (har ${plastic})`}
          </Text>
        </Billboard>
      )}
    </group>
  )
}
