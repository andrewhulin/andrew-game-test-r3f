import { useGLTF } from '@react-three/drei'
import { MODELS_PATH, getHillHeight } from '../utils/constants'

function Prop({ name, position, rotation, scale }: {
  name: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}) {
  const { scene } = useGLTF(`${MODELS_PATH}/${name}.glb`)

  // Adjust Y position to sit on the hill surface
  const [x, yOffset, z] = position
  const hillY = getHillHeight(x, z)

  return (
    <primitive
      object={scene.clone()}
      position={[x, hillY + yOffset, z]}
      rotation={rotation ?? [0, 0, 0]}
      scale={scale ?? 1}
      castShadow
      receiveShadow
    />
  )
}

export function SceneProps() {
  return (
    <group>
      {/* === Snow-covered pine trees === */}
      <Prop name="tree-snow-a" position={[-2, 0, -1.5]} />
      <Prop name="tree-snow-b" position={[1.8, 0, 0.5]} rotation={[0, Math.PI / 4, 0]} />
      <Prop name="tree-snow-c" position={[-1.5, 0, 1.5]} rotation={[0, Math.PI / 6, 0]} />
      <Prop name="tree-snow-a" position={[2.2, 0, -2]} rotation={[0, Math.PI / 3, 0]} />
      <Prop name="tree-snow-b" position={[-2.2, 0, -2.5]} rotation={[0, Math.PI / 2, 0]} />
      <Prop name="tree-snow-c" position={[0.8, 0, -0.3]} />
      <Prop name="tree-snow-a" position={[-0.3, 0, 2.3]} rotation={[0, Math.PI / 5, 0]} />

      {/* === Snowman === */}
      <Prop name="snowman-hat" position={[-0.5, 0, 0.5]} rotation={[0, Math.PI / 8, 0]} />

      {/* === Sled on the slope === */}
      <Prop name="sled" position={[1, 0, 0.8]} rotation={[0, -Math.PI / 6, 0]} />

      {/* === Bench === */}
      <Prop name="bench" position={[-1.8, 0, 0.3]} rotation={[0, Math.PI / 2, 0]} />

      {/* === Rocks === */}
      <Prop name="rocks-large" position={[2.5, 0, -0.5]} />
      <Prop name="rocks-medium" position={[-2.3, 0, -2.2]} rotation={[0, Math.PI / 3, 0]} />
      <Prop name="rocks-small" position={[1.5, 0, 2.2]} rotation={[0, Math.PI / 4, 0]} />
      <Prop name="rocks-small" position={[-0.8, 0, 0.2]} rotation={[0, Math.PI, 0]} />

      {/* === Lanterns === */}
      <Prop name="lantern" position={[-1, 0, -0.5]} />
      <Prop name="lantern" position={[0.3, 0, -1.6]} />

      {/* === Snow terrain features === */}
      <Prop name="snow-pile" position={[2, 0, 1.5]} />
      <Prop name="snow-pile" position={[-0.8, 0, 2]} rotation={[0, Math.PI / 2, 0]} />
      <Prop name="snow-bunker" position={[1.8, 0, -1.8]} rotation={[0, Math.PI / 4, 0]} />
      <Prop name="snow-bunker" position={[-1, 0, -2.3]} rotation={[0, Math.PI / 6, 0]} />

      {/* === Fence near cabin === */}
      <Prop name="cabin-fence" position={[0.8, 0, -0.5]} />
      <Prop name="cabin-fence" position={[-0.5, 0, -0.7]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  )
}

// Preload scene prop models
const propModels = [
  'tree-snow-a', 'tree-snow-b', 'tree-snow-c',
  'snowman-hat', 'sled', 'bench',
  'rocks-large', 'rocks-medium', 'rocks-small',
  'lantern', 'snow-pile', 'snow-bunker', 'cabin-fence',
]
propModels.forEach((name) => useGLTF.preload(`${MODELS_PATH}/${name}.glb`))
