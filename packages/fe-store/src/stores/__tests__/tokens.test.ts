/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it } from "vitest";
import type { AppStore } from "../appStore";
import { Tokens } from "../tokens";

describe("Tokens", () => {
	let tokens: Tokens;
	let mockApp: AppStore;

	beforeEach(() => {
		mockApp = {} as AppStore;
		tokens = new Tokens(mockApp);
	});

	it("인스턴스가 생성되어야 한다", () => {
		expect(tokens).toBeDefined();
	});

	it("app 참조가 올바르게 설정되어야 한다", () => {
		expect(tokens.app).toBe(mockApp);
	});
});
