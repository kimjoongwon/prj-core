import {
	DEFAULT_LANGUAGE,
	type LanguageCode,
	supportedLanguages,
} from "@cocrepo/constant";
import { makeAutoObservable, reaction } from "mobx";

export interface LocaleStoreConfig {
	storageKey: string;
}

export class LocaleStore {
	languageCode: LanguageCode = DEFAULT_LANGUAGE;
	isHydrated = false;

	constructor(private config: LocaleStoreConfig) {
		makeAutoObservable<this, "config">(this, {
			config: false,
		});

		this.setupAutoSave();
	}

	hydrateFromStorage(): void {
		if (this.isHydrated || typeof window === "undefined") return;

		const stored = localStorage.getItem(this.config.storageKey);
		const storedLanguageCode = this.parseStoredLanguageCode(stored);
		if (storedLanguageCode) {
			this.languageCode = storedLanguageCode;
		}

		this.isHydrated = true;
	}

	setLanguageCode(languageCode: LanguageCode): void {
		this.languageCode = languageCode;
	}

	get htmlLang(): string {
		return this.languageCode.replace("_", "-");
	}

	private setupAutoSave(): void {
		if (typeof window === "undefined") return;

		reaction(
			() => this.languageCode,
			(languageCode) => {
				localStorage.setItem(this.config.storageKey, languageCode);
			},
		);
	}

	private parseStoredLanguageCode(stored: string | null): LanguageCode | null {
		if (!stored) {
			return null;
		}

		if (isSupportedLanguageCode(stored)) {
			return stored;
		}

		try {
			const data = JSON.parse(stored) as { languageCode?: unknown };
			if (isSupportedLanguageCode(data.languageCode)) {
				return data.languageCode;
			}
		} catch {
			return null;
		}

		return null;
	}
}

function isSupportedLanguageCode(value: unknown): value is LanguageCode {
	return (
		typeof value === "string" &&
		supportedLanguages.includes(value as LanguageCode)
	);
}
