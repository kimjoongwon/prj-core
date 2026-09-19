import {
	type AxiosAdapter,
	AxiosError,
	AxiosHeaders,
	type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

interface SessionScopeStub {
	accessToken: string;
	refreshToken: string;
	sessionId: string;
	tenantId: string;
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

describe("customAxios", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("세션 복구 정책의 refreshSession 이후 재시도 요청에 새 세션 헤더를 사용한다", async () => {
		const {
			customInstance,
			installCoreSessionRecovery,
			setApiLocale,
			setApiSessionScope,
		} = await import("./customAxios");
		const store: SessionScopeStub = {
			accessToken: "old-access-token",
			refreshToken: "old-refresh-token",
			sessionId: "session-id",
			tenantId: "tenant-id",
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

		setApiSessionScope(store);
		setApiLocale({ languageCode: "ko_KR" });
		installCoreSessionRecovery({
			refreshSession: async () => {
				store.accessToken = "new-access-token";
				store.refreshToken = "new-refresh-token";
			},
		});

		await expect(
			customInstance<{ ok: boolean }>(
				{ method: "GET", url: "/api/v1/templates" },
				{ adapter },
			),
		).resolves.toEqual({ ok: true });

		expect(authorizations).toEqual([
			"Bearer old-access-token",
			"Bearer new-access-token",
		]);
		expect(refreshTokens).toEqual(["old-refresh-token", "new-refresh-token"]);
	});

	it("세션 복구 정책을 설치하지 않으면 401을 갱신·재시도 없이 그대로 실패시킨다", async () => {
		const { customInstance } = await import("./customAxios");
		let callCount = 0;
		const adapter: AxiosAdapter = async (config) => {
			callCount += 1;
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

		// 로그인 UI(idp/web)처럼 정책 없이 쓰는 앱: 401(자격 증명 불일치)이
		// 호출자에게 그대로 전파되어야 하며 재시도하지 않는다.
		await expect(
			customInstance<{ ok: boolean }>(
				{ method: "POST", url: "/api/interaction/uid-1/login" },
				{ adapter },
			),
		).rejects.toMatchObject({ response: { status: 401 } });

		expect(callCount).toBe(1);
	});

	it("refreshSession 실패 시 onSessionExpired를 호출하고 원래 401을 전파한다", async () => {
		const { customInstance, installCoreSessionRecovery } = await import(
			"./customAxios"
		);
		const onSessionExpired = vi.fn();
		let callCount = 0;
		const adapter: AxiosAdapter = async (config) => {
			callCount += 1;
			throw createUnauthorizedError(config);
		};

		installCoreSessionRecovery({
			refreshSession: async () => {
				throw new Error("Session token refresh failed.");
			},
			onSessionExpired,
		});

		await expect(
			customInstance<{ ok: boolean }>(
				{ method: "GET", url: "/api/v1/templates" },
				{ adapter },
			),
		).rejects.toBeInstanceOf(Error);

		expect(onSessionExpired).toHaveBeenCalledTimes(1);
		expect(callCount).toBe(1);
	});

	it("동시 세션 갱신 호출은 단일 token/refresh 요청으로 병합한다", async () => {
		const { AXIOS_INSTANCE, refreshSessionTokens, setApiSessionScope } =
			await import("./customAxios");
		const store: SessionScopeStub = {
			accessToken: "stale-access-token",
			refreshToken: "stale-refresh-token",
			sessionId: "",
			tenantId: "tenant-id",
			accessTokenExpiresAt: 0,
			refreshTokenExpiresAt: 0,
		};
		let refreshCallCount = 0;
		const adapter: AxiosAdapter = async (config) => {
			if (config.url?.includes("/auth/token/refresh")) {
				refreshCallCount += 1;
				await new Promise((resolve) => setTimeout(resolve, 20));
				return {
					config,
					data: {
						data: {
							accessToken: "new-access-token",
							refreshToken: "new-refresh-token",
							sessionId: "admin-web.session-1",
							accessTokenExpiresAt: Date.now() + 1000,
							refreshTokenExpiresAt: Date.now() + 2000,
						},
					},
					headers: {},
					status: 200,
					statusText: "OK",
				};
			}

			throw new Error(`Unexpected request: ${config.url}`);
		};

		AXIOS_INSTANCE.defaults.adapter = adapter;
		setApiSessionScope(store);

		const [first, second] = await Promise.all([
			refreshSessionTokens(),
			refreshSessionTokens(),
		]);

		expect(first).toBe(true);
		expect(second).toBe(true);
		expect(refreshCallCount).toBe(1);
		expect(store.accessToken).toBe("new-access-token");
		expect(store.sessionId).toBe("admin-web.session-1");
	});
});
