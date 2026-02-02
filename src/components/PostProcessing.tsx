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
      {/* Ambient occlusion for depth and grounding */}
      <N8AO
        aoRadius={0.5}
        intensity={1.0}
        distanceFalloff={0.5}
      />

      {/* Bloom - subtle, only catches bright highlights */}
      <Bloom
        intensity={0.25}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Tilt-shift depth of field for miniature/diorama feel */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.06}
        bokehScale={2}
      />

      {/* Film grain for handcrafted feel - very subtle */}
      <Noise opacity={0.04} />

      {/* Vignette for framing */}
      <Vignette offset={0.3} darkness={0.4} />

      {/* Anti-aliasing */}
      <SMAA />
    </EffectComposer>
  )
}
