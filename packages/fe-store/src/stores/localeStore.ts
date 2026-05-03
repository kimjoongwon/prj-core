import {
	DEFAULT_LANGUAGE,
	LanguageCode,
	supportedLanguages,
} from "@cocrepo/constant";
import { makeAutoObservable, reaction } from "mobx";

export interface LocaleStoreConfig {
	storageKey: string;
}

interface PersistedLocale {
	languageCode?: LanguageCode | null;
}

function toLanguageCode(value?: string | null): LanguageCode {
	if (supportedLanguages.includes(value as LanguageCode)) {
		return value as LanguageCode;
	}

	return DEFAULT_LANGUAGE;
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
		if (this.isHydrated || typeof window === "undefined") {
			return;
		}

		const stored = localStorage.getItem(this.config.storageKey);
		if (stored) {
			try {
				const data = JSON.parse(stored) as PersistedLocale;
				this.languageCode = toLanguageCode(data.languageCode);
			} catch {
				this.languageCode = DEFAULT_LANGUAGE;
			}
		}

		this.isHydrated = true;
	}

	setLanguageCode(languageCode: string): void {
		this.languageCode = toLanguageCode(languageCode);
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
