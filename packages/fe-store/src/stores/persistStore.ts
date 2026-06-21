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
	tenantId: string;
	spaceId: string;
	groundName: string;
	contentLanguageCode?: string | null;
}

/**
 * 영속 저장 데이터 인터페이스
 */
interface PersistedData {
	tenantId: string | null;
	spaceId: string | null;
	groundName: string | null;
	contentLanguageCode: string | null;
	spaces: SpaceInfo[];
	accessToken: string | null;
	refreshToken: string | null;
	sessionId: string | null;
	accessTokenExpiresAt: number | null;
	refreshTokenExpiresAt: number | null;
}

export interface NativeAuthSession {
	accessToken: string;
	refreshToken: string;
	sessionId: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
}

/**
 * PersistStore - 영속 데이터 및 인증 상태 통합 관리
 *
 * - Tenant/Space/Ground 정보 (tenantId, spaceId, groundName)
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
 * persistStore.setSpace("tenant-123", "Ground Name", null, "space-123");
 * persistStore.setTokenExpiries(accessExpiresAt, refreshExpiresAt);
 * persistStore.clear();
 * ```
 */
export class PersistStore {
	// Space/Ground 정보
	tenantId: string | null = null;
	spaceId: string | null = null;
	groundName: string | null = null;
	contentLanguageCode: string | null = null;

	// 선택 가능한 Space 목록 (로그인 시 저장)
	spaces: SpaceInfo[] = [];

	// native 로그인 세션 정보
	accessToken: string | null = null;
	refreshToken: string | null = null;
	sessionId: string | null = null;
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
				this.tenantId = data.tenantId;
				this.spaceId = data.spaceId;
				this.groundName = data.groundName;
				this.contentLanguageCode = data.contentLanguageCode ?? null;
				this.spaces = data.spaces || [];
				this.accessToken = data.accessToken ?? null;
				this.refreshToken = data.refreshToken ?? null;
				this.sessionId = data.sessionId ?? null;
				this.accessTokenExpiresAt = data.accessTokenExpiresAt ?? null;
				this.refreshTokenExpiresAt = data.refreshTokenExpiresAt ?? null;
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
				tenantId: this.tenantId,
				spaceId: this.spaceId,
				groundName: this.groundName,
				contentLanguageCode: this.contentLanguageCode,
				spaces: this.spaces,
				accessToken: this.accessToken,
				refreshToken: this.refreshToken,
				sessionId: this.sessionId,
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
	 * Tenant 및 Ground 정보 설정
	 */
	setSpace(
		tenantId: string,
		groundName: string,
		contentLanguageCode?: string | null,
		spaceId?: string | null,
	): void {
		this.tenantId = tenantId;
		const selectedSpace = this.spaces.find((space) => space.tenantId === tenantId);
		this.spaceId = spaceId ?? selectedSpace?.spaceId ?? null;
		this.groundName = groundName;
		this.contentLanguageCode =
			contentLanguageCode === undefined
				? (selectedSpace
						?.contentLanguageCode ?? null)
				: contentLanguageCode;
	}

	setSpaceSelectionResolved(resolved: boolean): void {
		this.isSpaceSelectionResolved = resolved;
	}

	/**
	 * Space 정보 초기화
	 */
	clearSpace(): void {
		this.tenantId = null;
		this.spaceId = null;
		this.groundName = null;
		this.contentLanguageCode = null;
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

	setNativeAuthSession(session: NativeAuthSession): void {
		this.accessToken = session.accessToken;
		this.refreshToken = session.refreshToken;
		this.sessionId = session.sessionId;
		this.accessTokenExpiresAt = session.accessTokenExpiresAt;
		this.refreshTokenExpiresAt = session.refreshTokenExpiresAt;
	}

	clearNativeAuthSession(): void {
		this.accessToken = null;
		this.refreshToken = null;
		this.sessionId = null;
		this.accessTokenExpiresAt = null;
		this.refreshTokenExpiresAt = null;
	}

	/**
	 * Access Token 만료 여부
	 */
	get isAccessTokenExpired(): boolean {
		if (typeof this.accessTokenExpiresAt !== "number") return true;
		return Date.now() >= this.accessTokenExpiresAt - TOKEN_BUFFER_MS;
	}

	/**
	 * Refresh Token 만료 여부
	 */
	get isRefreshTokenExpired(): boolean {
		if (typeof this.refreshTokenExpiresAt !== "number") return true;
		return Date.now() >= this.refreshTokenExpiresAt - TOKEN_BUFFER_MS;
	}

	/**
	 * 인증 상태 (완전한 native session + Access Token 유효 여부)
	 */
	get isAuthenticated(): boolean {
		if (
			!this.accessToken ||
			!this.refreshToken ||
			!this.sessionId ||
			typeof this.accessTokenExpiresAt !== "number" ||
			typeof this.refreshTokenExpiresAt !== "number"
		) {
			return false;
		}

		return !this.isAccessTokenExpired;
	}

	/**
	 * 토큰 갱신 필요 여부 (Access Token 만료 5분 전)
	 */
	get needsTokenRefresh(): boolean {
		if (
			!this.accessToken ||
			!this.refreshToken ||
			!this.sessionId ||
			typeof this.accessTokenExpiresAt !== "number" ||
			typeof this.refreshTokenExpiresAt !== "number" ||
			this.isRefreshTokenExpired
		) {
			return false;
		}

		const remaining = this.accessTokenExpiresAt - Date.now();
		return remaining > 0 && remaining <= TOKEN_REFRESH_THRESHOLD_MS;
	}

	// === 전체 초기화 (로그아웃) ===

	/**
	 * 모든 상태 초기화 (로그아웃 시 호출)
	 */
	clear(): void {
		this.tenantId = null;
		this.spaceId = null;
		this.groundName = null;
		this.contentLanguageCode = null;
		this.spaces = [];
		this.clearNativeAuthSession();
		this.isHydrated = true;
		this.isSpaceSelectionResolved = true;
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.config.storageKey);
		}
	}
}
