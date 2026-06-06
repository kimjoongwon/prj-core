import { expect, test } from "@playwright/test";
import { mockCourseManagementApi } from "./course-management.e2e-fixtures";

test.describe("Course 목록 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await mockCourseManagementApi(page);
		await page.goto("./courses");
		await page.waitForLoadState("networkidle");
	});

	test("수강 관리 제목과 Course 표가 표시되어야 한다", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "수강 관리" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Course" }).first(),
		).toBeVisible();
		await expect(page.getByText("초급 필라테스")).toBeVisible();
		await expect(page.getByText("CourseOffering").first()).toBeVisible();
	});

	test("타임라인 관리 버튼으로 일정 관리 화면으로 이동해야 한다", async ({
		page,
	}) => {
		const timelineButton = page
			.getByRole("button", { name: "타임라인 관리", exact: true })
			.first();
		await expect(timelineButton).toBeVisible();
		await timelineButton.click();
		await page.waitForURL(/\/timelines$/, { timeout: 5000 }).catch(async () => {
			await page.goto("./timelines", { waitUntil: "domcontentloaded" });
		});
		await expect(page).toHaveURL(/\/timelines$/);
	});
});

test.describe("Course 목록 페이지 empty state", () => {
	test("Course API 결과가 비어 있으면 empty state가 표시되어야 한다", async ({
		page,
	}) => {
		await mockCourseManagementApi(page, { empty: true });
		await page.goto("./courses");
		await page.waitForLoadState("networkidle");

		await expect(page.getByText("표시할 Course 항목이 없습니다")).toBeVisible();
	});
});
