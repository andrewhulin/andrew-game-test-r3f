import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '../utils/constants'

export function Lighting() {
  const lantern1Ref = useRef<THREE.PointLight>(null)
  const lantern2Ref = useRef<THREE.PointLight>(null)
  const cabinLightRef = useRef<THREE.PointLight>(null)

  // Subtle flickering for warm lights
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const flicker1 = 1 + Math.sin(t * 3.2) * 0.08 + Math.sin(t * 7.1) * 0.04
    const flicker2 = 1 + Math.sin(t * 2.8 + 1) * 0.08 + Math.sin(t * 6.3 + 2) * 0.04
    const flickerCabin = 1 + Math.sin(t * 2.1) * 0.06 + Math.sin(t * 5.5 + 0.5) * 0.03

    if (lantern1Ref.current) lantern1Ref.current.intensity = 1.5 * flicker1
    if (lantern2Ref.current) lantern2Ref.current.intensity = 1.5 * flicker2
    if (cabinLightRef.current) cabinLightRef.current.intensity = 2.5 * flickerCabin
  })

  return (
    <>
      {/* Cool blue winter ambient */}
      <ambientLight intensity={0.35} color={COLORS.ambientLight} />

      {/* Hemisphere: cool sky + warm ground bounce */}
      <hemisphereLight
        color={COLORS.skyColor}
        groundColor={COLORS.groundColor}
        intensity={0.4}
      />

      {/* Main sun/overcast directional light */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.0}
        color={COLORS.sunLight}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.001}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.2}
        color="#aabbdd"
      />

      {/* Warm cabin window glow */}
      <pointLight
        ref={cabinLightRef}
        position={[0, 1.2, -1.0]}
        intensity={2.5}
        color={COLORS.warmGlow}
        distance={4}
        decay={2}
        castShadow
      />

      {/* Lantern 1 - left side */}
      <pointLight
        ref={lantern1Ref}
        position={[-1, 0.5, -0.5]}
        intensity={1.5}
        color={COLORS.lanternGlow}
        distance={3}
        decay={2}
      />

      {/* Lantern 2 - cabin side */}
      <pointLight
        ref={lantern2Ref}
        position={[0.3, 1.3, -1.6]}
        intensity={1.5}
        color={COLORS.lanternGlow}
        distance={3}
        decay={2}
      />
    </>
  )
}
