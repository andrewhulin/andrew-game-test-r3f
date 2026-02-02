import { useMemo } from 'react'
import * as THREE from 'three'
import { DIORAMA, COLORS, getHillHeight } from '../utils/constants'

export function DioramaBase() {
  const { topGeometry, sidesGeometry, bottomGeometry } = useMemo(() => {
    const w = DIORAMA.width / 2
    const d = DIORAMA.depth / 2
    const h = DIORAMA.height

    // --- Top surface with hill displacement ---
    const segments = 48
    const topGeo = new THREE.PlaneGeometry(DIORAMA.width, DIORAMA.depth, segments, segments)
    topGeo.rotateX(-Math.PI / 2)
    const topPos = topGeo.attributes.position
    for (let i = 0; i < topPos.count; i++) {
      const x = topPos.getX(i)
      const z = topPos.getZ(i)
      topPos.setY(i, getHillHeight(x, z))
    }
    topGeo.computeVertexNormals()

    // --- Side walls (4 sides, each a strip that follows the top edge) ---
    const sideParts: THREE.BufferGeometry[] = []
    const edgeSegments = segments

    // Helper: create a side wall strip
    function createSide(
      getEdgePoint: (t: number) => [number, number, number],
      normal: [number, number, number]
    ) {
      const verts: number[] = []
      const norms: number[] = []
      const uvs: number[] = []
      const indices: number[] = []

      for (let i = 0; i <= edgeSegments; i++) {
        const t = i / edgeSegments
        const [ex, ey, ez] = getEdgePoint(t)

        // Top vertex (follows terrain)
        verts.push(ex, ey, ez)
        norms.push(...normal)
        uvs.push(t, 1)

        // Bottom vertex
        verts.push(ex, -h, ez)
        norms.push(...normal)
        uvs.push(t, 0)

        if (i < edgeSegments) {
          const base = i * 2
          indices.push(base, base + 1, base + 2)
          indices.push(base + 1, base + 3, base + 2)
        }
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3))
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
      geo.setIndex(indices)
      return geo
    }

    // Front side (z = +d)
    sideParts.push(
      createSide(
        (t) => {
          const x = -w + t * DIORAMA.width
          return [x, getHillHeight(x, d), d]
        },
        [0, 0, 1]
      )
    )

    // Back side (z = -d)
    sideParts.push(
      createSide(
        (t) => {
          const x = w - t * DIORAMA.width
          return [x, getHillHeight(x, -d), -d]
        },
        [0, 0, -1]
      )
    )

    // Right side (x = +w)
    sideParts.push(
      createSide(
        (t) => {
          const z = d - t * DIORAMA.depth
          return [w, getHillHeight(w, z), z]
        },
        [1, 0, 0]
      )
    )

    // Left side (x = -w)
    sideParts.push(
      createSide(
        (t) => {
          const z = -d + t * DIORAMA.depth
          return [-w, getHillHeight(-w, z), z]
        },
        [-1, 0, 0]
      )
    )

    // Merge side geometries
    const mergedSides = mergeGeometries(sideParts)

    // --- Bottom face ---
    const bottomGeo = new THREE.PlaneGeometry(DIORAMA.width, DIORAMA.depth)
    bottomGeo.rotateX(Math.PI / 2)
    bottomGeo.translate(0, -h, 0)

    return {
      topGeometry: topGeo,
      sidesGeometry: mergedSides,
      bottomGeometry: bottomGeo,
    }
  }, [])

  return (
    <group>
      {/* Snow-covered top surface */}
      <mesh geometry={topGeometry} receiveShadow>
        <meshStandardMaterial
          color={COLORS.snowTop}
          roughness={0.75}
          metalness={0.0}
        />
      </mesh>

      {/* Stone/earth sides */}
      <mesh geometry={sidesGeometry} receiveShadow>
        <meshStandardMaterial
          color={COLORS.stoneSide}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Dark bottom */}
      <mesh geometry={bottomGeometry}>
        <meshStandardMaterial
          color={COLORS.stoneBottom}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

/** Simple geometry merge for same-attribute geometries */
function mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let totalVerts = 0
  let totalIndices = 0
  for (const g of geometries) {
    totalVerts += g.attributes.position.count
    totalIndices += g.index ? g.index.count : 0
  }

  const positions = new Float32Array(totalVerts * 3)
  const normals = new Float32Array(totalVerts * 3)
  const uvs = new Float32Array(totalVerts * 2)
  const indices = new Uint32Array(totalIndices)

  let vertOffset = 0
  let idxOffset = 0
  let vertCount = 0

  for (const g of geometries) {
    const pos = g.attributes.position as THREE.BufferAttribute
    const norm = g.attributes.normal as THREE.BufferAttribute
    const uv = g.attributes.uv as THREE.BufferAttribute

    for (let i = 0; i < pos.count; i++) {
      positions[(vertOffset + i) * 3] = pos.getX(i)
      positions[(vertOffset + i) * 3 + 1] = pos.getY(i)
      positions[(vertOffset + i) * 3 + 2] = pos.getZ(i)
      normals[(vertOffset + i) * 3] = norm.getX(i)
      normals[(vertOffset + i) * 3 + 1] = norm.getY(i)
      normals[(vertOffset + i) * 3 + 2] = norm.getZ(i)
      if (uv) {
        uvs[(vertOffset + i) * 2] = uv.getX(i)
        uvs[(vertOffset + i) * 2 + 1] = uv.getY(i)
      }
    }

    if (g.index) {
      for (let i = 0; i < g.index.count; i++) {
        indices[idxOffset + i] = g.index.getX(i) + vertCount
      }
      idxOffset += g.index.count
    }

    vertCount += pos.count
    vertOffset += pos.count
  }

  const merged = new THREE.BufferGeometry()
  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  merged.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  merged.setIndex(new THREE.BufferAttribute(indices, 1))
  return merged
}
