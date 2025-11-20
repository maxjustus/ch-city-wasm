WASM_PACK ?= wasm-pack
WASM_TARGET ?= web
WASM_OUT_DIR ?= pkg
WASM_TEST_TARGET ?= nodejs

.PHONY: build build-debug test test-js build-node bench-js lint fmt clean

build:
	$(WASM_PACK) build --target $(WASM_TARGET) --release --out-dir $(WASM_OUT_DIR)

build-debug:
	$(WASM_PACK) build --target $(WASM_TARGET) --dev --out-dir $(WASM_OUT_DIR)

build-node:
	$(WASM_PACK) build --target $(WASM_TEST_TARGET) --dev --out-dir $(WASM_OUT_DIR)

test: test-rust test-js

test-rust:
	cargo test

test-js: build-node
	node --test js/ch-city.test.mjs

bench-js: build-node
	node js/ch-city.bench.mjs

lint:
	cargo clippy --all-targets --all-features -- -D warnings

fmt:
	cargo fmt --all

clean:
	cargo clean
	rm -rf $(WASM_OUT_DIR)
