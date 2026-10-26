import * as SecureStore from "expo-secure-store";
import {
	clearNativeAuthSession,
	clearNativeSpaceSelection,
	loadNativeAuthSession,
	loadNativeSpaceSelection,
	rewriteLocalhostUrlForAndroidEmulator,
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

	it("Android 환경의 localhost URL을 에뮬레이터 host로 보정해야 한다", () => {
		expect(
			rewriteLocalhostUrlForAndroidEmulator(
				"http://localhost:3006/oidc/token",
				"android",
			),
		).toBe("http://10.0.2.2:3006/oidc/token");
		expect(
			rewriteLocalhostUrlForAndroidEmulator("http://api.example.com", "android"),
		).toBe("http://api.example.com");
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
		const storageKey = "plate.mobile.native.space-selection.v1";
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
		const storageKey = "plate.mobile.native.space-selection.v1";
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
