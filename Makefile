WASM_PACK ?= wasm-pack
WASM_TARGET ?= web
WASM_OUT_DIR ?= pkg

.PHONY: build build-standalone test test-js bench-js lint fmt clean

build:
	$(WASM_PACK) build --target $(WASM_TARGET) --release --out-dir $(WASM_OUT_DIR)
	node scripts/add-node-entry.mjs

build-standalone: build
	node scripts/build-standalone.mjs

test: test-rust test-js

test-rust:
	cargo test

test-js: build
	node --test js/ch-city.test.mjs

bench-js: build
	node js/ch-city.bench.mjs

lint:
	cargo clippy --all-targets --all-features -- -D warnings

fmt:
	cargo fmt --all

clean:
	cargo clean
	rm -rf $(WASM_OUT_DIR) dist
