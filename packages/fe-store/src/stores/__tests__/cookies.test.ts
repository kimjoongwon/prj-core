/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it, vi } from "vitest";
import { Cookies } from "../cookies";

// react-cookie 모킹
const mockCookies = {
	set: vi.fn(),
	get: vi.fn(),
	remove: vi.fn(),
	getAll: vi.fn(),
};

vi.mock("react-cookie", () => ({
	Cookies: vi.fn().mockImplementation(() => mockCookies),
}));

describe("Cookies", () => {
	let cookies: Cookies;

	beforeEach(() => {
		vi.clearAllMocks();
		cookies = new Cookies();
	});

	describe("set", () => {
		it("쿠키를 설정해야 한다", () => {
			// Given
			const name = "testCookie";
			const value = "testValue";
			const options = { path: "/", secure: true };

			// When
			cookies.set(name, value, options);

			// Then
			expect(mockCookies.set).toHaveBeenCalledWith(name, value, options);
		});

		it("옵션 없이 쿠키를 설정할 수 있다", () => {
			// Given
			const name = "testCookie";
			const value = { data: "test" };

			// When
			cookies.set(name, value);

			// Then
			expect(mockCookies.set).toHaveBeenCalledWith(name, value, undefined);
		});
	});

	describe("get", () => {
		it("쿠키 값을 가져와야 한다", () => {
			// Given
			const name = "testCookie";
			const expectedValue = "testValue";
			mockCookies.get.mockReturnValue(expectedValue);

			// When
			const result = cookies.get(name);

			// Then
			expect(mockCookies.get).toHaveBeenCalledWith(name);
			expect(result).toBe(expectedValue);
		});

		it("객체 값도 가져올 수 있다", () => {
			// Given
			const name = "testCookie";
			const expectedValue = { data: "test", nested: { value: 123 } };
			mockCookies.get.mockReturnValue(expectedValue);

			// When
			const result = cookies.get(name);

			// Then
			expect(result).toEqual(expectedValue);
		});
	});

	describe("remove", () => {
		it("쿠키를 제거해야 한다", () => {
			// Given
			const name = "testCookie";
			const options = { path: "/" };

			// When
			cookies.remove(name, options);

			// Then
			expect(mockCookies.remove).toHaveBeenCalledWith(name, options);
		});

		it("옵션 없이 쿠키를 제거할 수 있다", () => {
			// Given
			const name = "testCookie";

			// When
			cookies.remove(name);

			// Then
			expect(mockCookies.remove).toHaveBeenCalledWith(name, undefined);
		});
	});

	describe("getAll", () => {
		it("모든 쿠키를 가져와야 한다", () => {
			// Given
			const allCookies = {
				cookie1: "value1",
				cookie2: "value2",
				cookie3: { nested: true },
			};
			mockCookies.getAll.mockReturnValue(allCookies);

			// When
			const result = cookies.getAll();

			// Then
			expect(mockCookies.getAll).toHaveBeenCalled();
			expect(result).toEqual(allCookies);
		});

		it("쿠키가 없으면 빈 객체를 반환해야 한다", () => {
			// Given
			mockCookies.getAll.mockReturnValue({});

			// When
			const result = cookies.getAll();

			// Then
			expect(result).toEqual({});
		});
	});
});
