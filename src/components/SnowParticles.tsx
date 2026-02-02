import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DIORAMA } from '../utils/constants'

const SNOW_COUNT = 600
const SMOKE_COUNT = 25

export function SnowParticles() {
  return (
    <>
      <FallingSnow />
      <ChimneySmoke />
    </>
  )
}

function FallingSnow() {
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
      // Fall down
      posAttr.array[idx + 1] -= velocities[i]
      // Gentle drift
      posAttr.array[idx] += Math.sin(t * 0.5 + offsets[i]) * 0.002
      posAttr.array[idx + 2] += Math.cos(t * 0.35 + offsets[i]) * 0.002

      // Reset when below ground
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

function ChimneySmoke() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, velocities, lifetimes, maxLifetimes } = useMemo(() => {
    const pos = new Float32Array(SMOKE_COUNT * 3)
    const vel = new Float32Array(SMOKE_COUNT * 3)
    const life = new Float32Array(SMOKE_COUNT)
    const maxLife = new Float32Array(SMOKE_COUNT)

    for (let i = 0; i < SMOKE_COUNT; i++) {
      resetSmokeParticle(pos, vel, life, maxLife, i)
    }
    return { positions: pos, velocities: vel, lifetimes: life, maxLifetimes: maxLife }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const dt = state.clock.getDelta()
    const t = state.clock.elapsedTime

    for (let i = 0; i < SMOKE_COUNT; i++) {
      lifetimes[i] += dt

      if (lifetimes[i] > maxLifetimes[i]) {
        resetSmokeParticle(posAttr.array as Float32Array, velocities, lifetimes, maxLifetimes, i)
        continue
      }

      const idx = i * 3
      posAttr.array[idx] += velocities[idx] + Math.sin(t * 2 + i) * 0.001
      posAttr.array[idx + 1] += velocities[idx + 1]
      posAttr.array[idx + 2] += velocities[idx + 2] + Math.cos(t * 1.5 + i) * 0.001
    }
    posAttr.needsUpdate = true
  })

  // Chimney position (above cabin roof)
  return (
    <points ref={pointsRef} geometry={geometry} position={[0.25, 2.5, -1.2]}>
      <pointsMaterial
        size={0.06}
        color="#cccccc"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function resetSmokeParticle(
  pos: Float32Array,
  vel: Float32Array,
  life: Float32Array,
  maxLife: Float32Array,
  i: number
) {
  const idx = i * 3
  pos[idx] = (Math.random() - 0.5) * 0.1
  pos[idx + 1] = 0
  pos[idx + 2] = (Math.random() - 0.5) * 0.1
  vel[idx] = (Math.random() - 0.5) * 0.002
  vel[idx + 1] = 0.008 + Math.random() * 0.006
  vel[idx + 2] = (Math.random() - 0.5) * 0.002
  life[i] = Math.random() * 2 // stagger start times
  maxLife[i] = 2 + Math.random() * 2
}
