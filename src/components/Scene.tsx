import { DioramaBase } from './DioramaBase'
import { Cabin } from './Cabin'
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

      {/* Diorama group - everything that rotates together */}
      <group>
        <DioramaBase />
        <Cabin />
        <SceneProps />
        <SnowParticles />
      </group>

      <PostProcessing />
    </>
  )
}
