import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export function Lighting() {
  const lanternRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const flicker = 1 + Math.sin(t * 2.1) * 0.04 + Math.sin(t * 5.5 + 0.5) * 0.02
    if (lanternRef.current) lanternRef.current.intensity = 1.5 * flicker
  })

  return (
    <>
      {/* Cool blue winter ambient — dim for drama */}
      <ambientLight intensity={0.25} color="#8aa4cc" />

      {/* Sky-to-ground gradient */}
      <hemisphereLight color="#9ab4d4" groundColor="#544535" intensity={0.3} />

      {/* Main directional sun */}
      <directionalLight
        position={[4, 8, 3]}
        intensity={0.8}
        color="#fff5e6"
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

      {/* Cool fill from opposite side */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.15}
        color="#8899bb"
      />

      {/* HERO: Warm lantern glow — the cinematic focal light */}
      <pointLight
        ref={lanternRef}
        position={[0.8, 1.2, -0.3]}
        intensity={1.5}
        color="#ffaa55"
        distance={5}
        decay={2}
      />

      {/* Subtle IBL for ambient reflections */}
      <Environment preset="dawn" background={false} environmentIntensity={0.2} />

      {/* Soft ground shadows */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={12}
        blur={2.5}
        far={4}
        color="#2a3040"
      />
    </>
  )
}
