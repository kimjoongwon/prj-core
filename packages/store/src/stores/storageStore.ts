export class StorageStore {
	private storage: Storage;

	constructor(storageType: "localStorage" | "sessionStorage" = "localStorage") {
		this.storage =
			storageType === "localStorage" ? localStorage : sessionStorage;
	}

	setItem(key: string, value: any): void {
		this.storage.setItem(key, JSON.stringify(value));
	}

	getItem(key: string): any {
		const item = this.storage.getItem(key);
		if (!item) return null;

		try {
			return JSON.parse(item);
		} catch (_error) {
			return null;
		}
	}

	removeItem(key: string): void {
		this.storage.removeItem(key);
	}

	clear(): void {
		this.storage.clear();
	}
}
