import { OrbitControls } from '@react-three/drei'

export function Controls() {
  return (
    <OrbitControls
      autoRotate
      autoRotateSpeed={0.4}
      enablePan={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.5}
      minDistance={6}
      maxDistance={14}
      enableDamping
      dampingFactor={0.05}
      target={[0, 0.3, 0]}
    />
  )
}
