import { useGLTF } from '@react-three/drei'
import { MODELS_PATH, getHillHeight } from '../utils/constants'

function Model({ name, position, rotation, scale }: {
  name: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}) {
  const { scene } = useGLTF(`${MODELS_PATH}/${name}.glb`)
  return (
    <primitive
      object={scene.clone()}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
      scale={scale ?? 1}
      castShadow
      receiveShadow
    />
  )
}

export function Cabin() {
  // Position the cabin at the hill peak
  const cabinX = 0
  const cabinZ = -1.2
  const cabinY = getHillHeight(cabinX, cabinZ)

  // Kenney holiday kit cabin pieces are modular at ~1 unit intervals.
  // We assemble them relative to the cabin group origin.
  return (
    <group position={[cabinX, cabinY, cabinZ]}>
      {/* Ground floor walls */}
      {/* Front wall with doorway */}
      <Model name="cabin-doorway" position={[0, 0, 0.5]} rotation={[0, 0, 0]} />
      {/* Back wall with window */}
      <Model name="cabin-window-large" position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]} />
      {/* Left wall with window */}
      <Model name="cabin-window-a" position={[-0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      {/* Right wall plain */}
      <Model name="cabin-wall" position={[0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Corner logs */}
      <Model name="cabin-corner" position={[-0.5, 0, 0.5]} />
      <Model name="cabin-corner" position={[0.5, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]} />
      <Model name="cabin-corner" position={[-0.5, 0, -0.5]} rotation={[0, Math.PI / 2, 0]} />
      <Model name="cabin-corner" position={[0.5, 0, -0.5]} rotation={[0, Math.PI, 0]} />

      {/* Roof with snow */}
      <Model name="cabin-roof-snow" position={[-0.25, 1, 0]} />
      <Model name="cabin-roof-snow-chimney" position={[0.25, 1, 0]} />

      {/* Roof peak */}
      <Model name="cabin-roof-top" position={[0, 1, 0]} />

      {/* Front porch floor */}
      <Model name="floor-wood-snow" position={[0, 0, 1]} />

      {/* Lantern at doorway */}
      <Model name="lantern" position={[0.4, 0, 0.8]} />
    </group>
  )
}

// Preload all cabin models
const cabinModels = [
  'cabin-doorway', 'cabin-window-large', 'cabin-window-a', 'cabin-wall',
  'cabin-corner', 'cabin-roof-snow', 'cabin-roof-snow-chimney',
  'cabin-roof-top', 'floor-wood-snow', 'lantern',
]
cabinModels.forEach((name) => useGLTF.preload(`${MODELS_PATH}/${name}.glb`))
