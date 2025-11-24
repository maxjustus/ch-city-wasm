// Usage: node examples/standalone.mjs [text]
import { createChCity } from '../dist/ch-city.js';

const chCity = await createChCity();
const input = process.argv[2] || 'hello world';

console.log(`input:       ${input}`);
console.log(`cityhash64:  ${chCity.cityhash64Hex(input)}`);
console.log(`cityhash102: ${chCity.cityhash102Hex(input)}`);
