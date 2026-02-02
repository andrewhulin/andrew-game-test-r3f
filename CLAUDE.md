# CLAUDE.md

## Project Overview

Interactive 3D snow diorama built with React Three Fiber. An isometric terrain block with a log cabin on a snowy hill, pine trees, rocks, and falling snow — viewable as a rotating turntable.

- **Repository:** andrew-game-test-r3f
- **Primary Branch:** main

## Tech Stack

- **React 19** + **TypeScript**
- **React Three Fiber** (R3F) — React renderer for Three.js
- **@react-three/drei** — Helpers (OrbitControls, useGLTF, etc.)
- **@react-three/postprocessing** — Bloom, vignette, grain, DOF, SMAA
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

Kenney Assets/                  # Source asset packs (zipped + extracted)
```

## Architecture

### Diorama Base
Custom `BufferGeometry` with gaussian hill displacement on top surface. Multi-material: snow top, stone/earth sides, dark bottom. The `getHillHeight(x, z)` function in `constants.ts` computes terrain elevation at any point.

### Scene Props
Each prop auto-adjusts its Y position using `getHillHeight()` to sit correctly on the terrain surface.

### Lighting
- Cool blue ambient + hemisphere light for winter atmosphere
- Warm orange point lights from cabin/lanterns with subtle sine-wave flickering
- Directional shadow-casting sun light

### Post-Processing Pipeline
Bloom → DepthOfField (tilt-shift miniature effect) → Noise (film grain) → Vignette → SMAA

### Future: Journal Puzzle Pieces
The `DioramaBase` is designed to accept different shapes and height maps. Future work: irregular puzzle-edge dioramas that magnetically snap together, each generated from a journal entry.

## Assets

All 3D models from [Kenney.nl](https://kenney.nl/) (CC0 license). Using GLB format for web performance. Holiday kit provides: cabin modules, snow trees, terrain, rocks, decorations. Nature kit provides cliff/terrain blocks for future use.

## Code Conventions

- Functional React components with TypeScript
- R3F declarative scene graph (JSX for Three.js objects)
- `useGLTF` for model loading with `.preload()` for eager loading
- `useFrame` for per-frame animations
- `useMemo` for expensive geometry computations
- Constants centralized in `utils/constants.ts`
