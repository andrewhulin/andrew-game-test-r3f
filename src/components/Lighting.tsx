import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export function Lighting() {
  const lanternRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const flicker = 1 + Math.sin(t * 2.1) * 0.06 + Math.sin(t * 5.5 + 0.5) * 0.03
    if (lanternRef.current) lanternRef.current.intensity = 3.0 * flicker
  })

  return (
    <>
      {/* Low ambient — let key light create drama */}
      <ambientLight intensity={0.15} color="#8aa4cc" />
      <hemisphereLight color="#9ab4d4" groundColor="#544535" intensity={0.2} />

      {/* KEY LIGHT: warm overcast sun */}
      <directionalLight
        position={[4, 8, 3]}
        intensity={1.0}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />

      {/* FILL LIGHT: cool from opposite side */}
      <directionalLight position={[-3, 4, -2]} intensity={0.15} color="#8899bb" />

      {/* RIM/BACK LIGHT: depth separation */}
      <directionalLight position={[-2, 6, -5]} intensity={0.25} color="#aabbdd" />

      {/* HERO: Warm lantern glow — strong pool of light */}
      <pointLight
        ref={lanternRef}
        position={[0.8, 1.4, -0.3]}
        intensity={3.0}
        color="#ffaa55"
        distance={6}
        decay={2}
      />

      {/* IBL via preset — Lightformers caused rendering artifacts */}
      <Environment preset="dawn" background={false} environmentIntensity={0.15} />

      {/* Ground shadows — sized to match diorama */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.6}
        scale={7}
        blur={2}
        far={4}
        resolution={512}
        color="#1a2030"
      />
    </>
  )
}
