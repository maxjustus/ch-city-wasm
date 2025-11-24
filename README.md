# ch-city-wasm

WebAssembly bindings for CityHash v1.0.2 (128-bit and 64-bit). Includes a standalone single-file bundle for easy drop-in usage.

## Quick Start

Copy `dist/ch-city.js` (~40KB) into your project:

```js
import { createChCity } from './ch-city.js';

const chCity = await createChCity();
console.log(chCity.cityhash64Hex('hello world'));  // a5a0b66b6b03e4ab
console.log(chCity.cityhash102Hex('hello world')); // 599981f377a6057a1036849c38e27c1b
```

Works in browsers and Node.js. See `examples/` for complete examples.

## API

```js
const chCity = await createChCity();

chCity.cityhash64(data)      // Uint8Array (8 bytes)
chCity.cityhash64Hex(data)   // hex string
chCity.cityhash102(data)     // Uint8Array (16 bytes)
chCity.cityhash102Hex(data)  // hex string
chCity.digest64Length()      // 8
chCity.digestLength()        // 16
chCity.version()             // "0.1.0"
```

Input can be a string, Uint8Array, ArrayBuffer, or any TypedArray.

## Building from Source

Prerequisites:
- Rust with `wasm32-unknown-unknown` target: `rustup target add wasm32-unknown-unknown`
- [wasm-pack](https://rustwasm.github.io/wasm-pack/)

| Target | Description |
| --- | --- |
| `make build` | Release build via wasm-pack, outputs to `pkg/` |
| `make test` | Run Rust and JS tests |
| `make lint` | Run clippy |
| `make fmt` | Format code |
| `make clean` | Remove build artifacts |
