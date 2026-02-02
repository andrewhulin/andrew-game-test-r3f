import { useGLTF, Clone } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'
import { MODELS_PATH, getHillHeight } from '../utils/constants'

/** Load a GLB and enable shadows on all child meshes */
function useShadowModel(path: string) {
  const gltf = useGLTF(path)
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [gltf])
  return gltf
}

function Model({ path, position, rotation, scale }: {
  path: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}) {
  const gltf = useShadowModel(path)
  return (
    <Clone
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

export function Cabin() {
  const cabinX = 0
  const cabinZ = -1.2
  const cabinY = getHillHeight(cabinX, cabinZ)
  const P = MODELS_PATH

  // Kenney cabin pieces: walls are 1-unit wide, 1-unit tall, sit at Y=0.
  // Walls are ~0.3 thick, centered around their local Z~0.5.
  // For a 2x2 footprint cabin, we place 2 wall segments per side.
  // Walls go along X at Z boundaries, and along Z at X boundaries.
  //
  // Layout (top-down, looking at -Z):
  //   Back wall:  Z = -1, facing +Z, two segments at X=-0.5 and X=+0.5
  //   Front wall: Z = 0, facing -Z (rotated PI), two segments
  //   Left wall:  X = -1, facing +X (rotated -PI/2), two segments along Z
  //   Right wall: X = +1, facing -X (rotated +PI/2), two segments along Z

  return (
    <group position={[cabinX, cabinY, cabinZ]}>
      {/* === Back wall (Z = -1, faces +Z, default orientation) === */}
      <Model path={`${P}/cabin-window-large.glb`} position={[-0.5, 0, -1]} />
      <Model path={`${P}/cabin-wall.glb`} position={[0.5, 0, -1]} />

      {/* === Front wall (Z = 0, faces -Z, rotated PI around Y) === */}
      <Model path={`${P}/cabin-doorway.glb`} position={[0.5, 0, 0]} rotation={[0, Math.PI, 0]} />
      <Model path={`${P}/cabin-window-a.glb`} position={[-0.5, 0, 0]} rotation={[0, Math.PI, 0]} />

      {/* === Left wall (X = -1, rotated +PI/2) === */}
      <Model path={`${P}/cabin-wall.glb`} position={[-1, 0, -0.5]} rotation={[0, Math.PI / 2, 0]} />
      <Model path={`${P}/cabin-wall.glb`} position={[-1, 0, 0.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* === Right wall (X = 1, rotated -PI/2) === */}
      <Model path={`${P}/cabin-wall.glb`} position={[1, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]} />
      <Model path={`${P}/cabin-wall.glb`} position={[1, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* === Roof - using point roof for a peaked cabin look === */}
      <Model path={`${P}/cabin-roof-snow-point.glb`} position={[0, 1, 0]} />

      {/* === Floor === */}
      <Model path={`${P}/floor-wood-snow.glb`} position={[0, 0, 1.2]} />

      {/* === Lantern at doorway === */}
      <Model path={`${P}/lantern.glb`} position={[0.6, 0, 0.5]} />
    </group>
  )
}

// Preload
const models = [
  'cabin-doorway', 'cabin-window-large', 'cabin-window-a', 'cabin-wall',
  'cabin-roof-snow-point', 'floor-wood-snow', 'lantern',
]
models.forEach((n) => useGLTF.preload(`${MODELS_PATH}/${n}.glb`))
