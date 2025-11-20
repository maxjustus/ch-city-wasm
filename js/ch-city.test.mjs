import assert from 'node:assert/strict';
import test from 'node:test';
import { createChCity } from './ch-city.js';

const chPromise = createChCity();

const EXPECTED = {
  cityhash102: {
    'hello world': 'd084e357c375600f7b9cb224dd52fb7d',
  },
  cityhash64: {
    Moscow: '2e291d2424fe94ad',
  },
};

function toHex(uint8) {
  return [...uint8].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

test('exposes digest lengths', async () => {
  const ch = await chPromise;
  assert.equal(ch.digestLength(), 16);
  assert.equal(ch.digest64Length(), 8);
});

test('cityhash102 bytes + hex helpers', async () => {
  const ch = await chPromise;
  const input = 'hello world';
  const digestBytes = ch.cityhash102(input);
  assert.equal(toHex(digestBytes), EXPECTED.cityhash102[input]);
  assert.equal(ch.cityhash102Hex(input), EXPECTED.cityhash102[input]);
});

test('cityhash64 bytes + hex helpers', async () => {
  const ch = await chPromise;
  const input = 'Moscow';
  const digestBytes = ch.cityhash64(input);
  assert.equal(toHex(digestBytes), EXPECTED.cityhash64[input]);
  assert.equal(ch.cityhash64Hex(input), EXPECTED.cityhash64[input]);
});
