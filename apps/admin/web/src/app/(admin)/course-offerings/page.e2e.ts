import { expect, test } from "@playwright/test";
import { mockCourseManagementApi } from "../courses/course-management.e2e-fixtures";

test.describe("CourseOffering 목록 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await mockCourseManagementApi(page);
		await page.goto("./course-offerings");
		await page.waitForLoadState("networkidle");
	});

	test("CourseOffering 표와 Timeline 연결이 표시되어야 한다", async ({
		page,
	}) => {
		await expect(
			page.getByRole("heading", { name: "수강 관리" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "CourseOffering" }).first(),
		).toBeVisible();
		await expect(page.getByText("강남점 2026 상반기 6개월반")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "월수금 19:00" }).first(),
		).toBeVisible();
	});
});
