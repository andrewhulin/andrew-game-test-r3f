import { useGLTF, Clone } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'
import { MODELS_PATH, getHillHeight } from '../utils/constants'

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

function Prop({ name, position, rotation, scale }: {
  name: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}) {
  const path = `${MODELS_PATH}/${name}.glb`
  const gltf = useShadowModel(path)

  // Adjust Y position to sit on the hill surface
  const [x, yOffset, z] = position
  const hillY = getHillHeight(x, z)

  return (
    <Clone
      object={gltf.scene}
      position={[x, hillY + yOffset, z]}
      rotation={rotation}
      scale={scale}
    />
  )
}

export function SceneProps() {
  return (
    <group>
      {/* === Snow-covered pine trees (spread out, varied sizes) === */}
      {/* Trees are ~1.2 wide, ~1.9 tall. Need 1.5+ unit spacing */}
      <Prop name="tree-snow-a" position={[-2.2, 0, -1.8]} />
      <Prop name="tree-snow-b" position={[2.0, 0, 0.8]} rotation={[0, Math.PI / 4, 0]} />
      <Prop name="tree-snow-c" position={[-1.8, 0, 1.8]} rotation={[0, Math.PI / 6, 0]} />
      <Prop name="tree-snow-a" position={[2.4, 0, -2.0]} rotation={[0, Math.PI / 3, 0]} scale={0.8} />
      <Prop name="tree-snow-b" position={[-2.5, 0, -0.2]} rotation={[0, Math.PI / 2, 0]} />
      <Prop name="tree-snow-c" position={[0.5, 0, 2.4]} scale={0.9} />
      <Prop name="tree-snow-a" position={[-0.5, 0, 2.6]} rotation={[0, Math.PI / 5, 0]} scale={0.7} />

      {/* === Snowman (on the slope, away from cabin) === */}
      <Prop name="snowman-hat" position={[-1.0, 0, 0.8]} rotation={[0, Math.PI / 3, 0]} scale={0.7} />

      {/* === Sled on the slope === */}
      <Prop name="sled" position={[1.3, 0, 1.2]} rotation={[0, -Math.PI / 5, 0]} />

      {/* === Bench (away from cabin, left side) === */}
      <Prop name="bench" position={[-1.6, 0, -0.6]} rotation={[0, Math.PI / 3, 0]} />

      {/* === Rocks at edges (rocks-large is 3.14 wide - use small scale!) === */}
      <Prop name="rocks-large" position={[2.5, -0.1, -0.8]} scale={0.35} />
      <Prop name="rocks-medium" position={[-2.0, -0.05, -2.4]} rotation={[0, Math.PI / 3, 0]} scale={0.5} />
      <Prop name="rocks-small" position={[1.8, -0.05, 2.3]} rotation={[0, Math.PI / 4, 0]} scale={0.6} />
      <Prop name="rocks-small" position={[-0.6, 0, 0.0]} rotation={[0, Math.PI, 0]} scale={0.4} />

      {/* === Lantern (pathway light) === */}
      <Prop name="lantern" position={[-0.8, 0, -0.3]} scale={0.6} />

      {/* === Snow terrain features === */}
      <Prop name="snow-pile" position={[2.2, 0, 1.8]} />
      <Prop name="snow-pile" position={[-1.2, 0, 2.2]} rotation={[0, Math.PI / 2, 0]} />
      <Prop name="snow-bunker" position={[1.5, 0, -2.2]} rotation={[0, Math.PI / 4, 0]} scale={0.8} />
      <Prop name="snow-bunker" position={[-1.5, 0, -2.5]} rotation={[0, Math.PI / 6, 0]} scale={0.7} />

      {/* === Fence near cabin === */}
      <Prop name="cabin-fence" position={[1.2, 0, -0.2]} rotation={[0, Math.PI / 4, 0]} />
    </group>
  )
}

// Preload
const propModels = [
  'tree-snow-a', 'tree-snow-b', 'tree-snow-c',
  'snowman-hat', 'sled', 'bench',
  'rocks-large', 'rocks-medium', 'rocks-small',
  'lantern', 'snow-pile', 'snow-bunker', 'cabin-fence',
]
propModels.forEach((n) => useGLTF.preload(`${MODELS_PATH}/${n}.glb`))
