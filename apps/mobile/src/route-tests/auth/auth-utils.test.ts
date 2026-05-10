import { Platform } from "react-native";
import { buildAuthLoginUrl, exchangeAuthCallback } from "@/auth/_utils/auth";

describe("mobile auth utils", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("Android 환경변수 localhost IDP API URL을 에뮬레이터 host로 보정해야 한다", () => {
		const originalIdpApiUrl = process.env.EXPO_PUBLIC_IDP_API_URL;
		jest.replaceProperty(Platform, "OS", "android");
		process.env.EXPO_PUBLIC_IDP_API_URL = "http://localhost:3007";

		try {
			const loginUrl = buildAuthLoginUrl({
				clientId: "user-mobile",
				prompt: "login",
				targetReturnTo: "/",
			});

			expect(loginUrl).toContain("http://10.0.2.2:3007/api/v1/auth/login?");
			expect(loginUrl).toContain("clientId=user-mobile");
			expect(loginUrl).toContain("prompt=login");
		} finally {
			if (originalIdpApiUrl === undefined) {
				delete process.env.EXPO_PUBLIC_IDP_API_URL;
			} else {
				process.env.EXPO_PUBLIC_IDP_API_URL = originalIdpApiUrl;
			}
		}
	});

	it("콜백 교환 요청은 세션 쿠키 저장을 포함해야 한다", async () => {
		const originalFetch = global.fetch;
		const fetchMock = jest.fn().mockResolvedValue({
			headers: {
				get: (key: string) =>
					key.toLowerCase() === "location"
						? "kr.co.cocdev.onoramobile://auth/callback?returnTo=/"
						: null,
			},
			ok: false,
			status: 302,
		});
		global.fetch = fetchMock as unknown as typeof fetch;

		try {
			const result = await exchangeAuthCallback({
				apiBaseUrl: "http://localhost:3007",
				code: "auth-code",
				state: "auth-state",
			});

			expect(fetchMock).toHaveBeenCalledWith(
				"http://localhost:3007/api/v1/auth/callback?clientId=user-mobile&code=auth-code&responseMode=mobile-json&state=auth-state",
				expect.objectContaining({
					credentials: "include",
					method: "GET",
					redirect: "manual",
				}),
			);
			expect(result.status).toBe("redirect");
		} finally {
			global.fetch = originalFetch;
		}
	});

	it("콜백 JSON 응답의 모바일 토큰을 결과에 포함해야 한다", async () => {
		const originalFetch = global.fetch;
		const session = {
			accessToken: "mobile-access-token",
			refreshToken: "mobile-refresh-token",
			accessTokenExpiresAt: 1000,
			refreshTokenExpiresAt: 2000,
		};
		const fetchMock = jest.fn().mockResolvedValue({
			headers: {
				get: (key: string) =>
					key.toLowerCase() === "content-type" ? "application/json" : null,
			},
			json: jest.fn().mockResolvedValue({
				data: session,
			}),
			ok: true,
			status: 200,
		});
		global.fetch = fetchMock as unknown as typeof fetch;

		try {
			const result = await exchangeAuthCallback({
				apiBaseUrl: "http://localhost:3007",
				code: "auth-code",
				state: "auth-state",
			});

			expect(result.status).toBe("ok");
			expect(result.session).toEqual(session);
		} finally {
			global.fetch = originalFetch;
		}
	});
});
