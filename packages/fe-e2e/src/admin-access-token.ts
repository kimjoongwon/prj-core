import { readFileSync } from "node:fs";
import { readAdminPersistAccessToken } from "./admin-persist";
import { getAdminStorageStatePath } from "./admin-storage-state-path";

interface StorageState {
	cookies?: Array<{
		name?: string;
		value?: string;
	}>;
	origins?: Array<{
		localStorage?: Array<{
			name?: string;
			value?: string;
		}>;
	}>;
}

function readStorageState() {
	const raw = readFileSync(getAdminStorageStatePath(), "utf8");

	return JSON.parse(raw) as StorageState;
}

function findAdminPersistAccessToken(storageState: StorageState) {
	for (const origin of storageState.origins ?? []) {
		const persistEntry = origin.localStorage?.find(
			(entry) => entry.name === "admin-persist",
		);
		if (!persistEntry?.value) {
			continue;
		}

		const accessToken = readAdminPersistAccessToken(persistEntry.value);
		if (accessToken) {
			return accessToken;
		}
	}

	return undefined;
}

function findAccessTokenCookie(storageState: StorageState) {
	return storageState.cookies?.find((cookie) => cookie.name === "accessToken")
		?.value;
}

/**
 * 저장된 Admin E2E 인증 상태에서 API 요청에 사용할 access token을 읽습니다.
 *
 * @returns Admin native access token
 */
export function getAdminAccessToken() {
	const storageState = readStorageState();
	const accessToken =
		findAdminPersistAccessToken(storageState) ??
		findAccessTokenCookie(storageState);

	if (!accessToken) {
		throw new Error("Admin E2E access token was not found in storage state.");
	}

	return accessToken;
}
