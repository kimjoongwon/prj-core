import type { Page } from "../../../../test/e2e/node_modules/@playwright/test";
import playwrightTest from "../../../../test/e2e/node_modules/@playwright/test/index.js";

type PlaywrightTestModule =
	typeof import("../../../../test/e2e/node_modules/@playwright/test");

const test = playwrightTest;
const expect = (playwrightTest as unknown as PlaywrightTestModule).expect;

const DEFAULT_STORYBOOK_BASE_URL =
	process.env.E2E_STORYBOOK_BASE_URL ?? "http://localhost:6006/";
const DEFAULT_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
const DEFAULT_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
const STORY_PATH = "/?path=/story/widget-authcard--default";

function getStorybookBaseUrl() {
	return new URL(DEFAULT_STORYBOOK_BASE_URL);
}

function buildStorybookUrl(path: string) {
	return new URL(path, getStorybookBaseUrl()).toString();
}

function isTargetStoryUrl(url: URL) {
	const target = new URL(STORY_PATH, getStorybookBaseUrl());

	return (
		url.origin === target.origin &&
		url.pathname === target.pathname &&
		url.searchParams.get("path") === target.searchParams.get("path")
	);
}

async function gotoLoginShell(page: Page) {
	await page.goto(STORY_PATH, { waitUntil: "domcontentloaded" });
	await expect(page).toHaveURL(/\/__storybook_auth\/login\?/);
	await expect(
		page.getByRole("heading", { name: "Sign in to unlock Storybook" }),
	).toBeVisible();
}

async function getIdpLoginEntryPath(page: Page) {
	const continueLink = page.getByRole("link", { name: "Continue with IDP" });
	await expect(continueLink).toBeVisible();

	const href = await continueLink.getAttribute("href");
	if (!href) {
		throw new Error("Storybook login shell did not render an IDP entry link.");
	}

	const entryUrl = new URL(href, getStorybookBaseUrl());
	return `${entryUrl.pathname}${entryUrl.search}`;
}

async function completeStorybookOidcLogin(page: Page) {
	const deadline = Date.now() + 60000;

	while (Date.now() < deadline) {
		if (isTargetStoryUrl(new URL(page.url()))) {
			return;
		}

		const loginButton = page.getByRole("button", { name: "로그인" });
		if (await loginButton.isVisible().catch(() => false)) {
			await page.getByLabel("이메일").clear();
			await page.getByLabel("이메일").fill(DEFAULT_EMAIL);
			await page.getByLabel("비밀번호").clear();
			await page.getByLabel("비밀번호").fill(DEFAULT_PASSWORD);
			await loginButton.click();
			await page.waitForTimeout(250);
			continue;
		}

		const allowButton = page.getByRole("button", { name: "허용" });
		if (await allowButton.isVisible().catch(() => false)) {
			await allowButton.click();
			await page.waitForTimeout(250);
			continue;
		}

		await page.waitForTimeout(250);
	}

	throw new Error("Storybook OIDC login did not return to the target story.");
}

test.describe("Storybook 로그인 셸", () => {
	test("보호된 스토리 진입 시 generic auth endpoint로 연결되어야 한다", async ({
		page,
	}) => {
		await gotoLoginShell(page);

		const entryPath = await getIdpLoginEntryPath(page);
		const entryUrl = new URL(entryPath, getStorybookBaseUrl());

		expect(entryUrl.pathname).toBe("/api/v1/auth/login");
		expect(entryUrl.searchParams.get("clientId")).toBe("storybook");
		expect(entryUrl.searchParams.get("returnTo")).toBe(
			buildStorybookUrl(STORY_PATH),
		);
	});

	test("로그인 후 원래 스토리로 복귀하고 세션이 인증되어야 한다", async ({
		page,
	}) => {
		test.slow();

		await gotoLoginShell(page);
		const entryPath = await getIdpLoginEntryPath(page);

		await page.goto(entryPath);
		await completeStorybookOidcLogin(page);

		await expect(page).toHaveURL(buildStorybookUrl(STORY_PATH));
		await expect(
			page.getByRole("link", { name: "Skip to canvas" }),
		).toBeVisible();
		await expect(page.locator("#storybook-preview-iframe")).toHaveAttribute(
			"src",
			/iframe\.html\?viewMode=story&id=widget-authcard--default/,
		);

		const session = await page.evaluate(async () => {
			const response = await fetch("/__storybook_auth/session", {
				credentials: "include",
				cache: "no-store",
			});
			const body = await response.json();
			return {
				status: response.status,
				authenticated: body?.authenticated ?? false,
				valid: body?.data?.valid ?? false,
			};
		});

		expect(session.status).toBe(200);
		expect(session.authenticated).toBe(true);
		expect(session.valid).toBe(true);
	});
});
