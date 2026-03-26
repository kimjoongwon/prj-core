import path from "node:path";
import { mkdirSync } from "node:fs";
import { test as setup } from "@playwright/test";
import { loginToAdmin } from "./login";

const AUTH_FILE = path.join(
	__dirname,
	".auth",
	process.env.E2E_ENV ?? "local",
	"admin.json",
);

setup.setTimeout(120000);

setup("Admin OIDC 로그인", async ({ page }) => {
	await loginToAdmin(page);

	// 인증 상태 저장 (쿠키 + localStorage). 일부 환경에서는 prewarm 이후 SSE가 유지되어
	// storageState가 지연될 수 있으므로 빈 문서로 이동해 네트워크 대기를 정리한다.
	const context = page.context();
	await page.goto("about:blank");
	mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
	await context.storageState({ path: AUTH_FILE });
});
