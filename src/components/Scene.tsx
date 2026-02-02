import { DioramaBase } from './DioramaBase'
import { SceneProps } from './SceneProps'
import { SnowParticles } from './SnowParticles'
import { Lighting } from './Lighting'
import { PostProcessing } from './PostProcessing'
import { Controls } from './Controls'
import { SceneEnvironment } from './Environment'

export function Scene() {
  return (
    <>
      <SceneEnvironment />
      <Lighting />
      <Controls />

      <group>
        <DioramaBase />
        <SceneProps />
        <SnowParticles />
      </group>

      <PostProcessing />
    </>
  )
}
