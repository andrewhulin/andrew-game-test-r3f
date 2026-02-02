import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  DepthOfField,
  SMAA,
} from '@react-three/postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer>
      {/* Bloom for warm light glow */}
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Tilt-shift depth of field for miniature/diorama feel */}
      <DepthOfField
        focusDistance={0.012}
        focalLength={0.04}
        bokehScale={2.5}
      />

      {/* Film grain for handcrafted feel */}
      <Noise opacity={0.05} />

      {/* Vignette for focus framing */}
      <Vignette offset={0.3} darkness={0.5} />

      {/* Anti-aliasing */}
      <SMAA />
    </EffectComposer>
  )
}
