import {
	DEFAULT_LANGUAGE,
	LanguageCode,
	supportedLanguages,
} from "@cocrepo/constant";
import { makeAutoObservable, reaction } from "mobx";

export interface LocaleConfig {
	storageKey: string;
}

interface PersistedLocale {
	languageCode?: LanguageCode | null;
}

function parsePersistedLanguageCode(stored: string): LanguageCode {
	try {
		const data = JSON.parse(stored) as PersistedLocale | LanguageCode;
		if (typeof data === "string") {
			return toLanguageCode(data);
		}

		return toLanguageCode(data.languageCode);
	} catch {
		return toLanguageCode(stored);
	}
}

function toLanguageCode(value?: string | null): LanguageCode {
	if (supportedLanguages.includes(value as LanguageCode)) {
		return value as LanguageCode;
	}

	return DEFAULT_LANGUAGE;
}

export class Locale {
	languageCode: LanguageCode = DEFAULT_LANGUAGE;
	isHydrated = false;

	constructor(private config: LocaleConfig) {
		makeAutoObservable<this, "config">(this, {
			config: false,
		});

		this.setupAutoSave();
	}

	hydrateFromStorage(): void {
		if (this.isHydrated || typeof window === "undefined") {
			return;
		}

		const stored = localStorage.getItem(this.config.storageKey);
		if (stored) {
			this.languageCode = parsePersistedLanguageCode(stored);
		}

		this.isHydrated = true;
	}

	setLanguageCode(languageCode: string): void {
		this.languageCode = toLanguageCode(languageCode);
	}

	get htmlLang(): string {
		return this.languageCode.replace("_", "-");
	}

	private setupAutoSave(): void {
		if (typeof window === "undefined") {
			return;
		}

		reaction(
			() => ({
				languageCode: this.languageCode,
			}),
			(data) => {
				localStorage.setItem(this.config.storageKey, JSON.stringify(data));
			},
		);
	}
}
