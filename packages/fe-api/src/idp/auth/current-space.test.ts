import {
	type AxiosAdapter,
	AxiosHeaders,
	type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("현재 Space API의 공용 클라이언트 연결", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it("서버 URL과 인증·Tenant 헤더, 쿠키 설정을 생성 클라이언트와 공유한다", async () => {
		vi.stubEnv("CORE_API_INTERNAL_URL", "http://core-api.test:3006");
		const { setApiSessionScope, setApiLocale } = await import(
			"../../libs/customAxios"
		);
		const { getCurrentSpace, setCurrentSpace } = await import(
			"./current-space"
		);
		const { getCurrentSpace: getGeneratedCurrentSpace } = await import(
			"./auth"
		);
		const capturedRequests: InternalAxiosRequestConfig[] = [];
		const adapter: AxiosAdapter = async (requestConfig) => {
			capturedRequests.push(requestConfig);
			return {
				config: requestConfig,
				data: { data: null },
				headers: {},
				status: 200,
				statusText: "OK",
			};
		};
		setApiSessionScope({
			accessToken: "test-access-token",
			refreshToken: "test-refresh-token",
			tenantId: "11",
		});
		setApiLocale({ languageCode: "ko_KR" });

		await expect(getCurrentSpace({ adapter })).resolves.toEqual({ data: null });
		await getGeneratedCurrentSpace({ adapter });
		await setCurrentSpace({ tenantId: "9223372036854775807" }, { adapter });

		expect(capturedRequests).toHaveLength(3);
		for (const requestConfig of capturedRequests) {
			expect(requestConfig).toMatchObject({
				url: "/api/v1/auth/current-space",
				baseURL: "http://core-api.test:3006",
				withCredentials: true,
				timeout: 10000,
			});
			const headers = AxiosHeaders.from(requestConfig.headers);
			expect(headers.get("Authorization")).toBe("Bearer test-access-token");
			expect(headers.get("x-refresh-token")).toBe("test-refresh-token");
			expect(headers.get("x-tenant-id")).toBe("11");
		}
		expect(
			capturedRequests.map((requestConfig) => requestConfig.method),
		).toEqual(["get", "get", "post"]);
		expect(JSON.parse(capturedRequests[2]?.data)).toEqual({
			tenantId: "9223372036854775807",
		});
	});

	it("브라우저에서는 같은 origin의 상대 경로와 쿠키 인증을 사용한다", async () => {
		vi.stubGlobal("window", {});
		const { getCurrentSpace } = await import("./current-space");
		const adapter: AxiosAdapter = async (requestConfig) => {
			expect(requestConfig.baseURL).toBeUndefined();
			expect(requestConfig.url).toBe("/api/v1/auth/current-space");
			expect(requestConfig.withCredentials).toBe(true);
			return {
				config: requestConfig,
				data: { data: null },
				headers: {},
				status: 200,
				statusText: "OK",
			};
		};

		await getCurrentSpace({ adapter });
	});

	it("호출자가 지정한 서버 URL과 Cookie 헤더를 보존한다", async () => {
		const { getCurrentSpace } = await import("./current-space");
		const adapter: AxiosAdapter = async (requestConfig) => {
			expect(requestConfig.baseURL).toBe("http://override.test");
			expect(AxiosHeaders.from(requestConfig.headers).get("Cookie")).toBe(
				"session=test-session",
			);
			return {
				config: requestConfig,
				data: { data: null },
				headers: {},
				status: 200,
				statusText: "OK",
			};
		};

		await getCurrentSpace({
			adapter,
			baseURL: "http://override.test",
			headers: { Cookie: "session=test-session" },
		});
	});
});
