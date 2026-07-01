// Pre-generated positions and scales to avoid randomness on re-render
export const TREES: { pos: [number, number, number]; scale: number }[] = [
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

export const ROCKS: { pos: [number, number, number]; scale: number }[] = [
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
