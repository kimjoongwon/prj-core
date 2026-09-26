import { afterEach, describe, expect, it, vi } from "vitest";

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

describe("현재 Space API의 공용 클라이언트 연결", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it("서버 URL과 인증·Tenant 헤더, 쿠키 설정을 생성 클라이언트와 공유한다", async () => {
		vi.stubEnv("CORE_API_INTERNAL_URL", "http://core-api.test:3006");
		const { setApiSessionScope, setApiLocale } = await import(
			"../../libs/customFetch"
		);
		const { getCurrentSpace, setCurrentSpace } = await import(
			"./current-space"
		);
		const { getCurrentSpace: getGeneratedCurrentSpace } = await import(
			"./auth"
		);
		const capturedRequests: Array<{ url: string; init: RequestInit }> = [];
		const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
			capturedRequests.push({ url: String(input), init: init ?? {} });
			return jsonResponse({ data: null });
		});
		vi.stubGlobal("fetch", fetchMock);
		setApiSessionScope({
			accessToken: "test-access-token",
			refreshToken: "test-refresh-token",
			tenantId: "11",
		});
		setApiLocale({ languageCode: "ko_KR" });

		await expect(getCurrentSpace()).resolves.toEqual({ data: null });
		await getGeneratedCurrentSpace();
		await setCurrentSpace({ tenantId: "9223372036854775807" });

		expect(capturedRequests).toHaveLength(3);
		for (const { url, init } of capturedRequests) {
			expect(url).toBe("http://core-api.test:3006/api/v1/auth/current-space");
			expect(init.credentials).toBe("include");
			const headers = new Headers(init.headers);
			expect(headers.get("Authorization")).toBe("Bearer test-access-token");
			expect(headers.get("x-refresh-token")).toBe("test-refresh-token");
			expect(headers.get("x-tenant-id")).toBe("11");
			expect(headers.get("x-language")).toBe("ko_KR");
		}
		expect(capturedRequests.map(({ init }) => init.method)).toEqual([
			"GET",
			"GET",
			"POST",
		]);
		expect(JSON.parse(String(capturedRequests[2]?.init.body))).toEqual({
			tenantId: "9223372036854775807",
		});
	});

	it("브라우저에서는 같은 origin의 상대 경로와 쿠키 인증을 사용한다", async () => {
		vi.stubGlobal("window", {});
		const { getCurrentSpace } = await import("./current-space");
		const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
			expect(String(input)).toBe("/api/v1/auth/current-space");
			expect(init?.credentials).toBe("include");
			return jsonResponse({ data: null });
		});
		vi.stubGlobal("fetch", fetchMock);

		await getCurrentSpace();
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("호출자가 지정한 서버 URL과 Cookie 헤더를 보존한다", async () => {
		// 브라우저/RN 환경(window 존재)에서는 setApiBaseUrl의 값이 요청 URL이 된다.
		vi.stubGlobal("window", {});
		const { setApiBaseUrl } = await import("../../libs/customFetch");
		const { getCurrentSpace } = await import("./current-space");
		const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
			expect(String(input)).toBe("http://override.test/api/v1/auth/current-space");
			expect(new Headers(init?.headers).get("Cookie")).toBe(
				"session=test-session",
			);
			return jsonResponse({ data: null });
		});
		vi.stubGlobal("fetch", fetchMock);

		setApiBaseUrl("http://override.test");
		await getCurrentSpace({ headers: { Cookie: "session=test-session" } });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
