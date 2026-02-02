// Polyfill browser globals that Three.js expects
globalThis.self = globalThis;
globalThis.window = globalThis;
globalThis.document = { createElementNS: () => ({}) };
globalThis.Blob = class Blob {};
globalThis.URL = { createObjectURL: () => '' };

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODELS_DIR = join(import.meta.dirname, 'public', 'models', 'holiday');

const MODEL_FILES = [
  'cabin-wall.glb',
  'cabin-doorway.glb',
  'cabin-corner.glb',
  'cabin-window-a.glb',
  'cabin-window-large.glb',
  'cabin-roof-snow.glb',
  'cabin-roof-snow-chimney.glb',
  'cabin-roof-top.glb',
  'cabin-roof-snow-point.glb',
  'tree-snow-a.glb',
  'tree-snow-b.glb',
  'snowman-hat.glb',
  'rocks-large.glb',
  'lantern.glb',
  'bench.glb',
  'sled.glb',
];

function fmt(n) {
  return n.toFixed(4);
}

function sep(len) {
  return '='.repeat(len);
}

function dash(len) {
  return '-'.repeat(len);
}

function loadGLB(filePath) {
  return new Promise((resolve, reject) => {
    const data = readFileSync(filePath);
    const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    const loader = new GLTFLoader();
    loader.parse(arrayBuffer, '', (gltf) => resolve(gltf), (err) => reject(err));
  });
}

async function inspectModel(filename) {
  const filePath = join(MODELS_DIR, filename);
  try {
    const gltf = await loadGLB(filePath);
    const scene = gltf.scene;

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    console.log('');
    console.log(sep(60));
    console.log('  ' + filename);
    console.log(sep(60));
    console.log('  Bounding Box:');
    console.log('    min: (' + fmt(box.min.x) + ', ' + fmt(box.min.y) + ', ' + fmt(box.min.z) + ')');
    console.log('    max: (' + fmt(box.max.x) + ', ' + fmt(box.max.y) + ', ' + fmt(box.max.z) + ')');
    console.log('  Size (W x H x D):');
    console.log('    ' + fmt(size.x) + ' x ' + fmt(size.y) + ' x ' + fmt(size.z));
    console.log('  Center:');
    console.log('    (' + fmt(center.x) + ', ' + fmt(center.y) + ', ' + fmt(center.z) + ')');

    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child.name || '(unnamed)');
      }
    });
    if (meshes.length > 0) {
      console.log('  Meshes (' + meshes.length + '): ' + meshes.join(', '));
    }

    return { filename, box, size, center };
  } catch (err) {
    console.log('');
    console.log('  ' + filename + ' -- ERROR: ' + err.message);
    return null;
  }
}

async function main() {
  console.log('Kenney Holiday Kit - GLB Model Inspector');
  console.log(sep(40));
  console.log('');
  console.log('Models directory: ' + MODELS_DIR);
  console.log('Models to inspect: ' + MODEL_FILES.length);

  const results = [];
  for (const file of MODEL_FILES) {
    const result = await inspectModel(file);
    if (result) results.push(result);
  }

  console.log('');
  console.log('');
  console.log(sep(90));
  console.log('  SUMMARY TABLE');
  console.log(sep(90));
  console.log(
    '  ' +
    'Model'.padEnd(32) +
    'Width'.padStart(8) +
    'Height'.padStart(8) +
    'Depth'.padStart(8) +
    '   Center (x, y, z)'
  );
  console.log('  ' + dash(86));
  for (const r of results) {
    console.log(
      '  ' +
      r.filename.padEnd(32) +
      fmt(r.size.x).padStart(8) +
      fmt(r.size.y).padStart(8) +
      fmt(r.size.z).padStart(8) +
      '   (' + fmt(r.center.x) + ', ' + fmt(r.center.y) + ', ' + fmt(r.center.z) + ')'
    );
  }
  console.log('');
}

main().catch(console.error);
