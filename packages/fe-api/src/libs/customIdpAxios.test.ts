import {
	AxiosError,
	AxiosHeaders,
	type AxiosAdapter,
	type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

interface PersistStoreStub {
	accessToken: string;
	refreshToken: string;
	sessionId: string;
	spaceId: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
}

const createUnauthorizedError = (config: InternalAxiosRequestConfig) =>
	new AxiosError(
		"Unauthorized",
		"ERR_BAD_REQUEST",
		config,
		{},
		{
			config,
			data: {},
			headers: {},
			status: 401,
			statusText: "Unauthorized",
		},
	);

describe("customIdpAxios", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("native refresh 이후 재시도 요청에 새 세션 헤더를 사용한다", async () => {
		const {
			customIdpInstance,
			setIdpLocaleStore,
			setIdpNativeRefreshHandler,
			setIdpPersistStore,
		} = await import("./customIdpAxios");
		const store: PersistStoreStub = {
			accessToken: "old-access-token",
			refreshToken: "old-refresh-token",
			sessionId: "session-id",
			spaceId: "space-id",
			accessTokenExpiresAt: Date.now() - 1000,
			refreshTokenExpiresAt: Date.now() + 60000,
		};
		const authorizations: Array<string | null> = [];
		const refreshTokens: Array<string | null> = [];
		let callCount = 0;
		const adapter: AxiosAdapter = async (config) => {
			callCount += 1;
			const headers = AxiosHeaders.from(config.headers);
			authorizations.push(headers.get("Authorization")?.toString() ?? null);
			refreshTokens.push(headers.get("x-refresh-token")?.toString() ?? null);

			if (callCount === 1) {
				throw createUnauthorizedError(config);
			}

			return {
				config,
				data: { ok: true },
				headers: {},
				status: 200,
				statusText: "OK",
			};
		};

		setIdpPersistStore(store);
		setIdpLocaleStore({ languageCode: "ko_KR" });
		setIdpNativeRefreshHandler(async () => {
			store.accessToken = "new-access-token";
			store.refreshToken = "new-refresh-token";
		});

		await expect(
			customIdpInstance<{ ok: boolean }>(
				{ method: "GET", url: "/api/v1/auth/current-space" },
				{ adapter },
			),
		).resolves.toEqual({ ok: true });

		expect(authorizations).toEqual([
			"Bearer old-access-token",
			"Bearer new-access-token",
		]);
		expect(refreshTokens).toEqual(["old-refresh-token", "new-refresh-token"]);
	});
});
