import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  DepthOfField,
  SMAA,
  N8AO,
} from '@react-three/postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer>
      <N8AO aoRadius={0.5} intensity={1.5} distanceFalloff={0.5} />
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3} />
      <Noise opacity={0.05} />
      <Vignette offset={0.3} darkness={0.5} />
      <SMAA />
    </EffectComposer>
  )
}
