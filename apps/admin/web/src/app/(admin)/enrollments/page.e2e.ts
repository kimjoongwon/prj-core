import { expect, test } from "@playwright/test";
import { mockCourseApi } from "../courses/course.e2e-fixtures";

test.describe("Enrollment 목록 페이지 @mock", () => {
	test.beforeEach(async ({ page }) => {
		await mockCourseApi(page);
		await page.goto("./enrollments");
		await page.waitForLoadState("networkidle");
	});

	test("Enrollment 표와 결제 상태가 표시되어야 한다", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "수강 관리" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Enrollment" }).first(),
		).toBeVisible();
		await expect(page.getByText("김철수")).toBeVisible();
		await expect(page.getByText("결제 완료")).toBeVisible();
	});
});
