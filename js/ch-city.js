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

async function loadGeneratedModule(moduleLoader) {
  if (typeof moduleLoader === 'function') {
    return moduleLoader();
  }
  return import('../pkg/node.js');
}

export async function createChCity(moduleLoader) {
  const wasm = await loadGeneratedModule(moduleLoader);

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
