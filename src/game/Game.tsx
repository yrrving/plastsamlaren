import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import Player from './Player'
import Ground from './Ground'
import PlasticSpawner from './PlasticSpawner'
import CraftingStation from './CraftingStation'
import WaterSource from './WaterSource'
import ThirstyNPC from './ThirstyNPC'
import Environment from './Environment'
import { useGameStore } from '../store/gameStore'

const NPC_POSITIONS: [number, number, number][] = [
  [10, 0, -10],
  [-12, 0, -8],
  [8, 0, 15],
  [-15, 0, 12],
  [20, 0, 0],
]

let npcIdCounter = 0

function createNpcBatch() {
  return NPC_POSITIONS.map((pos, i) => ({
    id: `npc-${npcIdCounter++}`,
    position: pos,
    colorIndex: i,
  }))
}

function NPCManager() {
  const [npcs, setNpcs] = useState(() => createNpcBatch())
  const npcsHelped = useGameStore((s) => s.npcsHelped)
  const prevHelped = useRef(npcsHelped)

  // When all NPCs are helped, respawn a new batch
  useEffect(() => {
    if (npcsHelped > 0 && npcsHelped !== prevHelped.current && npcsHelped % NPC_POSITIONS.length === 0) {
      setTimeout(() => {
        setNpcs(createNpcBatch())
      }, 2500)
    }
    prevHelped.current = npcsHelped
  }, [npcsHelped])

  return (
    <>
      {npcs.map((npc) => (
        <ThirstyNPC
          key={npc.id}
          id={npc.id}
          position={npc.position}
          colorIndex={npc.colorIndex}
        />
      ))}
    </>
  )
}

export default function Game() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 14, 18], fov: 50 }}
      style={{ width: '100vw', height: '100vh', background: '#87CEEB' }}
    >
      <fog attach="fog" args={['#87CEEB', 30, 60]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight args={['#87CEEB', '#5cb85c', 0.3]} />

      <Ground />
      <Player />
      <PlasticSpawner />
      <CraftingStation position={[-6, 0, 5]} />
      <WaterSource position={[6, 0, 5]} />
      <NPCManager />
      <Environment />
    </Canvas>
  )
}
