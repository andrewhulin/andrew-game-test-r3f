# CLAUDE.md

## Project Overview

Interactive 3D snow diorama built with React Three Fiber. An isometric terrain block with a bench and lightpost on a gentle snowy hill, surrounded by pine trees, rocks, and falling snow — viewable as a rotating turntable. Cinematic lighting with warm lantern glow vs cold winter atmosphere.

- **Repository:** andrew-game-test-r3f
- **Primary Branch:** main

## Tech Stack

- **React 19** + **TypeScript**
- **React Three Fiber** (R3F) — React renderer for Three.js
- **@react-three/drei** — Helpers (OrbitControls, useGLTF, Clone, Environment, ContactShadows, etc.)
- **@react-three/postprocessing** — Bloom, vignette, grain, DOF, N8AO, SMAA
- **Three.js** — 3D engine
- **Vite** — Build tool

## Commands

- `npm install` — Install dependencies
- `npm run dev` — Start development server
- `npm run build` — TypeScript check + production build
- `npm run preview` — Preview production build

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Canvas + renderer config
├── index.css                   # Fullscreen canvas styles
├── components/
│   ├── Scene.tsx               # Scene orchestrator
│   ├── DioramaBase.tsx         # Terrain block (snow top + stone sides + hill)
│   ├── SceneProps.tsx          # Bench, lantern, trees, rocks, snow piles
│   ├── SnowParticles.tsx       # Falling snow particle system
│   ├── Lighting.tsx            # Ambient, directional, point lights w/ flicker
│   ├── PostProcessing.tsx      # Bloom, vignette, grain, DOF, SMAA
│   ├── Controls.tsx            # OrbitControls turntable
│   └── Environment.tsx         # Background color + fog
└── utils/
    └── constants.ts            # Dimensions, colors, hill height function

public/
├── models/holiday/             # Kenney holiday kit GLB models
└── audio/                      # Snow footstep audio

Skills/                         # Claude skill references (R3F, Three.js, design)
Kenney Assets/                  # Source asset packs (zipped + extracted)
```

## Architecture

### Diorama Base
Custom `BufferGeometry` with gaussian hill displacement on top surface. Multi-material: snow top, stone/earth sides, dark bottom. The `getHillHeight(x, z)` function in `constants.ts` computes terrain elevation at any point.

### Scene Props
Each prop auto-adjusts its Y position using `getHillHeight()` to sit correctly on the terrain surface. Uses `<Clone>` from drei for proper model instancing with preserved textures.

### Lighting (Cinematic warm/cold contrast)
- Cool blue ambient + hemisphere light for cold winter atmosphere
- Warm orange point light from lantern (hero light) with subtle sine-wave flickering
- Directional shadow-casting sun light (warm white, moderate intensity)
- Cool fill light from opposite direction
- Environment map (IBL) from drei preset "dawn" for subtle reflections
- ContactShadows for soft ground shadows

### Post-Processing Pipeline
Bloom → N8AO → DepthOfField (tilt-shift miniature effect) → Noise (film grain) → Vignette → SMAA

### Future: Journal Puzzle Pieces
The `DioramaBase` is designed to accept different shapes and height maps. Future work: irregular puzzle-edge dioramas that magnetically snap together, each generated from a journal entry.

## Assets

All 3D models from [Kenney.nl](https://kenney.nl/) (CC0 license). Using GLB format for web performance. Holiday kit provides: cabin modules, snow trees, terrain, rocks, decorations. Nature kit provides cliff/terrain blocks for future use.

## Skills Reference

The `Skills/` folder contains skill guides for Claude that teach best practices:

### R3F Skills (`Skills/r3f-skills-main/`)
- **r3f-fundamentals** — Canvas setup, useFrame, useThree, JSX elements
- **r3f-lighting** — Light types, shadows, Environment/Sky/ContactShadows from drei
- **r3f-materials** — Material types, PBR, MeshPhysicalMaterial, shared materials
- **r3f-postprocessing** — EffectComposer, Bloom, DOF, N8AO, selective bloom, color grading
- **r3f-loaders** — useGLTF, Clone component, Suspense patterns, preloading
- **r3f-animation** — useFrame, spring animations, procedural animation, Float/Trail
- **r3f-geometry** — Custom BufferGeometry, instancing, Points particle systems
- **r3f-shaders** — shaderMaterial, uniforms, Fresnel, noise, vertex displacement
- **r3f-textures** — useTexture, environment maps, render targets

### Three.js Skills (`Skills/threejs-skills-main/`)
- Lighting, materials, post-processing, shaders, loaders, textures (raw Three.js API)

### Design Skills
- **advanced-frontend-skill** — Premium frontend design: "alive" interfaces, color architecture, motion throttle, WebGL patterns, anti-patterns to avoid
- **web-design-guidelines** — Web Interface Guidelines compliance checker

### React Skills (`Skills/agent-skills-main/`)
- **react-best-practices** — Performance, rendering, re-render prevention, async patterns
- **composition-patterns** — Component architecture, compound components, state management

## Code Conventions

- Functional React components with TypeScript
- R3F declarative scene graph (JSX for Three.js objects)
- `useGLTF` for model loading with `.preload()` for eager loading
- `<Clone>` from drei for proper model instancing (preserves textures/materials)
- Traverse loaded scenes to enable `castShadow`/`receiveShadow` on child meshes
- `useFrame` for per-frame animations (delta-time based)
- `useMemo` for expensive geometry computations
- Constants centralized in `utils/constants.ts`

## Iteration Log

### Iteration 1 — Initial Build (Problems Identified)

**What went wrong:**
1. **Cabin assembly broken** — Modular Kenney pieces were placed at guessed positions without knowing actual model dimensions/anchor points. Result: walls floating, roof at wrong angles, completely incoherent structure.
2. **No color/textures on models** — Used `scene.clone()` via `<primitive>`, which doesn't reliably preserve material textures from GLB files. Models rendered as monochrome grey. Should use `<Clone>` from drei which handles material cloning correctly.
3. **Shadow propagation missing** — Setting `castShadow`/`receiveShadow` on `<primitive>` doesn't propagate to child meshes. Need to traverse the loaded scene and set these on each mesh child.
4. **Lighting too harsh** — Cabin point light at intensity 2.5 with bloom created an overpowering orange blob. Lantern lights too concentrated. Need to reduce intensity significantly and spread lights more.
5. **Base too dark** — Stone side color `#3d3530` appears nearly black in the scene. Need to lighten to mid-grey stone.
6. **Post-processing making things worse** — DOF + bloom combination created a muddy, unfocused look. DOF focus distance was wrong. Bloom was amplifying the already-too-bright point lights.
7. **No environment lighting (IBL)** — Missing `<Environment>` from drei means no ambient reflections on materials. Scene relies entirely on direct lights, resulting in flat, lifeless appearance.
8. **No ContactShadows** — Missing soft ground shadows that give objects visual grounding.
9. **Scene too cluttered** — Props placed too close together without accounting for actual model sizes.

**Key lessons from Skills:**
- Use `<Clone>` from drei instead of `scene.clone()` for proper material/texture preservation (r3f-loaders skill)
- Add `<Environment>` for IBL reflections (r3f-lighting skill)
- Add `<ContactShadows>` for grounding (r3f-lighting skill)
- Use N8AO for ambient occlusion instead of relying on direct lighting (r3f-postprocessing skill)
- Traverse loaded scenes to set castShadow/receiveShadow on meshes (r3f-loaders skill)
- Reduce bloom intensity, ensure DOF focus is calibrated (r3f-postprocessing skill)
- Premium frontend skill: "The key is intentionality, not intensity"

### Iteration 2 — Applied Skills Fixes (Still Monochrome)

**What was fixed:** Switched to `<Clone>` from drei, added shadow traversal, reduced lighting intensity, added `<Environment>` IBL and `<ContactShadows>`, added `<N8AO>`, tuned bloom/DOF thresholds.

**What was still wrong:** All models still rendered monochrome white/lavender. The cabin assembly was still broken.

**Root cause discovered:** The `Textures/colormap.png` file was **NOT tracked in git**. All Kenney GLB files (8KB each) reference this external texture via `"uri":"Textures/colormap.png"` — they do NOT embed it. Without this single 512×512 palette PNG, every model's `baseColorFactor` of `[1,1,1,1]` renders as pure white. The lavender tint came from blue ambient/hemisphere lighting on white surfaces.

**Key technical findings:**
- Kenney holiday kit GLB files use external texture references (not embedded)
- All models share a single `colormap.png` texture via UV-mapped palette lookups
- Models are fully diffuse: `metallic=0`, `roughness=1`, no normal/occlusion maps
- The `KHR_texture_transform` extension is declared but only sets `texCoord: 0`
- Colormap contains distinct color regions: brown wood, green foliage, grey stone, orange accents, white snow

### Iteration 3 — Scene Redesign

**User direction:** Drop the cabin (modular assembly too unreliable). Use only whole/standalone models. New scene = bench in center, standing lantern (lightpost) beside it, snowy trees in a ring, cinematic lighting.

**Changes made:**
1. Committed `Textures/colormap.png` to git (root cause fix)
2. Deleted `Cabin.tsx` entirely — no modular assembly
3. Rewrote `SceneProps.tsx` — bench + lantern at center, 8 trees in inner/outer rings, rocks + snow piles as accents
4. Centered the hill at `(0,0)` instead of `(0,-1.2)`, reduced height from 0.8→0.4
5. Cinematic lighting: dimmer ambient, warm lantern as hero light source, cool fill
6. Tuned post-processing: stronger AO, bloom catching lantern glow, tilt-shift DOF
7. Removed chimney smoke from snow particles

**Design principle:** Only use whole/standalone models that don't require assembly. Keep the scene simple and focused.

### Iteration 4 — Cinematic Lighting Overhaul

**Problems identified from screenshot:**
- Scene too flat — ambient (0.25) + hemisphere (0.3) filled in all shadows, killed contrast
- Snow surface lavender-tinted from blue ambient on white surfaces
- Lantern glow barely visible — point light too weak and bloom couldn't catch it
- ContactShadows plane extended beyond diorama edges (scale=12 on 6×6 base)
- Environment "dawn" preset added too much flat fill, washing out contrast

**Key lighting skill learnings applied:**
- **Three-point lighting** (key + fill + rim/back) is the cinematic standard
- **SoftShadows** from drei enables PCF soft shadow edges
- **Lightformer** inside `<Environment>` gives precise IBL control vs presets
- **Bloom needs emissive geometry** — Kenney models have no emissive properties (metallic=0, roughness=1). Added a small `meshStandardMaterial` sphere with `emissive="#ffaa44"` + `emissiveIntensity={8}` + `toneMapped={false}` at the lantern lamp head. This is the only way for bloom to create a visible warm halo.
- **BrightnessContrast** and **HueSaturation** effects for subtle color grading

**Changes made:**
1. Reduced ambient from 0.25→0.12, hemisphere from 0.3→0.15 (less fill = more drama)
2. Three-point setup: key directional (1.0), cool fill (0.15), rim/back light (0.25)
3. Added `<SoftShadows>` for softer shadow edges
4. Doubled lantern point light intensity from 1.5→3.0 with subtle flicker
5. Replaced Environment preset with custom `<Lightformer>` rectangles (overhead cool + side fill)
6. Fixed ContactShadows: scale 12→7, resolution 256→512
7. Added emissive glow sphere at lantern lamp position for bloom
8. Lowered bloom threshold from 0.85→0.7, increased intensity 0.4→0.6
9. Added BrightnessContrast (+0.08 contrast) and HueSaturation (+0.05 saturation)
10. Increased DOF bokehScale from 3→3.5, N8AO quality to "medium"

**REGRESSION: Scene rendered as flat grey rectangles.**
- `<SoftShadows>` patches global `THREE.ShaderChunk` — conflicts with Environment cubemap pipeline
- `<Lightformer>` geometry rendered as visible scene objects instead of into cubemap only
- **Lesson**: SoftShadows and Lightformers are fragile with this drei/three.js version. Do NOT use them.
- **Fix (Iteration 5)**: Removed SoftShadows entirely, replaced Lightformers with proven `<Environment preset="dawn" environmentIntensity={0.15}>`. Kept all other improvements (three-point lighting, reduced ambient, stronger lantern, emissive glow, color grading). Slightly bumped ambient (0.12→0.15) and hemisphere (0.15→0.2) to compensate for losing Lightformer IBL fill.
