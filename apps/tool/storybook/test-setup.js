import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

function createMemoryStorage() {
	const state = new Map();

	return {
		get length() {
			return state.size;
		},
		clear() {
			state.clear();
		},
		getItem(key) {
			return state.has(key) ? state.get(key) : null;
		},
		key(index) {
			return Array.from(state.keys())[index] ?? null;
		},
		removeItem(key) {
			state.delete(key);
		},
		setItem(key, value) {
			state.set(key, String(value));
		},
	};
}

function ensureStorage(name) {
	const existing = globalThis[name];
	if (existing && typeof existing.clear === "function") {
		return;
	}

	Object.defineProperty(globalThis, name, {
		configurable: true,
		value: createMemoryStorage(),
	});
}

ensureStorage("localStorage");
ensureStorage("sessionStorage");

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
	cleanup();
});
