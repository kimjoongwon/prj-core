import { readAdminPersistAccessToken } from "./admin-persist";
import {
	type AdminStorageState,
	findAdminPersistRaw,
	readAdminStorageState,
} from "./admin-storage-state";

function findAdminPersistAccessToken(storageState: AdminStorageState) {
	return readAdminPersistAccessToken(findAdminPersistRaw(storageState) ?? null);
}

function findAccessTokenCookie(storageState: AdminStorageState) {
	return storageState.cookies?.find((cookie) => cookie.name === "accessToken")
		?.value;
}

/**
 * 저장된 Admin E2E 인증 상태에서 API 요청에 사용할 access token을 읽습니다.
 *
 * @returns Admin native access token
 */
export function getAdminAccessToken() {
	const storageState = readAdminStorageState();
	const accessToken =
		findAdminPersistAccessToken(storageState) ??
		findAccessTokenCookie(storageState);

	if (!accessToken) {
		throw new Error("Admin E2E access token was not found in storage state.");
	}

	return accessToken;
}
