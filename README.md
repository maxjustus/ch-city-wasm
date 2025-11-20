# ch-city-wasm

Browser-friendly WebAssembly bindings for CityHash **v1.0.2** (both 128-bit and 64-bit) that power the `ch128-node` Neon module. The crate exposes only the ClickHouse-compatible variant and ships with a small ESM loader to make the generated bindings easy to consume from the browser or any bundler that understands ECMAScript modules.

## Features
- Thin wrappers around `cityhash_102_128` (128-bit) and `CityHash64` compiled to WebAssembly.
- Both byte (`Uint8Array`) and hex string helpers for each variant plus digest-length helpers (16 bytes for ch128, 8 bytes for ch64).
- Loader utility (`js/ch-city.js`) that normalizes input and hides the wasm-bindgen initialization ceremony.
- Makefile-driven workflows for building, testing, linting, and cleaning artifacts.

## Prerequisites
- Rust toolchain with the `wasm32-unknown-unknown` target installed: `rustup target add wasm32-unknown-unknown`.
- [`wasm-pack`](https://rustwasm.github.io/wasm-pack/) for generating the JS glue code used by browsers/bundlers.

## Make targets
Run the following from the `ch-city-wasm/` directory (or prefix with `make -C ch-city-wasm ...`):

| Target | Description |
| --- | --- |
| `make build` | Release build via `wasm-pack build --target web --release`, outputs to `pkg/`. |
| `make build-debug` | Debug build with incremental, non-optimized settings for quicker iteration. |
| `make build-node` | Builds a Node-ready bundle (`wasm-pack build --target nodejs --dev`). |
| `make test` | Runs the Rust unit tests against the native host (fast verification of known vectors). |
| `make test-js` | Builds the Node bundle (dev) and runs the JS tests via `node --test js/ch-city.test.mjs`. |
| `make bench-js` | Builds the Node bundle (dev) and runs `node js/ch-city.bench.mjs` for quick throughput measurements (tunable via `CH_CITY_BENCH_*` env vars). |
| `make lint` | Executes `cargo clippy` for all targets/features. |
| `make fmt` | Formats sources with `cargo fmt`. |
| `make clean` | Removes `pkg/` artifacts and performs `cargo clean`. |

## Using the loader
After running `make build` you will get the generated wasm-bindgen output in `pkg/`. Import the helper to wire everything up:

```js
import { createChCity } from './ch-city-wasm/js/ch-city.js';

const chCity = await createChCity();

const digestBytes = chCity.cityhash102('hello world');
const digestHex = chCity.cityhash102Hex('hello world');
const digest64Hex = chCity.cityhash64Hex('hello world');
console.log(`cityhash64 digest (hex): ${digest64Hex}`);
```

You can pass a custom loader function to `createChCity` if you need to host the `.wasm` bundle at a different URL:

```js
const chCity = await createChCity(
  undefined,
  () => import('https://cdn.example.com/ch-city-wasm/pkg/ch_city_wasm.js'),
);
```

## Testing hex vectors
Unit tests inside `src/lib.rs` pin several known CityHash vectors (empty input, `hello`, `hello world`, the pangram, plus two `CityHash64` reference strings from the ClickHouse docs). On top of that, `make test-js` runs an end-to-end Node test suite (`js/ch-city.test.mjs`) that instantiates the wasm-bindgen bundle and exercises every exported helper to ensure the JavaScript shim behaves as expected.

## Project layout
```
ch-city-wasm/
├── Cargo.toml        # Rust crate configuration
├── Makefile          # Convenience build/test tasks
├── README.md         # You are here
├── js/
│   ├── ch-city.js        # Loader that wraps wasm-bindgen init
│   ├── ch-city.test.mjs  # Node test exercising loader + wasm bundle
│   └── ch-city.bench.mjs # Pragmatic JS micro-benchmark harness
└── src/
    └── lib.rs        # Wasm bindings + shared helpers/tests
```
