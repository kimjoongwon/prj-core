/// <reference types="vitest/globals" />

import { DEFAULT_LANGUAGE, LanguageCode } from "@cocrepo/constant";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageStore } from "../language/languageStore";
import {
	browserPersistStorageAdapter,
	PersistStorage,
} from "../persistence/persistStorage";

const STORAGE_KEY = "test-persist";

function createLanguageStore(): LanguageStore {
	return new LanguageStore(
		new PersistStorage(STORAGE_KEY, browserPersistStorageAdapter),
	);
}

describe("LanguageStore", () => {
	const mockLocalStorage = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(window, "localStorage", {
			value: mockLocalStorage,
			writable: true,
		});
		mockLocalStorage.getItem.mockReturnValue(null);
	});

	it("uses ko_KR as the default language before hydration", () => {
		const store = createLanguageStore();

		expect(store.languageCode).toBe(DEFAULT_LANGUAGE);
		expect(store.isHydrated).toBe(false);
	});

	it("hydrates a supported language from localStorage", () => {
		mockLocalStorage.getItem.mockReturnValue(
			JSON.stringify({ language: LanguageCode.en_US }),
		);

		const store = createLanguageStore();
		store.hydrateFromStorage();

		expect(store.languageCode).toBe(LanguageCode.en_US);
		expect(store.isHydrated).toBe(true);
	});

	it("hydrates a supported language from a persisted object", () => {
		mockLocalStorage.getItem.mockReturnValue(
			JSON.stringify({
				language: { languageCode: LanguageCode.ja_JP },
			}),
		);

		const store = createLanguageStore();
		store.hydrateFromStorage();

		expect(store.languageCode).toBe(LanguageCode.ja_JP);
		expect(store.htmlLang).toBe("ja-JP");
	});

	it("ignores an unsupported stored language and keeps the default", () => {
		mockLocalStorage.getItem.mockReturnValue(
			JSON.stringify({ language: "fr_FR" }),
		);

		const store = createLanguageStore();
		store.hydrateFromStorage();

		expect(store.languageCode).toBe(DEFAULT_LANGUAGE);
		expect(store.isHydrated).toBe(true);
	});

	it("saves language changes and exposes an html lang value", async () => {
		const store = createLanguageStore();

		store.setLanguageCode(LanguageCode.ja_JP);
		await Promise.resolve();

		expect(store.htmlLang).toBe("ja-JP");
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
			STORAGE_KEY,
			JSON.stringify({
				language: { languageCode: LanguageCode.ja_JP },
			}),
		);
	});
});
