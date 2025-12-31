import { makeAutoObservable, reaction } from "mobx";

/**
 * PersistStore 설정 인터페이스
 */
export interface PersistStoreConfig {
	/** localStorage 키 */
	storageKey: string;
}

/**
 * 영속 저장 데이터 인터페이스
 */
interface PersistedData {
	spaceId: string | null;
	spaceName: string | null;
}

/**
 * PersistStore - localStorage와 MobX를 연결하는 영속 저장소
 *
 * MobX observable 상태를 localStorage에 자동 동기화합니다.
 * - hydrate: 앱 시작 시 localStorage에서 상태 복원
 * - autoSave: observable 변경 시 자동으로 localStorage에 저장
 *
 * @example
 * ```typescript
 * // 앱에서 Store 생성 및 주입
 * const rootStore = new RootStore();
 * rootStore.persistStore = new PersistStore({
 *   storageKey: "my-app-persist",
 * });
 *
 * // 사용
 * persistStore.setSpace("123");
 * persistStore.clearSpace();
 * ```
 */
export class PersistStore {
	spaceId: string | null = null;
	spaceName: string | null = null;

	constructor(private config: PersistStoreConfig) {
		makeAutoObservable<this, "config">(this, {
			config: false,
		});

		this.hydrate();
		this.setupAutoSave();
	}

	/**
	 * localStorage에서 상태 복원
	 */
	private hydrate(): void {
		if (typeof window === "undefined") return;

		const stored = localStorage.getItem(this.config.storageKey);
		if (stored) {
			try {
				const data: PersistedData = JSON.parse(stored);
				this.spaceId = data.spaceId;
				this.spaceName = data.spaceName;
			} catch {
				// 파싱 실패 시 무시
			}
		}
	}

	/**
	 * observable 변경 시 자동 저장 설정
	 */
	private setupAutoSave(): void {
		if (typeof window === "undefined") return;

		reaction(
			() => ({
				spaceId: this.spaceId,
				spaceName: this.spaceName,
			}),
			(data) => {
				localStorage.setItem(this.config.storageKey, JSON.stringify(data));
			},
		);
	}

	/**
	 * Space 설정
	 */
	setSpace(id: string, name: string): void {
		this.spaceId = id;
		this.spaceName = name;
	}

	/**
	 * Space 초기화
	 */
	clearSpace(): void {
		this.spaceId = null;
		this.spaceName = null;
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.config.storageKey);
		}
	}
}
