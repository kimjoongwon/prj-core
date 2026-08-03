import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import {
	buildAuthLoginUrl,
	clearNativeAuthSession,
	clearNativeSpaceSelection,
	loadNativeAuthSession,
	loadNativeSpaceSelection,
	requestNativeLogin,
	requestNativeTokenRefresh,
	saveNativeAuthSession,
	saveNativeSpaceSelection,
} from "@/auth/_utils/auth";

const mockSecureStore = new Map<string, string>();

jest.mock("expo-secure-store", () => ({
	deleteItemAsync: jest.fn(async (key: string) => {
		mockSecureStore.delete(key);
	}),
	getItemAsync: jest.fn(async (key: string) => mockSecureStore.get(key) ?? null),
	setItemAsync: jest.fn(async (key: string, value: string) => {
		mockSecureStore.set(key, value);
	}),
}));

describe("mobile auth utils", () => {
	afterEach(() => {
		mockSecureStore.clear();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it("Android 환경변수 localhost auth API URL을 에뮬레이터 host로 보정해야 한다", () => {
		const originalAuthApiUrl = process.env.EXPO_PUBLIC_AUTH_API_BASE_URL;
		jest.replaceProperty(Platform, "OS", "android");
		process.env.EXPO_PUBLIC_AUTH_API_BASE_URL = "http://localhost:3006";

		try {
			const loginUrl = buildAuthLoginUrl({
				clientId: "user-mobile",
				targetReturnTo: "/",
			});

			expect(loginUrl).toBe(
				"http://10.0.2.2:3006/api/v1/auth/login",
			);
		} finally {
			if (originalAuthApiUrl === undefined) {
				delete process.env.EXPO_PUBLIC_AUTH_API_BASE_URL;
			} else {
				process.env.EXPO_PUBLIC_AUTH_API_BASE_URL = originalAuthApiUrl;
			}
		}
	});

	it("native 로그인 요청은 JSON body로 credential을 전달해야 한다", async () => {
		const originalFetch = global.fetch;
		const session = {
			accessToken: "native-access-token",
			refreshToken: "native-refresh-token",
			sessionId: "user-mobile.session-1",
			accessTokenExpiresAt: 1000,
			refreshTokenExpiresAt: 2000,
		};
		const fetchMock = jest.fn().mockResolvedValue({
			headers: {
				get: (key: string) =>
					key.toLowerCase() === "content-type" ? "application/json" : null,
			},
			json: jest.fn().mockResolvedValue({ data: session }),
			ok: true,
			status: 200,
		});
		global.fetch = fetchMock as unknown as typeof fetch;

		try {
			const result = await requestNativeLogin({
				apiBaseUrl: "http://localhost:3006",
				email: "user@example.com",
				password: "password123",
			});

			expect(fetchMock).toHaveBeenCalledWith(
				"http://localhost:3006/api/v1/auth/login",
				expect.objectContaining({
					body: JSON.stringify({
						email: "user@example.com",
						password: "password123",
					}),
					method: "POST",
				}),
			);
			expect(result).toEqual(session);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it("native refresh 요청은 sessionId와 refreshToken을 전달해야 한다", async () => {
		const originalFetch = global.fetch;
		const session = {
			accessToken: "new-native-access-token",
			refreshToken: "new-native-refresh-token",
			sessionId: "user-mobile.session-1",
		};
		const fetchMock = jest.fn().mockResolvedValue({
			headers: {
				get: (key: string) =>
					key.toLowerCase() === "content-type" ? "application/json" : null,
			},
			json: jest.fn().mockResolvedValue({ data: session }),
			ok: true,
			status: 200,
		});
		global.fetch = fetchMock as unknown as typeof fetch;

		try {
			const result = await requestNativeTokenRefresh({
				apiBaseUrl: "http://localhost:3006",
				refreshToken: "native-refresh-token",
				sessionId: "user-mobile.session-1",
			});

			expect(fetchMock).toHaveBeenCalledWith(
				"http://localhost:3006/api/v1/auth/native/token/refresh",
				expect.objectContaining({
					body: JSON.stringify({
						sessionId: "user-mobile.session-1",
						refreshToken: "native-refresh-token",
					}),
					method: "POST",
				}),
			);
			expect(result).toEqual(session);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it("native 세션은 SecureStore에 저장하고 복원해야 한다", async () => {
		const session = {
			accessToken: "native-access-token",
			refreshToken: "native-refresh-token",
			sessionId: "user-mobile.session-1",
		};

		await saveNativeAuthSession(session);
		await expect(loadNativeAuthSession()).resolves.toEqual(session);

		await clearNativeAuthSession();
		await expect(loadNativeAuthSession()).resolves.toBeNull();
	});

	it("Given 피트니스센터 선택이 있을 때 When SecureStore에 저장하면 Then version 2 계약으로 복원한다", async () => {
		const selection = {
			address: "서울 강남구",
			contentLanguageCode: "ko_KR",
			fitnessCenterName: "강남점",
			imageFileId: "fitness-center-image",
			logoImageFileId: "company-logo",
			spaceId: "101",
			tenantId: "201",
		};

		await saveNativeSpaceSelection(selection);

		const persistedSelection = [...mockSecureStore.entries()].find(([key]) =>
			key.includes("space-selection"),
		);
		expect(JSON.parse(persistedSelection?.[1] ?? "{}")).toMatchObject({
			...selection,
			version: 2,
		});
		await expect(loadNativeSpaceSelection()).resolves.toEqual(selection);

		await clearNativeSpaceSelection();
		await expect(loadNativeSpaceSelection()).resolves.toBeNull();
	});

	it("Given version 없는 예전 선택이 있을 때 When SecureStore에서 복원하면 Then 값을 폐기한다", async () => {
		const storageKey = "onora.mobile.native.space-selection.v1";
		mockSecureStore.set(
			storageKey,
			JSON.stringify({
				fitnessCenterName: "강남점",
				spaceId: "101",
				tenantId: "201",
			}),
		);

		await expect(loadNativeSpaceSelection()).resolves.toBeNull();

		expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(storageKey);
		expect(mockSecureStore.has(storageKey)).toBe(false);
	});

	it("Given 이전 version 선택이 있을 때 When SecureStore에서 복원하면 Then 값을 폐기한다", async () => {
		const storageKey = "onora.mobile.native.space-selection.v1";
		mockSecureStore.set(
			storageKey,
			JSON.stringify({
				fitnessCenterName: "강남점",
				spaceId: "101",
				tenantId: "201",
				version: 1,
			}),
		);

		await expect(loadNativeSpaceSelection()).resolves.toBeNull();

		expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(storageKey);
		expect(mockSecureStore.has(storageKey)).toBe(false);
	});
});
