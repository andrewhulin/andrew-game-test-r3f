import { NodeIO } from '@gltf-transform/core';
import { readFile } from 'fs/promises';
import path from 'path';

const MODELS_DIR = '/home/user/andrew-game-test-r3f/public/models/holiday';

const MODEL_FILES = [
  'cabin-wall.glb',
  'cabin-doorway.glb',
  'cabin-roof-snow-point.glb',
  'tree-snow-a.glb',
  'lantern.glb',
  'rocks-large.glb',
  'snowman-hat.glb',
  'bench.glb',
];

// Map glTF alpha mode values
const ALPHA_MODES = { OPAQUE: 'OPAQUE', MASK: 'MASK', BLEND: 'BLEND' };

// Texture property names to check on materials
const TEXTURE_SLOTS = [
  'baseColorTexture',
  'metallicRoughnessTexture',
  'normalTexture',
  'occlusionTexture',
  'emissiveTexture',
];

function hexColor(rgba) {
  if (!rgba) return null;
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(rgba[0])}${toHex(rgba[1])}${toHex(rgba[2])}` +
    (rgba.length === 4 ? ` (a=${rgba[3].toFixed(2)})` : '');
}

function describeTexture(texture) {
  if (!texture) return null;
  const image = texture.getImage();
  const size = texture.getSize();
  const uri = texture.getURI();
  const mimeType = texture.getMimeType();
  return {
    name: texture.getName() || '(unnamed)',
    mimeType,
    uri: uri || '(embedded)',
    size: size ? `${size[0]}x${size[1]}` : '(unknown)',
    imageDataBytes: image ? image.byteLength : 0,
  };
}

async function inspectModel(filename) {
  const filePath = path.join(MODELS_DIR, filename);
  const io = new NodeIO();
  const document = await io.read(filePath);
  const root = document.getRoot();

  console.log(`\n${'='.repeat(70)}`);
  console.log(`MODEL: ${filename}`);
  console.log(`${'='.repeat(70)}`);

  // --- Meshes overview ---
  const meshes = root.listMeshes();
  console.log(`\n  Meshes: ${meshes.length}`);
  for (const mesh of meshes) {
    const meshName = mesh.getName() || '(unnamed)';
    const primitives = mesh.listPrimitives();
    console.log(`    Mesh "${meshName}" — ${primitives.length} primitive(s)`);

    for (let pi = 0; pi < primitives.length; pi++) {
      const prim = primitives[pi];
      const attrs = prim.listSemantics();
      const vertexCount = prim.getAttribute('POSITION')?.getCount() ?? '?';
      const indices = prim.getIndices();
      const indexCount = indices ? indices.getCount() : 'none';

      console.log(`      Primitive[${pi}]: vertices=${vertexCount}, indices=${indexCount}`);
      console.log(`        Attributes: ${attrs.join(', ')}`);

      // Check for vertex colors
      const hasColor0 = attrs.includes('COLOR_0');
      if (hasColor0) {
        const colorAttr = prim.getAttribute('COLOR_0');
        const componentType = colorAttr.getComponentType();
        const elementSize = colorAttr.getElementSize();
        // Sample first few vertex colors
        const sampleCount = Math.min(3, colorAttr.getCount());
        const samples = [];
        for (let i = 0; i < sampleCount; i++) {
          samples.push(colorAttr.getElement(i, []));
        }
        console.log(`        VERTEX COLORS (COLOR_0): elementSize=${elementSize}, count=${colorAttr.getCount()}`);
        console.log(`          Sample vertex colors (first ${sampleCount}):`);
        for (let i = 0; i < samples.length; i++) {
          const c = samples[i];
          const hex = hexColor(c);
          console.log(`            [${i}]: [${c.map(v => v.toFixed(3)).join(', ')}] => ${hex}`);
        }
      }

      // Material info
      const mat = prim.getMaterial();
      if (!mat) {
        console.log(`        Material: NONE`);
        continue;
      }

      const matName = mat.getName() || '(unnamed)';
      const baseColor = mat.getBaseColorFactor();
      const metallic = mat.getMetallicFactor();
      const roughness = mat.getRoughnessFactor();
      const emissive = mat.getEmissiveFactor();
      const alphaMode = mat.getAlphaMode();
      const alphaCutoff = mat.getAlphaCutoff();
      const doubleSided = mat.getDoubleSided();

      console.log(`        Material: "${matName}"`);
      console.log(`          Base Color Factor: [${baseColor.map(v => v.toFixed(3)).join(', ')}] => ${hexColor(baseColor)}`);
      console.log(`          Metallic: ${metallic.toFixed(3)}`);
      console.log(`          Roughness: ${roughness.toFixed(3)}`);
      console.log(`          Emissive: [${emissive.map(v => v.toFixed(3)).join(', ')}] => ${hexColor(emissive)}`);
      console.log(`          Alpha Mode: ${alphaMode}, Cutoff: ${alphaCutoff}`);
      console.log(`          Double Sided: ${doubleSided}`);

      // Textures
      const textures = {};
      const baseColorTex = mat.getBaseColorTexture();
      const metallicRoughnessTex = mat.getMetallicRoughnessTexture();
      const normalTex = mat.getNormalTexture();
      const occlusionTex = mat.getOcclusionTexture();
      const emissiveTex = mat.getEmissiveTexture();

      if (baseColorTex) textures['baseColorTexture'] = describeTexture(baseColorTex);
      if (metallicRoughnessTex) textures['metallicRoughnessTexture'] = describeTexture(metallicRoughnessTex);
      if (normalTex) textures['normalTexture'] = describeTexture(normalTex);
      if (occlusionTex) textures['occlusionTexture'] = describeTexture(occlusionTex);
      if (emissiveTex) textures['emissiveTexture'] = describeTexture(emissiveTex);

      const texKeys = Object.keys(textures);
      if (texKeys.length === 0) {
        console.log(`          Textures: NONE`);
      } else {
        console.log(`          Textures:`);
        for (const key of texKeys) {
          const t = textures[key];
          console.log(`            ${key}: ${t.mimeType}, ${t.size}, ${t.imageDataBytes} bytes ${t.uri}`);
        }
      }

      // Extensions on the material
      const extensions = mat.listExtensions();
      if (extensions.length > 0) {
        console.log(`          Extensions: ${extensions.map(e => e.extensionName).join(', ')}`);
      }

      console.log(`          HAS VERTEX COLORS: ${hasColor0}`);
    }
  }

  // --- All materials in the document ---
  const allMats = root.listMaterials();
  if (allMats.length > 0) {
    console.log(`\n  All materials in document (${allMats.length}):`);
    for (const m of allMats) {
      const bc = m.getBaseColorFactor();
      console.log(`    - "${m.getName() || '(unnamed)'}" baseColor=${hexColor(bc)} metal=${m.getMetallicFactor().toFixed(2)} rough=${m.getRoughnessFactor().toFixed(2)}`);
    }
  }

  // --- All textures in the document ---
  const allTextures = root.listTextures();
  if (allTextures.length > 0) {
    console.log(`\n  All textures in document (${allTextures.length}):`);
    for (const t of allTextures) {
      const info = describeTexture(t);
      console.log(`    - "${info.name}" ${info.mimeType} ${info.size} ${info.imageDataBytes} bytes`);
    }
  } else {
    console.log(`\n  Textures in document: NONE`);
  }
}

async function main() {
  console.log('GLB Material Inspector');
  console.log(`Inspecting ${MODEL_FILES.length} models from: ${MODELS_DIR}\n`);

  for (const file of MODEL_FILES) {
    try {
      await inspectModel(file);
    } catch (err) {
      console.error(`\n  ERROR loading ${file}: ${err.message}`);
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('INSPECTION COMPLETE');
  console.log(`${'='.repeat(70)}`);
}

main().catch(console.error);
