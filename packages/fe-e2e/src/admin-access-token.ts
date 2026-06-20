import { readFileSync } from "node:fs";
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

interface AdminPersistSnapshot {
	accessToken?: unknown;
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

		const parsed = JSON.parse(persistEntry.value) as AdminPersistSnapshot;
		if (
			typeof parsed.accessToken === "string" &&
			parsed.accessToken.length > 0
		) {
			return parsed.accessToken;
		}
	}

	return undefined;
}

function findAccessTokenCookie(storageState: StorageState) {
	return storageState.cookies?.find((cookie) => cookie.name === "accessToken")
		?.value;
}

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
