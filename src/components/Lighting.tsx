import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '../utils/constants'

export function Lighting() {
  const cabinLightRef = useRef<THREE.PointLight>(null)
  const lanternRef = useRef<THREE.PointLight>(null)

  // Subtle flickering for warm lights
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const flickerCabin = 1 + Math.sin(t * 2.1) * 0.05 + Math.sin(t * 5.5 + 0.5) * 0.02
    const flickerLantern = 1 + Math.sin(t * 3.2) * 0.06 + Math.sin(t * 7.1) * 0.03

    if (cabinLightRef.current) cabinLightRef.current.intensity = 0.8 * flickerCabin
    if (lanternRef.current) lanternRef.current.intensity = 0.5 * flickerLantern
  })

  return (
    <>
      {/* Cool blue winter ambient - gentle fill */}
      <ambientLight intensity={0.4} color={COLORS.ambientLight} />

      {/* Hemisphere: cool sky + warm ground bounce */}
      <hemisphereLight
        color={COLORS.skyColor}
        groundColor={COLORS.groundColor}
        intensity={0.5}
      />

      {/* Main sun/overcast directional light */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
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
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Softer fill light from opposite side */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.3}
        color="#aabbdd"
      />

      {/* Warm cabin window glow - REDUCED intensity */}
      <pointLight
        ref={cabinLightRef}
        position={[0, 0.8, -0.6]}
        intensity={0.8}
        color={COLORS.warmGlow}
        distance={4}
        decay={2}
      />

      {/* Lantern warm light */}
      <pointLight
        ref={lanternRef}
        position={[-0.8, 0.6, -0.3]}
        intensity={0.5}
        color={COLORS.lanternGlow}
        distance={3}
        decay={2}
      />

      {/* Environment map for IBL reflections - subtle outdoor lighting */}
      <Environment preset="dawn" background={false} environmentIntensity={0.3} />

      {/* Contact shadows for grounding objects */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={4}
        color="#2a3040"
      />
    </>
  )
}
