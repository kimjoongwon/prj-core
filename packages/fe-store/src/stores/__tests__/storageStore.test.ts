/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it, vi } from "vitest";
import { StorageStore } from "../storageStore";

describe("StorageStore", () => {
	// Storage 모킹
	const createMockStorage = () => ({
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		length: 0,
		key: vi.fn(),
	});

	let mockLocalStorage: ReturnType<typeof createMockStorage>;
	let mockSessionStorage: ReturnType<typeof createMockStorage>;

	beforeEach(() => {
		vi.clearAllMocks();

		mockLocalStorage = createMockStorage();
		mockSessionStorage = createMockStorage();

		Object.defineProperty(window, "localStorage", {
			value: mockLocalStorage,
			writable: true,
		});

		Object.defineProperty(window, "sessionStorage", {
			value: mockSessionStorage,
			writable: true,
		});
	});

	describe("생성자", () => {
		it("기본값은 localStorage를 사용해야 한다", () => {
			// When
			const store = new StorageStore();
			store.setItem("test", "value");

			// Then
			expect(mockLocalStorage.setItem).toHaveBeenCalled();
			expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
		});

		it("sessionStorage를 사용할 수 있다", () => {
			// When
			const store = new StorageStore("sessionStorage");
			store.setItem("test", "value");

			// Then
			expect(mockSessionStorage.setItem).toHaveBeenCalled();
			expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
		});
	});

	describe("setItem", () => {
		it("값을 JSON으로 직렬화하여 저장해야 한다", () => {
			// Given
			const store = new StorageStore();
			const key = "testKey";
			const value = { data: "test", number: 123 };

			// When
			store.setItem(key, value);

			// Then
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				key,
				JSON.stringify(value),
			);
		});

		it("문자열 값도 저장할 수 있다", () => {
			// Given
			const store = new StorageStore();

			// When
			store.setItem("key", "simple string");

			// Then
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"key",
				'"simple string"',
			);
		});

		it("숫자 값도 저장할 수 있다", () => {
			// Given
			const store = new StorageStore();

			// When
			store.setItem("key", 42);

			// Then
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith("key", "42");
		});

		it("배열 값도 저장할 수 있다", () => {
			// Given
			const store = new StorageStore();
			const array = [1, 2, 3, "test"];

			// When
			store.setItem("key", array);

			// Then
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"key",
				JSON.stringify(array),
			);
		});
	});

	describe("getItem", () => {
		it("저장된 값을 파싱하여 반환해야 한다", () => {
			// Given
			const store = new StorageStore();
			const storedValue = { data: "test", number: 123 };
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedValue));

			// When
			const result = store.getItem("testKey");

			// Then
			expect(mockLocalStorage.getItem).toHaveBeenCalledWith("testKey");
			expect(result).toEqual(storedValue);
		});

		it("값이 없으면 null을 반환해야 한다", () => {
			// Given
			const store = new StorageStore();
			mockLocalStorage.getItem.mockReturnValue(null);

			// When
			const result = store.getItem("nonexistent");

			// Then
			expect(result).toBeNull();
		});

		it("유효하지 않은 JSON이면 null을 반환해야 한다", () => {
			// Given
			const store = new StorageStore();
			mockLocalStorage.getItem.mockReturnValue("invalid json {");

			// When
			const result = store.getItem("key");

			// Then
			expect(result).toBeNull();
		});
	});

	describe("removeItem", () => {
		it("키에 해당하는 값을 삭제해야 한다", () => {
			// Given
			const store = new StorageStore();

			// When
			store.removeItem("keyToRemove");

			// Then
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("keyToRemove");
		});
	});

	describe("clear", () => {
		it("모든 데이터를 삭제해야 한다", () => {
			// Given
			const store = new StorageStore();

			// When
			store.clear();

			// Then
			expect(mockLocalStorage.clear).toHaveBeenCalled();
		});

		it("sessionStorage도 clear할 수 있다", () => {
			// Given
			const store = new StorageStore("sessionStorage");

			// When
			store.clear();

			// Then
			expect(mockSessionStorage.clear).toHaveBeenCalled();
		});
	});
});
