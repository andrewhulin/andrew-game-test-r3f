import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  DepthOfField,
  SMAA,
  N8AO,
  BrightnessContrast,
  HueSaturation,
} from '@react-three/postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer>
      {/* Ambient occlusion — depth and grounding */}
      <N8AO aoRadius={0.5} intensity={1.5} distanceFalloff={0.5} quality="medium" />

      {/* Bloom — catches the emissive lantern glow orb */}
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Tilt-shift DOF — miniature diorama feel */}
      <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3.5} />

      {/* Subtle color grading */}
      <BrightnessContrast brightness={0} contrast={0.08} />
      <HueSaturation hue={0} saturation={0.05} />

      {/* Film grain */}
      <Noise opacity={0.04} />

      {/* Vignette framing */}
      <Vignette offset={0.3} darkness={0.55} />

      {/* Anti-aliasing */}
      <SMAA />
    </EffectComposer>
  )
}
