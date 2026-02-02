# CLAUDE.md

## Project Overview

Interactive 3D snow diorama built with React Three Fiber. An isometric terrain block with a log cabin on a snowy hill, pine trees, rocks, and falling snow — viewable as a rotating turntable.

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
│   ├── Cabin.tsx               # Modular log cabin from Kenney pieces
│   ├── SceneProps.tsx          # Trees, rocks, snowman, sled, bench, etc.
│   ├── SnowParticles.tsx       # Falling snow + chimney smoke particles
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

### Lighting
- Cool blue ambient + hemisphere light for winter atmosphere
- Warm orange point lights from cabin/lanterns with subtle sine-wave flickering
- Directional shadow-casting sun light
- Environment map (IBL) from drei for subtle reflections
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
