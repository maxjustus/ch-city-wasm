const textEncoder = new TextEncoder();

function toUint8Array(input) {
  if (input instanceof Uint8Array) {
    return input;
  }

  if (typeof input === 'string') {
    return textEncoder.encode(input);
  }

  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }

  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }

  throw new TypeError('cityhash expects a string or (typed) array-like input');
}

async function loadGeneratedModule(initOptions, moduleLoader) {
  if (typeof moduleLoader === 'function') {
    const loaded = await moduleLoader();
    const init = loaded.default ?? loaded;
    if (typeof init === 'function') {
      return init(initOptions);
    }
    return init;
  }

  const generated = await import('../pkg/ch_city_wasm.js');
  const init = generated.default ?? generated;
  if (typeof init === 'function') {
    return init(initOptions);
  }
  return init;
}

export async function createChCity(initOptions, moduleLoader) {
  const wasm = await loadGeneratedModule(initOptions, moduleLoader);

  return {
    version: () => wasm.version(),
    digestLength: () => wasm.digest_byte_length(),
    digest64Length: () => wasm.digest64_byte_length(),
    cityhash102(data) {
      return wasm.cityhash_102_128(toUint8Array(data));
    },
    cityhash64(data) {
      return wasm.cityhash64(toUint8Array(data));
    },
    cityhash102Hex(data) {
      return wasm.cityhash_102_128_hex(toUint8Array(data));
    },
    cityhash64Hex(data) {
      return wasm.cityhash64_hex(toUint8Array(data));
    },
  };
}
