import { makeAutoObservable, reaction } from "mobx";

// 토큰 만료 판별용 상수
const TOKEN_BUFFER_MS = 30000; // 30초 버퍼 (네트워크 지연 고려)
const TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5분

/**
 * PersistStore 설정 인터페이스
 */
export interface PersistStoreConfig {
	/** localStorage 키 */
	storageKey: string;
}

/**
 * Space 정보 인터페이스 (선택 가능한 Space 목록용)
 */
export interface SpaceInfo {
	spaceId: string;
	groundName: string;
}

/**
 * 영속 저장 데이터 인터페이스
 */
interface PersistedData {
	spaceId: string | null;
	groundName: string | null;
	spaces: SpaceInfo[];
	accessTokenExpiresAt: number | null;
	refreshTokenExpiresAt: number | null;
}

/**
 * PersistStore - 영속 데이터 및 인증 상태 통합 관리
 *
 * - Space/Ground 정보 (spaceId, groundName)
 * - 토큰 만료 시간 (httpOnly 쿠키 환경용, number 타입으로 단순 저장)
 * - localStorage 자동 동기화
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
 * persistStore.setSpace("space-123", "Ground Name");
 * persistStore.setTokenExpiries(accessExpiresAt, refreshExpiresAt);
 * persistStore.clear();
 * ```
 */
export class PersistStore {
	// Space/Ground 정보
	spaceId: string | null = null;
	groundName: string | null = null;

	// 선택 가능한 Space 목록 (로그인 시 저장)
	spaces: SpaceInfo[] = [];

	// 토큰 만료 시간 (Unix timestamp, 실제 토큰은 httpOnly 쿠키에 저장)
	accessTokenExpiresAt: number | null = null;
	refreshTokenExpiresAt: number | null = null;

	// 브라우저 저장소 hydrate 완료 여부
	isHydrated = false;

	// current-space API로 현재 선택 Space 확인이 완료되었는지 여부
	isSpaceSelectionResolved = false;

	constructor(private config: PersistStoreConfig) {
		makeAutoObservable<this, "config">(this, {
			config: false,
		});

		this.setupAutoSave();
	}

	/**
	 * localStorage에서 상태 복원
	 *
	 * SSR/첫 클라이언트 렌더의 구조를 안정적으로 유지하기 위해
	 * constructor가 아니라 provider/hook의 effect에서 호출합니다.
	 */
	hydrateFromStorage(): void {
		if (this.isHydrated || typeof window === "undefined") return;

		const stored = localStorage.getItem(this.config.storageKey);
		if (stored) {
			try {
				const data: PersistedData = JSON.parse(stored);
				this.spaceId = data.spaceId;
				this.groundName = data.groundName;
				this.spaces = data.spaces || [];
				this.accessTokenExpiresAt = data.accessTokenExpiresAt;
				this.refreshTokenExpiresAt = data.refreshTokenExpiresAt;
			} catch {
				// 파싱 실패 시 무시
			}
		}

		this.isHydrated = true;
	}

	/**
	 * observable 변경 시 자동 저장 설정
	 */
	private setupAutoSave(): void {
		if (typeof window === "undefined") return;

		reaction(
			() => ({
				spaceId: this.spaceId,
				groundName: this.groundName,
				spaces: this.spaces,
				accessTokenExpiresAt: this.accessTokenExpiresAt,
				refreshTokenExpiresAt: this.refreshTokenExpiresAt,
			}),
			(data) => {
				localStorage.setItem(this.config.storageKey, JSON.stringify(data));
			},
		);
	}

	// === Space/Ground 관련 ===

	/**
	 * Space 및 Ground 정보 설정
	 */
	setSpace(spaceId: string, groundName: string): void {
		this.spaceId = spaceId;
		this.groundName = groundName;
	}

	setSpaceSelectionResolved(resolved: boolean): void {
		this.isSpaceSelectionResolved = resolved;
	}

	/**
	 * Space 정보 초기화
	 */
	clearSpace(): void {
		this.spaceId = null;
		this.groundName = null;
	}

	/**
	 * 선택 가능한 Space 목록 설정 (로그인 시 호출)
	 */
	setSpaces(spaces: SpaceInfo[]): void {
		this.spaces = spaces;
	}

	// === 토큰 만료 시간 관련 ===

	/**
	 * 토큰 만료 시간 설정 (로그인 성공 시 호출)
	 */
	setTokenExpiries(accessExpiresAt: number, refreshExpiresAt: number): void {
		this.accessTokenExpiresAt = accessExpiresAt;
		this.refreshTokenExpiresAt = refreshExpiresAt;
	}

	/**
	 * Access Token 만료 여부
	 */
	get isAccessTokenExpired(): boolean {
		if (!this.accessTokenExpiresAt) return true;
		return Date.now() >= this.accessTokenExpiresAt - TOKEN_BUFFER_MS;
	}

	/**
	 * Refresh Token 만료 여부
	 */
	get isRefreshTokenExpired(): boolean {
		if (!this.refreshTokenExpiresAt) return true;
		return Date.now() >= this.refreshTokenExpiresAt - TOKEN_BUFFER_MS;
	}

	/**
	 * 인증 상태 (Access Token 유효 여부)
	 */
	get isAuthenticated(): boolean {
		return !this.isAccessTokenExpired;
	}

	/**
	 * 토큰 갱신 필요 여부 (Access Token 만료 5분 전)
	 */
	get needsTokenRefresh(): boolean {
		if (!this.accessTokenExpiresAt) return false;
		const remaining = this.accessTokenExpiresAt - Date.now();
		return remaining > 0 && remaining <= TOKEN_REFRESH_THRESHOLD_MS;
	}

	// === 전체 초기화 (로그아웃) ===

	/**
	 * 모든 상태 초기화 (로그아웃 시 호출)
	 */
	clear(): void {
		this.spaceId = null;
		this.groundName = null;
		this.spaces = [];
		this.accessTokenExpiresAt = null;
		this.refreshTokenExpiresAt = null;
		this.isHydrated = true;
		this.isSpaceSelectionResolved = true;
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.config.storageKey);
		}
	}
}
