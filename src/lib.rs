use cityhash_102_rs::{city_hash_128, city_hash_64};
use wasm_bindgen::prelude::*;

const DIGEST128_SIZE: usize = 16;
const DIGEST64_SIZE: usize = 8;

fn hash_102_bytes(input: &[u8]) -> [u8; DIGEST128_SIZE] {
    let le = city_hash_128(input).to_le_bytes();
    let mut out = [0u8; DIGEST128_SIZE];
    out[..8].copy_from_slice(&le[8..]);
    out[8..].copy_from_slice(&le[..8]);
    out
}

fn bytes_to_hex<const N: usize>(bytes: &[u8; N]) -> String {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    let mut out = vec![0u8; N * 2];
    for (i, byte) in bytes.iter().enumerate() {
        out[i * 2] = HEX[(byte >> 4) as usize];
        out[i * 2 + 1] = HEX[(byte & 0x0f) as usize];
    }
    String::from_utf8(out).expect("only ascii hex digits are produced")
}

#[wasm_bindgen]
pub fn digest_byte_length() -> usize {
    DIGEST128_SIZE
}

#[wasm_bindgen]
pub fn digest64_byte_length() -> usize {
    DIGEST64_SIZE
}

#[wasm_bindgen]
pub fn cityhash_102_128(input: &[u8]) -> Vec<u8> {
    hash_102_bytes(input).to_vec()
}

#[wasm_bindgen]
pub fn cityhash_102_128_hex(input: &[u8]) -> String {
    bytes_to_hex(&hash_102_bytes(input))
}

#[wasm_bindgen]
pub fn cityhash64(input: &[u8]) -> Vec<u8> {
    city_hash_64(input).to_le_bytes().to_vec()
}

#[wasm_bindgen]
pub fn cityhash64_hex(input: &[u8]) -> String {
    bytes_to_hex(&city_hash_64(input).to_le_bytes())
}

#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    const EMPTY: &str = "291ee592c340b53c2b9ac064fc9df03d";
    const HELLO: &str = "ecb5f4a35b1d88f1ef6b13cd6582aebb";
    const HELLO_WORLD: &str = "d084e357c375600f7b9cb224dd52fb7d";
    const QUICK_BROWN: &str = "a131e5be6b34b1e4fda226d302221069";

    fn hex_to_bytes_128(hex: &str) -> [u8; DIGEST128_SIZE] {
        let mut bytes = [0u8; DIGEST128_SIZE];
        for (i, chunk) in hex.as_bytes().chunks(2).enumerate() {
            bytes[i] = (hex_nibble(chunk[0]) << 4) | hex_nibble(chunk[1]);
        }
        bytes
    }

    fn hex_nibble(byte: u8) -> u8 {
        match byte {
            b'0'..=b'9' => byte - b'0',
            b'a'..=b'f' => byte - b'a' + 10,
            b'A'..=b'F' => byte - b'A' + 10,
            _ => panic!("invalid hex nibble"),
        }
    }

    fn assert_hash<F>(expected_hex: &str, f: F)
    where
        F: FnOnce() -> [u8; DIGEST128_SIZE],
    {
        let expected = hex_to_bytes_128(expected_hex);
        let actual = f();
        assert_eq!(actual, expected, "hash mismatch for {expected_hex}");
    }

    #[test]
    fn cityhash_102_vectors() {
        assert_hash(EMPTY, || hash_102_bytes(b""));
        assert_hash(HELLO, || hash_102_bytes(b"hello"));
        assert_hash(HELLO_WORLD, || hash_102_bytes(b"hello world"));
        assert_hash(QUICK_BROWN, || {
            hash_102_bytes(b"The quick brown fox jumps over the lazy dog")
        });
    }

    #[test]
    fn hex_round_trip() {
        let digest = hash_102_bytes(b"round tripping");
        let hex = bytes_to_hex(&digest);
        assert_eq!(digest, hex_to_bytes_128(&hex));
    }

    #[test]
    fn cityhash64_vectors_match_reference() {
        assert_eq!(city_hash_64(b""), 0x9ae16a3b2f90404f);
        assert_eq!(city_hash_64(b"Moscow"), 0xad94fe24241d292e);
        let quote = b"How can you write a big system without C++?  -Paul Glick";
        assert_eq!(city_hash_64(quote), 0x5691a235fd36deb9);
    }

    #[test]
    fn cityhash64_hex_helper() {
        let hex = cityhash64_hex(b"Moscow");
        assert_eq!(hex, "2e291d2424fe94ad");
    }
}
