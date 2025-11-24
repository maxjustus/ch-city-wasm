#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const wasmPath = join(projectRoot, 'pkg', 'ch_city_wasm_bg.wasm');
const templatePath = join(projectRoot, 'scripts', 'standalone.template.js');
const outputDir = join(projectRoot, 'dist');
const outputPath = join(outputDir, 'ch-city.js');

try {
  const wasmBytes = readFileSync(wasmPath);
  const wasmBase64 = wasmBytes.toString('base64');

  const template = readFileSync(templatePath, 'utf8');
  const output = template.replace('__WASM_BASE64__', wasmBase64);

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, output);

  const sizeKB = (output.length / 1024).toFixed(1);
  console.log(`✓ Standalone bundle written to dist/ch-city.js (${sizeKB}KB)`);
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}
