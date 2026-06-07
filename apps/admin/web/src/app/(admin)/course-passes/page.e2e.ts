import { expect, test } from "@playwright/test";
import { mockCourseManagementApi } from "../courses/course-management.e2e-fixtures";

test.describe("CoursePass 목록 페이지 @mock", () => {
	test.beforeEach(async ({ page }) => {
		await mockCourseManagementApi(page);
		await page.goto("./course-passes");
		await page.waitForLoadState("networkidle");
	});

	test("CoursePass 표와 만료일이 표시되어야 한다", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "수강 관리" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "CoursePass" }).first(),
		).toBeVisible();
		await expect(
			page.getByRole("cell", { name: "6개월 수강권" }),
		).toBeVisible();
		await expect(page.getByText("2026.10.31")).toBeVisible();
	});
});
