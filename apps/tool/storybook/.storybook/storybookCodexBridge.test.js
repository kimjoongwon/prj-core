import { describe, expect, it } from "vitest";
import {
	buildCodexExecutionPrompt,
	collectAllowedJobChanges,
	createCodexBranchName,
	sanitizeCodexTargetFile,
} from "./storybookCodexBridge.js";

describe("storybookCodexBridge", () => {
	it("keeps only repo-local spec files inside the approved prefixes", () => {
		expect(
			sanitizeCodexTargetFile(
				"apps/admin/web/src/app/(admin)/roles/page.spec.md",
				"/repo",
			),
		).toBe("apps/admin/web/src/app/(admin)/roles/page.spec.md");
		expect(
			sanitizeCodexTargetFile(
				"packages/fe-ui/src/screen/AdminRolesPage/AdminRolesPage.spec.md",
				"/repo",
			),
		).toBe(
			"packages/fe-ui/src/screen/AdminRolesPage/AdminRolesPage.spec.md",
		);
		expect(
			sanitizeCodexTargetFile("../packages/fe-ui/src/screen/Bad.spec.md", "/repo"),
		).toBeNull();
		expect(
			sanitizeCodexTargetFile("apps/core/api/src/users.service.ts", "/repo"),
		).toBeNull();
	});

	it("builds a stable docs/storybook-codex branch name", () => {
		expect(
			createCodexBranchName("Admin Roles Page", new Date("2026-04-15T10:42:00Z")),
		).toBe("docs/storybook-codex/admin-roles-page-202604151942");
	});

	it("rejects disallowed and unsupported git status entries", () => {
		expect(
			collectAllowedJobChanges(
				[
					" M apps/admin/web/src/app/(admin)/roles/page.spec.md",
					" M packages/fe-ui/src/screen/AdminRolesPage/AdminRolesPage.spec.md",
					"?? packages/fe-ui/src/screen/AdminUsersPage/AdminUsersPage.spec.md",
					" D apps/admin/web/src/app/(admin)/users/page.spec.md",
				].join("\n"),
				[
					"apps/admin/web/src/app/(admin)/roles/page.spec.md",
					"packages/fe-ui/src/screen/AdminRolesPage/AdminRolesPage.spec.md",
				],
			),
		).toEqual({
			invalidFiles: [
				"packages/fe-ui/src/screen/AdminUsersPage/AdminUsersPage.spec.md",
				"apps/admin/web/src/app/(admin)/users/page.spec.md",
			],
			touchedFiles: [
				"apps/admin/web/src/app/(admin)/roles/page.spec.md",
				"packages/fe-ui/src/screen/AdminRolesPage/AdminRolesPage.spec.md",
			],
			unsupportedChanges: [],
		});
	});

	it("builds a prompt that restricts Codex to the selected spec files", () => {
		const prompt = buildCodexExecutionPrompt({
			componentName: "AdminRolesPage",
			instruction: "역할 설명 문구를 최신 정책에 맞게 고쳐 주세요.",
			storyId: "screen-adminrolespage--default",
			storyTitle: "screen/AdminRolesPage",
			targetFiles: [
				"apps/admin/web/src/app/(admin)/roles/page.spec.md",
				"packages/fe-ui/src/screen/AdminRolesPage/AdminRolesPage.spec.md",
			],
		});

		expect(prompt).toContain("Modify only the allowed files above.");
		expect(prompt).toContain("apps/admin/web/src/app/(admin)/roles/page.spec.md");
		expect(prompt).toContain("packages/fe-ui/src/screen/AdminRolesPage/AdminRolesPage.spec.md");
		expect(prompt).toContain("author `codex`");
	});
});
