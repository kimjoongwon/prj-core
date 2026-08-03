/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	browserPersistStorageAdapter,
	PersistStorage,
} from "../persistence/persistStorage";

const STORAGE_KEY = "persist-storage-test";

function createStorageMock() {
	const store = new Map<string, string>();

	return {
		getItem: vi.fn((key: string) => store.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			store.delete(key);
		}),
		clear: vi.fn(() => {
			store.clear();
		}),
		dump: () => new Map(store),
	};
}

describe("PersistStorage", () => {
	let storage: ReturnType<typeof createStorageMock>;
	let persistStorage: PersistStorage;

	beforeEach(() => {
		storage = createStorageMock();
		Object.defineProperty(window, "localStorage", {
			value: storage,
			writable: true,
		});
		persistStorage = new PersistStorage(
			STORAGE_KEY,
			browserPersistStorageAdapter,
		);
	});

	it("App 문서를 한 번만 읽고 section별 값을 반환한다", () => {
		storage.setItem(
			STORAGE_KEY,
			JSON.stringify({ account: { tenantId: "101" }, language: "en_US" }),
		);

		expect(persistStorage.read("account")).toEqual({ tenantId: "101" });
		expect(persistStorage.read("language")).toBe("en_US");
		expect(storage.getItem).toHaveBeenCalledTimes(1);
	});

	it("하나의 App 문서에 section 값을 저장하고 다시 읽는다", () => {
		persistStorage.write("account", {
			tenantId: "101",
			spaceId: "201",
		});

		expect(storage.dump().get(STORAGE_KEY)).toBe(
			JSON.stringify({
				account: {
					tenantId: "101",
					spaceId: "201",
				},
			}),
		);
		expect(
			persistStorage.read<{ tenantId: string; spaceId: string }>("account"),
		).toEqual({ tenantId: "101", spaceId: "201" });
	});

	it("section의 plain string 값을 그대로 읽는다", () => {
		storage.setItem(STORAGE_KEY, JSON.stringify({ language: "en_US" }));

		expect(persistStorage.read<string>("language")).toBe("en_US");
	});

	it("section 제거 시 다른 값은 보존하고 빈 문서는 제거한다", () => {
		persistStorage.write("account", { tenantId: "101" });
		persistStorage.write("language", "ko_KR");

		persistStorage.remove("account");

		expect(JSON.parse(storage.dump().get(STORAGE_KEY) ?? "{}")).toEqual({
			language: "ko_KR",
		});

		persistStorage.remove("language");

		expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
		expect(storage.dump().has(STORAGE_KEY)).toBe(false);
	});
});
