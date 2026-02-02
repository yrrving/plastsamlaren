import { useState, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import PlasticItem from './PlasticItem'

const SHAPES: ('box' | 'cylinder' | 'sphere')[] = ['box', 'cylinder', 'sphere']
const SPAWN_RANGE = 40
const INITIAL_COUNT = 20
const RESPAWN_DELAY = 5 // seconds

function randomPosition(): [number, number, number] {
  return [
    (Math.random() - 0.5) * SPAWN_RANGE,
    0,
    (Math.random() - 0.5) * SPAWN_RANGE,
  ]
}

interface PlasticData {
  id: number
  position: [number, number, number]
  colorIndex: number
  shape: 'box' | 'cylinder' | 'sphere'
}

let nextId = 0
function createPlastic(): PlasticData {
  return {
    id: nextId++,
    position: randomPosition(),
    colorIndex: Math.floor(Math.random() * 6),
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  }
}

export default function PlasticSpawner() {
  const [items, setItems] = useState<PlasticData[]>(() =>
    Array.from({ length: INITIAL_COUNT }, () => createPlastic())
  )
  const respawnTimer = useRef(0)

  useFrame((_state, delta) => {
    if (items.length < INITIAL_COUNT) {
      respawnTimer.current += delta
      if (respawnTimer.current >= RESPAWN_DELAY) {
        respawnTimer.current = 0
        setItems((prev) => [...prev, createPlastic()])
      }
    }
  })

  const handleCollected = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return (
    <>
      {items.map((item) => (
        <PlasticItem
          key={item.id}
          position={item.position}
          colorIndex={item.colorIndex}
          shape={item.shape}
          onCollected={() => handleCollected(item.id)}
        />
      ))}
    </>
  )
}
