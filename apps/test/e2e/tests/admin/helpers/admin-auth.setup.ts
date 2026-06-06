import path from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { test as setup } from "@playwright/test";
import { loginToAdmin, prewarmAdminRoutes, readAdminPersist } from "./login";

const AUTH_FILE = path.join(
	__dirname,
	".auth",
	process.env.E2E_ENV ?? "local",
	"admin.json",
);
const ADMIN_ORIGIN = new URL(
	process.env.E2E_ADMIN_BASE_URL ?? "http://localhost:3000/admin/",
).origin;
const ADMIN_PERSIST_KEY = "admin-persist";

setup.setTimeout(120000);

setup("Admin native 로그인", async ({ page }) => {
	await loginToAdmin(page);
	await prewarmAdminRoutes(page);
	const adminPersist = await readAdminPersist(page);

	if (!adminPersist) {
		throw new Error("admin-persist localStorage를 읽지 못했습니다.");
	}

	// 인증 상태 저장 (쿠키 + localStorage). 일부 환경에서는 prewarm 이후 SSE가 유지되어
	// storageState가 지연될 수 있으므로 빈 문서로 이동해 네트워크 대기를 정리한다.
	const context = page.context();
	await page.goto("about:blank");
	mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
	const storageState = await context.storageState();
	const originIndex = storageState.origins.findIndex(
		(originState) => originState.origin === ADMIN_ORIGIN,
	);
	const nextLocalStorageEntry = {
		name: ADMIN_PERSIST_KEY,
		value: JSON.stringify(adminPersist),
	};

	if (originIndex >= 0) {
		const existingOriginState = storageState.origins[originIndex];
		const nextLocalStorage = existingOriginState.localStorage.filter(
			(entry) => entry.name !== ADMIN_PERSIST_KEY,
		);
		nextLocalStorage.push(nextLocalStorageEntry);
		storageState.origins[originIndex] = {
			...existingOriginState,
			localStorage: nextLocalStorage,
		};
	} else {
		storageState.origins.push({
			origin: ADMIN_ORIGIN,
			localStorage: [nextLocalStorageEntry],
		});
	}

	writeFileSync(AUTH_FILE, JSON.stringify(storageState, null, 2));
});
