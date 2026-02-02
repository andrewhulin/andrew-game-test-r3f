import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DIORAMA } from '../utils/constants'

const SNOW_COUNT = 600

export function SnowParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, velocities, offsets } = useMemo(() => {
    const hw = DIORAMA.width / 2 + 0.5
    const hd = DIORAMA.depth / 2 + 0.5
    const pos = new Float32Array(SNOW_COUNT * 3)
    const vel = new Float32Array(SNOW_COUNT)
    const off = new Float32Array(SNOW_COUNT)

    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * hw * 2
      pos[i * 3 + 1] = Math.random() * 5 + 1
      pos[i * 3 + 2] = (Math.random() - 0.5) * hd * 2
      vel[i] = 0.005 + Math.random() * 0.012
      off[i] = Math.random() * Math.PI * 2
    }

    return { positions: pos, velocities: vel, offsets: off }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const t = state.clock.elapsedTime

    for (let i = 0; i < SNOW_COUNT; i++) {
      const idx = i * 3
      posAttr.array[idx + 1] -= velocities[i]
      posAttr.array[idx] += Math.sin(t * 0.5 + offsets[i]) * 0.002
      posAttr.array[idx + 2] += Math.cos(t * 0.35 + offsets[i]) * 0.002

      if (posAttr.array[idx + 1] < -DIORAMA.height) {
        posAttr.array[idx + 1] = 4 + Math.random() * 2
        posAttr.array[idx] = (Math.random() - 0.5) * (DIORAMA.width + 1)
        posAttr.array[idx + 2] = (Math.random() - 0.5) * (DIORAMA.depth + 1)
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
