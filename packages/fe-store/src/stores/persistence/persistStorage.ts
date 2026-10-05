/**
 * PersistStorage가 사용하는 key-value 저장소 adapter입니다.
 */
export interface PersistStorageAdapter {
	/**
	 * 현재 런타임에서 저장소를 사용할 수 있는지 확인합니다.
	 */
	isAvailable(): boolean;

	/**
	 * 저장된 값을 읽습니다. JSON 값은 파싱하고, plain string 값은 그대로 반환합니다.
	 */
	read<T>(key: string): T | null;

	/**
	 * 값을 JSON 문자열로 직렬화하여 저장합니다.
	 */
	write<T>(key: string, value: T): void;

	/**
	 * 저장된 값을 제거합니다.
	 */
	remove(key: string): void;
}

/**
 * localStorage 기반 PersistStorageAdapter 구현입니다.
 */
export const browserPersistStorageAdapter: PersistStorageAdapter = {
	isAvailable(): boolean {
		return getBrowserStorage() !== null;
	},

	read<T>(key: string): T | null {
		const storage = getBrowserStorage();
		if (!storage) {
			return null;
		}

		const stored = storage.getItem(key);
		if (stored === null) {
			return null;
		}

		try {
			return JSON.parse(stored) as T;
		} catch {
			return stored as T;
		}
	},

	write<T>(key: string, value: T): void {
		const storage = getBrowserStorage();
		if (!storage) {
			return;
		}

		storage.setItem(key, JSON.stringify(value));
	},

	remove(key: string): void {
		const storage = getBrowserStorage();
		if (!storage) {
			return;
		}

		storage.removeItem(key);
	},
};

/**
 * 하나의 App storage key 아래 여러 상태 section을 관리하는 저장소입니다.
 */
export class PersistStorage {
	private document: Record<string, unknown> = {};
	private isLoaded = false;
	private isStorageAvailable = false;

	constructor(
		private readonly key: string,
		private readonly adapter: PersistStorageAdapter,
	) {}

	/**
	 * 저장된 App 문서에서 상태 section을 읽습니다.
	 */
	read<T>(section: string): T | null {
		this.ensureLoaded();

		if (!(section in this.document)) {
			return null;
		}

		return this.document[section] as T;
	}

	/**
	 * App 문서의 상태 section을 갱신합니다.
	 */
	write<T>(section: string, value: T): void {
		this.ensureLoaded();
		this.document = {
			...this.document,
			[section]: value,
		};
		this.persistDocument();
	}

	/**
	 * App 문서에서 상태 section을 제거합니다.
	 */
	remove(section: string): void {
		this.ensureLoaded();

		if (!(section in this.document)) {
			return;
		}

		const nextDocument = { ...this.document };
		delete nextDocument[section];
		this.document = nextDocument;
		this.persistDocument();
	}

	private ensureLoaded(): void {
		if (this.isLoaded) {
			return;
		}

		this.isLoaded = true;
		this.isStorageAvailable = this.adapter.isAvailable();
		if (!this.isStorageAvailable) {
			return;
		}

		const stored = this.adapter.read<unknown>(this.key);
		if (isPersistStorageDocument(stored)) {
			this.document = { ...stored };
		}
	}

	private persistDocument(): void {
		if (!this.isStorageAvailable) {
			return;
		}

		if (Object.keys(this.document).length === 0) {
			this.adapter.remove(this.key);
			return;
		}

		this.adapter.write(this.key, this.document);
	}
}

function isPersistStorageDocument(
	value: unknown,
): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getBrowserStorage(): Storage | null {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		return window.localStorage;
	} catch {
		return null;
	}
}
