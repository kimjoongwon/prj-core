import { afterEach, describe, expect, it, vi } from "vitest";

interface SessionScopeStub {
	accessToken: string;
	refreshToken: string;
	sessionId: string;
	tenantId: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
}

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

describe("customFetch", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it("세션 복구 정책의 refreshSession 이후 재시도 요청에 새 세션 헤더를 사용한다", async () => {
		const fetchMock = vi.fn<typeof fetch>();
		const {
			customFetch,
			installCoreSessionRecovery,
			setApiLocale,
			setApiSessionScope,
		} = await import("./customFetch");
		const store: SessionScopeStub = {
			accessToken: "old-access-token",
			refreshToken: "old-refresh-token",
			sessionId: "session-id",
			tenantId: "tenant-id",
			accessTokenExpiresAt: Date.now() - 1000,
			refreshTokenExpiresAt: Date.now() + 60000,
		};
		fetchMock.mockResolvedValueOnce(jsonResponse({}, 401));
		fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
		vi.stubGlobal("fetch", fetchMock);

		setApiSessionScope(store);
		setApiLocale({ languageCode: "ko_KR" });
		installCoreSessionRecovery({
			refreshSession: async () => {
				store.accessToken = "new-access-token";
				store.refreshToken = "new-refresh-token";
			},
		});

		await expect(
			customFetch<{ ok: boolean }>("/api/v1/templates", { method: "GET" }),
		).resolves.toEqual({ ok: true });

		expect(fetchMock).toHaveBeenCalledTimes(2);
		const firstHeaders = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
		const retriedHeaders = new Headers(fetchMock.mock.calls[1]?.[1]?.headers);
		expect(firstHeaders.get("Authorization")).toBe("Bearer old-access-token");
		expect(firstHeaders.get("x-refresh-token")).toBe("old-refresh-token");
		expect(retriedHeaders.get("Authorization")).toBe("Bearer new-access-token");
		expect(retriedHeaders.get("x-refresh-token")).toBe("new-refresh-token");
		expect(retriedHeaders.get("x-language")).toBe("ko_KR");
		expect(fetchMock.mock.calls[1]?.[1]?.credentials).toBe("include");
	});

	it("세션 복구 정책을 설치하지 않으면 401을 갱신·재시도 없이 그대로 실패시킨다", async () => {
		const fetchMock = vi.fn<typeof fetch>();
		const { ApiClientError, customFetch } = await import("./customFetch");
		fetchMock.mockResolvedValue(jsonResponse({}, 401));
		vi.stubGlobal("fetch", fetchMock);

		// 로그인 UI(idp/web)처럼 정책 없이 쓰는 앱: 401(자격 증명 불일치)이
		// 호출자에게 그대로 전파되어야 하며 재시도하지 않는다.
		const failure = await customFetch("/api/interaction/uid-1/login", {
			method: "POST",
		}).catch((error: unknown) => error);

		expect(failure).toBeInstanceOf(ApiClientError);
		expect(failure).toMatchObject({ status: 401 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("refreshSession 실패 시 onSessionExpired를 호출하고 갱신 에러를 전파한다", async () => {
		const fetchMock = vi.fn<typeof fetch>();
		const { customFetch, installCoreSessionRecovery } = await import(
			"./customFetch"
		);
		const onSessionExpired = vi.fn();
		fetchMock.mockResolvedValue(jsonResponse({}, 401));
		vi.stubGlobal("fetch", fetchMock);

		installCoreSessionRecovery({
			refreshSession: async () => {
				throw new Error("Session token refresh failed.");
			},
			onSessionExpired,
		});

		await expect(
			customFetch("/api/v1/templates", { method: "GET" }),
		).rejects.toThrow("Session token refresh failed.");

		expect(onSessionExpired).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("동시 세션 갱신 호출은 단일 token/refresh 요청으로 병합한다", async () => {
		const fetchMock = vi.fn<typeof fetch>();
		const { refreshSessionTokens, setApiSessionScope } = await import(
			"./customFetch"
		);
		const store: SessionScopeStub = {
			accessToken: "stale-access-token",
			refreshToken: "stale-refresh-token",
			sessionId: "",
			tenantId: "tenant-id",
			accessTokenExpiresAt: 0,
			refreshTokenExpiresAt: 0,
		};
		fetchMock.mockImplementation(async (input) => {
			const requestUrl = String(input);
			if (!requestUrl.includes("/auth/token/refresh")) {
				throw new Error(`Unexpected request: ${requestUrl}`);
			}
			await new Promise((resolve) => setTimeout(resolve, 20));
			return jsonResponse({
				data: {
					accessToken: "new-access-token",
					refreshToken: "new-refresh-token",
					sessionId: "admin-web.session-1",
					accessTokenExpiresAt: Date.now() + 1000,
					refreshTokenExpiresAt: Date.now() + 2000,
				},
			});
		});
		vi.stubGlobal("fetch", fetchMock);

		setApiSessionScope(store);

		const [first, second] = await Promise.all([
			refreshSessionTokens(),
			refreshSessionTokens(),
		]);

		expect(first).toBe(true);
		expect(second).toBe(true);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(store.accessToken).toBe("new-access-token");
		expect(store.sessionId).toBe("admin-web.session-1");
	});
});
