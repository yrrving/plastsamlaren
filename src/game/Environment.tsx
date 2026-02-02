function Tree({ position }: { position: [number, number, number] }) {
  const scale = 0.8 + Math.random() * 0.6
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

// Pre-generate positions to avoid randomness on re-render
const TREES: [number, number, number][] = [
  [-15, 0, -15], [-20, 0, -8], [-25, 0, 5], [-18, 0, 12], [-22, 0, 20],
  [15, 0, -18], [22, 0, -5], [18, 0, 8], [25, 0, 15], [20, 0, -20],
  [-12, 0, 25], [12, 0, 25], [-30, 0, -25], [30, 0, -25], [-8, 0, -30],
  [8, 0, 30], [-28, 0, 18], [28, 0, -12], [-35, 0, 0], [35, 0, 0],
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

const FLOWERS: [number, number, number][] = [
  [-5, 0, -5], [-3, 0, 8], [7, 0, -12], [4, 0, 15], [-6, 0, 20],
  [10, 0, 5], [-12, 0, -3], [8, 0, -8], [-2, 0, 12], [15, 0, -7],
  [-18, 0, 3], [3, 0, -18], [-7, 0, -15], [18, 0, 3], [-3, 0, -25],
]

export default function Environment() {
  return (
    <>
      {TREES.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
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
