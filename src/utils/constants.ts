export const MODELS_PATH = '/models/holiday'

export const DIORAMA = {
  width: 6,
  depth: 6,
  height: 2,
  hillHeight: 0.4,
  hillCenterX: 0,
  hillCenterZ: 0,
  hillSigma: 2.2,
}

export const COLORS = {
  snowTop: '#f0f4f8',
  stoneSide: '#9a9088',
  stoneBottom: '#5a504a',
  ambientLight: '#b4c6e7',
  sunLight: '#fff5e6',
  warmGlow: '#ff9944',
  lanternGlow: '#ffaa55',
  skyColor: '#c4d4f0',
  groundColor: '#444035',
  background: '#c8d5e2',
  fog: '#d4dce6',
}

/** Compute hill height at a given (x, z) position on the diorama surface */
export function getHillHeight(x: number, z: number): number {
  const dx = x - DIORAMA.hillCenterX
  const dz = z - DIORAMA.hillCenterZ
  const distSq = dx * dx + dz * dz
  return DIORAMA.hillHeight * Math.exp(-distSq / (2 * DIORAMA.hillSigma * DIORAMA.hillSigma))
}
