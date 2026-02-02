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
      {/* === Center focal point === */}
      <Prop name="bench" position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]} />
      <Prop name="lantern" position={[0.8, 0, -0.3]} />

      {/* === Inner ring (close to center, slightly smaller) === */}
      <Prop name="tree-snow-c" position={[-1.0, 0, -0.8]} scale={0.8} />
      <Prop name="tree-snow-a" position={[1.2, 0, 0.8]} scale={0.7} />

      {/* === Outer ring (edge of diorama, full size, varied types) === */}
      <Prop name="tree-snow-a" position={[-2.2, 0, -1.8]} />
      <Prop name="tree-snow-b" position={[2.0, 0, -1.5]} rotation={[0, Math.PI / 4, 0]} />
      <Prop name="tree-snow-a" position={[-2.0, 0, 1.5]} rotation={[0, Math.PI / 3, 0]} />
      <Prop name="tree-snow-b" position={[1.8, 0, 1.8]} rotation={[0, -Math.PI / 6, 0]} />
      <Prop name="tree-snow-c" position={[-2.4, 0, 0.2]} rotation={[0, Math.PI / 2, 0]} />
      <Prop name="tree-snow-a" position={[2.4, 0, -0.3]} rotation={[0, Math.PI / 5, 0]} scale={0.85} />

      {/* === Ground accents === */}
      <Prop name="rocks-small" position={[1.5, -0.05, -2.0]} scale={0.5} />
      <Prop name="rocks-medium" position={[-1.8, -0.05, -2.2]} rotation={[0, Math.PI / 3, 0]} scale={0.4} />
      <Prop name="snow-pile" position={[-1.5, 0, 1.0]} />
      <Prop name="snow-pile" position={[2.0, 0, 0.5]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  )
}

const propModels = [
  'tree-snow-a', 'tree-snow-b', 'tree-snow-c',
  'bench', 'lantern',
  'rocks-small', 'rocks-medium', 'snow-pile',
]
propModels.forEach((n) => useGLTF.preload(`${MODELS_PATH}/${n}.glb`))
