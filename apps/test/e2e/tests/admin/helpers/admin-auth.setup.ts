import path from "node:path";
import { test as setup } from "@playwright/test";
import { loginToAdmin } from "./login";

const AUTH_FILE = path.join(__dirname, ".auth", "admin.json");

setup("Admin OIDC 로그인", async ({ page }) => {
	await loginToAdmin(page);

	// 인증 상태 저장 (쿠키 + localStorage)
	await page.context().storageState({ path: AUTH_FILE });
});
