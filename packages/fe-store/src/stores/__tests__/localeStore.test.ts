/// <reference types="vitest/globals" />

import { DEFAULT_LANGUAGE, LanguageCode } from "@cocrepo/constant";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleStore } from "../localeStore";

describe("LocaleStore", () => {
	const STORAGE_KEY = "test-persist:locale";
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
		const store = new LocaleStore({ storageKey: STORAGE_KEY });

		expect(store.languageCode).toBe(DEFAULT_LANGUAGE);
		expect(store.isHydrated).toBe(false);
	});

	it("hydrates a supported language from localStorage", () => {
		mockLocalStorage.getItem.mockReturnValue(LanguageCode.en_US);

		const store = new LocaleStore({ storageKey: STORAGE_KEY });
		store.hydrateFromStorage();

		expect(store.languageCode).toBe(LanguageCode.en_US);
		expect(store.isHydrated).toBe(true);
	});

	it("ignores an unsupported stored language and keeps the default", () => {
		mockLocalStorage.getItem.mockReturnValue("fr_FR");

		const store = new LocaleStore({ storageKey: STORAGE_KEY });
		store.hydrateFromStorage();

		expect(store.languageCode).toBe(DEFAULT_LANGUAGE);
		expect(store.isHydrated).toBe(true);
	});

	it("saves language changes and exposes an html lang value", async () => {
		const store = new LocaleStore({ storageKey: STORAGE_KEY });

		store.setLanguageCode(LanguageCode.ja_JP);
		await Promise.resolve();

		expect(store.htmlLang).toBe("ja-JP");
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
			STORAGE_KEY,
			LanguageCode.ja_JP,
		);
	});
});
