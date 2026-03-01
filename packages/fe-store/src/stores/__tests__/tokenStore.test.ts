/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it } from "vitest";
import type { RootStore } from "../rootStore";
import { TokenStore } from "../tokenStore";

describe("TokenStore", () => {
	let tokenStore: TokenStore;
	let mockRootStore: RootStore;

	beforeEach(() => {
		mockRootStore = {} as RootStore;
		tokenStore = new TokenStore(mockRootStore);
	});

	it("인스턴스가 생성되어야 한다", () => {
		expect(tokenStore).toBeDefined();
	});

	it("rootStore 참조가 올바르게 설정되어야 한다", () => {
		expect(tokenStore.rootStore).toBe(mockRootStore);
	});
});
