import { createLogger, navigateTo } from "@cocrepo/toolkit";
import { makeAutoObservable, reaction } from "mobx";
import type { PersistStorage } from "../persistence/persistStorage";

const logger = createLogger("[AuthSession]");
const TOKEN_BUFFER_MS = 30000;
const TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
const AUTH_SESSION_PERSIST_SECTION = "authSession";

export interface NativeAuthSession {
	accessToken: string;
	refreshToken: string;
	sessionId: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
}

interface PersistedAuthSession {
	accessToken: string | null;
	refreshToken: string | null;
	sessionId: string | null;
	accessTokenExpiresAt: number | null;
	refreshTokenExpiresAt: number | null;
}

/**
 * 현재 계정의 인증 토큰과 세션 상태를 관리합니다.
 */
export class AuthSession {
	isLoggingOut = false;
	isHydrated = false;
	accessToken: string | null = null;
	refreshToken: string | null = null;
	sessionId: string | null = null;
	accessTokenExpiresAt: number | null = null;
	refreshTokenExpiresAt: number | null = null;

	constructor(private readonly persistStorage: PersistStorage) {
		makeAutoObservable<this, "persistStorage">(this, {
			persistStorage: false,
		});

		this.setupAutoSave();
	}

	hydrateFromStorage(): void {
		if (this.isHydrated) {
			return;
		}

		const persisted = this.readPersistedAuthSession();
		if (persisted) {
			this.accessToken = persisted.accessToken;
			this.refreshToken = persisted.refreshToken;
			this.sessionId = persisted.sessionId;
			this.accessTokenExpiresAt = persisted.accessTokenExpiresAt;
			this.refreshTokenExpiresAt = persisted.refreshTokenExpiresAt;
		}

		this.isHydrated = true;
	}

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

	get isAccessTokenExpired(): boolean {
		if (typeof this.accessTokenExpiresAt !== "number") return true;
		return Date.now() >= this.accessTokenExpiresAt - TOKEN_BUFFER_MS;
	}

	get isRefreshTokenExpired(): boolean {
		if (typeof this.refreshTokenExpiresAt !== "number") return true;
		return Date.now() >= this.refreshTokenExpiresAt - TOKEN_BUFFER_MS;
	}

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

	async handleAuthError(error: unknown) {
		// 401은 customAxios 인터셉터에서 토큰 갱신을 시도합니다.
		// 갱신 실패 시 인터셉터가 로그인 페이지로 리다이렉트합니다.
		return Promise.reject(error);
	}

	async logout(logoutApi?: () => Promise<unknown>) {
		try {
			this.isLoggingOut = true;
			logger.info("로그아웃 처리 중...");

			if (logoutApi) {
				await logoutApi();
			}

			navigateTo("/admin/auth/login", true);
		} catch (_error) {
			navigateTo("/admin/auth/login", true);
		} finally {
			this.isLoggingOut = false;
		}
	}

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

	clear(): void {
		this.clearNativeAuthSession();
		this.isHydrated = true;
		this.persistStorage.remove(AUTH_SESSION_PERSIST_SECTION);
	}

	private readPersistedAuthSession(): PersistedAuthSession | null {
		const data = this.persistStorage.read<unknown>(
			AUTH_SESSION_PERSIST_SECTION,
		);
		if (!isPersistedRecord(data)) {
			return null;
		}

		return {
			accessToken:
				typeof data.accessToken === "string" ? data.accessToken : null,
			refreshToken:
				typeof data.refreshToken === "string" ? data.refreshToken : null,
			sessionId: typeof data.sessionId === "string" ? data.sessionId : null,
			accessTokenExpiresAt:
				typeof data.accessTokenExpiresAt === "number"
					? data.accessTokenExpiresAt
					: null,
			refreshTokenExpiresAt:
				typeof data.refreshTokenExpiresAt === "number"
					? data.refreshTokenExpiresAt
					: null,
		};
	}

	private setupAutoSave(): void {
		reaction(
			() => ({
				accessToken: this.accessToken,
				refreshToken: this.refreshToken,
				sessionId: this.sessionId,
				accessTokenExpiresAt: this.accessTokenExpiresAt,
				refreshTokenExpiresAt: this.refreshTokenExpiresAt,
			}),
			(data) => {
				if (isEmptyPersistedAuthSession(data)) {
					this.persistStorage.remove(AUTH_SESSION_PERSIST_SECTION);
					return;
				}

				this.persistStorage.write(AUTH_SESSION_PERSIST_SECTION, data);
			},
		);
	}
}

function isPersistedRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isEmptyPersistedAuthSession(data: PersistedAuthSession): boolean {
	return (
		data.accessToken === null &&
		data.refreshToken === null &&
		data.sessionId === null &&
		data.accessTokenExpiresAt === null &&
		data.refreshTokenExpiresAt === null
	);
}
