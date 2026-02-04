function Tree({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 2, 6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial color="#27ae60" />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[0.7, 1.5, 6]} />
        <meshStandardMaterial color="#2ecc71" />
      </mesh>
    </group>
  )
}

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={[position[0], position[1] + 0.2 * scale, position[2]]} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
    </mesh>
  )
}

function Flower({ position }: { position: [number, number, number] }) {
  const colors = ['#e74c3c', '#f39c12', '#e91e63', '#9b59b6', '#f1c40f']
  const color = colors[Math.floor(Math.random() * colors.length)]
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
        <meshStandardMaterial color="#27ae60" />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

// Pre-generate positions and scales to avoid randomness on re-render
const TREES: { pos: [number, number, number]; scale: number }[] = [
  { pos: [-15, 0, -15], scale: 1.0 },
  { pos: [-20, 0, -8], scale: 0.9 },
  { pos: [-25, 0, 5], scale: 1.1 },
  { pos: [-18, 0, 12], scale: 0.85 },
  { pos: [-22, 0, 20], scale: 1.2 },
  { pos: [15, 0, -18], scale: 0.95 },
  { pos: [22, 0, -5], scale: 1.0 },
  { pos: [18, 0, 8], scale: 1.15 },
  { pos: [25, 0, 15], scale: 0.9 },
  { pos: [20, 0, -20], scale: 1.0 },
  { pos: [-12, 0, 25], scale: 0.85 },
  { pos: [12, 0, 25], scale: 1.1 },
  { pos: [-30, 0, -25], scale: 1.0 },
  { pos: [30, 0, -25], scale: 0.95 },
  { pos: [-8, 0, -30], scale: 1.05 },
  { pos: [8, 0, 30], scale: 0.9 },
  { pos: [-28, 0, 18], scale: 1.1 },
  { pos: [28, 0, -12], scale: 1.0 },
  { pos: [-35, 0, 0], scale: 0.85 },
  { pos: [35, 0, 0], scale: 1.15 },
]

const ROCKS: { pos: [number, number, number]; scale: number }[] = [
  { pos: [-10, 0, -10], scale: 0.8 },
  { pos: [12, 0, -14], scale: 1.2 },
  { pos: [-14, 0, 18], scale: 0.6 },
  { pos: [20, 0, 10], scale: 1.0 },
  { pos: [-8, 0, -22], scale: 0.7 },
  { pos: [25, 0, -18], scale: 0.9 },
  { pos: [-20, 0, -18], scale: 1.1 },
  { pos: [5, 0, 28], scale: 0.8 },
]

// Export obstacle data for collision detection
// Each obstacle has position and radius
export const OBSTACLES: { x: number; z: number; radius: number }[] = [
  // Trees (trunk radius ~0.2 * scale, use 0.8 for some buffer)
  ...TREES.map(t => ({ x: t.pos[0], z: t.pos[2], radius: 0.8 * t.scale })),
  // Rocks (radius ~0.5 * scale)
  ...ROCKS.map(r => ({ x: r.pos[0], z: r.pos[2], radius: 0.6 * r.scale })),
  // Crafting station (at [-6, 0, 5], table is 2x1.2)
  { x: -6, z: 5, radius: 1.0 },
  // Water source - smaller radius so player can reach the fountain
  { x: 6, z: 5, radius: 1.0 },
]

const FLOWERS: [number, number, number][] = [
  [-5, 0, -5], [-3, 0, 8], [7, 0, -12], [4, 0, 15], [-6, 0, 20],
  [10, 0, 5], [-12, 0, -3], [8, 0, -8], [-2, 0, 12], [15, 0, -7],
  [-18, 0, 3], [3, 0, -18], [-7, 0, -15], [18, 0, 3], [-3, 0, -25],
]

export default function Environment() {
  return (
    <>
      {TREES.map((t, i) => (
        <Tree key={`tree-${i}`} position={t.pos} scale={t.scale} />
      ))}
      {ROCKS.map((r, i) => (
        <Rock key={`rock-${i}`} position={r.pos} scale={r.scale} />
      ))}
      {FLOWERS.map((pos, i) => (
        <Flower key={`flower-${i}`} position={pos} />
      ))}
    </>
  )
}
