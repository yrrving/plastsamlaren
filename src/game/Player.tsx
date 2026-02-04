import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useGameStore } from '../store/gameStore'
import { OBSTACLES } from './Environment'

const SPEED = 8
const BOUNDS = 45
const PLAYER_RADIUS = 0.4

// Check if position collides with any obstacle
function checkCollision(x: number, z: number): boolean {
  for (const obs of OBSTACLES) {
    const dx = x - obs.x
    const dz = z - obs.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < PLAYER_RADIUS + obs.radius) {
      return true
    }
  }
  return false
}

export default function Player() {
  const ref = useRef<Group>(null!)
  const keys = useRef({ w: false, a: false, s: false, d: false })
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition)
  const mobileInput = useGameStore((s) => s.mobileInput)

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'arrowup') keys.current.w = true
      if (k === 'a' || k === 'arrowleft') keys.current.a = true
      if (k === 's' || k === 'arrowdown') keys.current.s = true
      if (k === 'd' || k === 'arrowright') keys.current.d = true
    }
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'arrowup') keys.current.w = false
      if (k === 'a' || k === 'arrowleft') keys.current.a = false
      if (k === 's' || k === 'arrowdown') keys.current.s = false
      if (k === 'd' || k === 'arrowright') keys.current.d = false
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  useFrame((state, delta) => {
    const { w, a, s, d } = keys.current
    let dx = 0
    let dz = 0

    // Keyboard input
    if (w) dz -= 1
    if (s) dz += 1
    if (a) dx -= 1
    if (d) dx += 1

    // Mobile joystick input (add to keyboard input)
    dx += mobileInput.x
    dz += mobileInput.y

    // Normalize diagonal movement
    const len = Math.sqrt(dx * dx + dz * dz)
    if (len > 0) {
      dx = (dx / len) * SPEED * delta
      dz = (dz / len) * SPEED * delta

      // Calculate new position
      const newX = Math.max(-BOUNDS, Math.min(BOUNDS, ref.current.position.x + dx))
      const newZ = Math.max(-BOUNDS, Math.min(BOUNDS, ref.current.position.z + dz))

      // Check collision and apply movement
      // Try full movement first
      if (!checkCollision(newX, newZ)) {
        ref.current.position.x = newX
        ref.current.position.z = newZ
      } else {
        // Try sliding along X axis only
        if (!checkCollision(newX, ref.current.position.z)) {
          ref.current.position.x = newX
        }
        // Try sliding along Z axis only
        else if (!checkCollision(ref.current.position.x, newZ)) {
          ref.current.position.z = newZ
        }
        // Blocked in both directions - don't move
      }

      // Face movement direction
      ref.current.rotation.y = Math.atan2(dx, dz)
    }

    setPlayerPosition([ref.current.position.x, 0.75, ref.current.position.z])

    // Camera follow
    const cam = state.camera
    cam.position.x = ref.current.position.x
    cam.position.z = ref.current.position.z + 18
    cam.position.y = 14
    cam.lookAt(ref.current.position.x, 0, ref.current.position.z)
  })

  return (
    <group ref={ref} position={[0, 0.75, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1, 8]} />
        <meshStandardMaterial color="#4a90d9" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#f5c6a0" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.75, 0.25]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.1, 0.75, 0.25]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}
