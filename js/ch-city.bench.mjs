import { performance } from 'node:perf_hooks';
import crypto from 'node:crypto';
import { createChCity } from './ch-city.js';

const DEFAULT_BYTES = 64 * 1024;
const DEFAULT_RUNS = 5_000;

const payloadSize = Number(process.env.CH_CITY_BENCH_BYTES ?? DEFAULT_BYTES);
const iterations = Number(process.env.CH_CITY_BENCH_RUNS ?? DEFAULT_RUNS);
const mode = process.env.CH_CITY_BENCH_MODE ?? 'all';

const payload = crypto.randomBytes(payloadSize);
const helpers = await createChCity();

function bench(label, fn) {
  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) {
    fn();
  }
  const durationMs = performance.now() - start;
  const hashesPerSec = (iterations / durationMs) * 1_000;
  const throughputMBps = ((payloadSize * iterations) / (1024 * 1024)) / (durationMs / 1_000);
  console.log(
    `${label.padEnd(16)} | ${hashesPerSec.toFixed(0).padStart(8)} hash/s | ${throughputMBps.toFixed(2).padStart(8)} MB/s | ${(durationMs / 1_000).toFixed(3)}s`,
  );
}

const benches = [
  {
    label: 'cityhash102',
    run: () => helpers.cityhash102(payload),
  },
  {
    label: 'cityhash64',
    run: () => helpers.cityhash64(payload),
  },
];

console.log(`Running ${iterations.toLocaleString()} iterations @ ${payloadSize} bytes (mode: ${mode})`);
benches
  .filter(({ label }) => mode === 'all' || mode === label)
  .forEach(({ label, run }) => bench(label, run));
