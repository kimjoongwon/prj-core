import { readFileSync } from "node:fs";
import { getAdminStorageStatePath } from "./admin-storage-state-path";

/** Playwright Admin storage state의 최소 계약입니다. */
export interface AdminStorageState {
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

/**
 * 현재 실행 환경의 Admin Playwright storage state를 읽습니다.
 *
 * @returns 파싱된 storage state
 */
export function readAdminStorageState(): AdminStorageState {
	const raw = readFileSync(getAdminStorageStatePath(), "utf8");
	return JSON.parse(raw) as AdminStorageState;
}

/**
 * Playwright storage state에서 Admin persist JSON을 찾습니다.
 *
 * @param storageState 조회할 Playwright storage state
 * @returns admin-persist JSON, 없으면 undefined
 */
export function findAdminPersistRaw(storageState: AdminStorageState) {
	for (const origin of storageState.origins ?? []) {
		const persistEntry = origin.localStorage?.find(
			(entry) => entry.name === "admin-persist",
		);
		if (persistEntry?.value) {
			return persistEntry.value;
		}
	}

	return undefined;
}
