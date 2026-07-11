import {
	DEFAULT_LANGUAGE,
	type LanguageCode,
	supportedLanguages,
} from "@cocrepo/constant";
import { makeAutoObservable, reaction } from "mobx";
import type { PersistStorage } from "../persistence/persistStorage";

const LANGUAGE_PERSIST_SECTION = "language";

interface PersistedLanguage {
	languageCode?: LanguageCode | string | null;
}

/**
 * LanguageStore - 현재 UI 언어와 저장소 동기화를 관리합니다.
 */
export class LanguageStore {
	private languageCodeValue: LanguageCode = DEFAULT_LANGUAGE;
	isHydrated = false;

	constructor(private readonly persistStorage: PersistStorage) {
		makeAutoObservable<this, "persistStorage">(this, {
			persistStorage: false,
		});

		this.setupAutoSave();
	}

	/**
	 * 브라우저 저장소에서 언어 설정을 한 번 복원합니다.
	 */
	hydrateFromStorage(): void {
		if (this.isHydrated) {
			return;
		}

		const stored = this.persistStorage.read<
			PersistedLanguage | LanguageCode
		>(LANGUAGE_PERSIST_SECTION);
		if (stored !== null) {
			this.languageCodeValue = toPersistedLanguageCode(stored);
		}

		this.isHydrated = true;
	}

	/**
	 * 현재 언어 코드를 변경합니다. 지원하지 않는 값은 기본 언어로 정규화됩니다.
	 */
	setLanguageCode(languageCode: string): void {
		this.languageCodeValue = toLanguageCode(languageCode);
	}

	get languageCode(): LanguageCode {
		return this.languageCodeValue;
	}

	get htmlLang(): string {
		return this.languageCode.replace("_", "-");
	}

	private setupAutoSave(): void {
		reaction(
			() => toPersistedLanguage(this.languageCodeValue),
			(data) => {
				this.persistStorage.write(LANGUAGE_PERSIST_SECTION, data);
			},
		);
	}
}

function toPersistedLanguageCode(
	data?: PersistedLanguage | LanguageCode | null,
): LanguageCode {
	if (typeof data === "string") {
		return toLanguageCode(data);
	}

	return toLanguageCode(data?.languageCode);
}

function toPersistedLanguage(languageCode: LanguageCode): PersistedLanguage {
	return {
		languageCode,
	};
}

function toLanguageCode(value?: string | null): LanguageCode {
	if (supportedLanguages.includes(value as LanguageCode)) {
		return value as LanguageCode;
	}

	return DEFAULT_LANGUAGE;
}
