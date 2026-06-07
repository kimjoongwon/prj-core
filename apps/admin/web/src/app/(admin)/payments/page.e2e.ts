import { expect, test } from "@playwright/test";
import { mockPaymentManagementApi } from "./payment-management.e2e-fixtures";

test.describe("Payment 목록 페이지 @mock", () => {
	test.beforeEach(async ({ page }) => {
		await mockPaymentManagementApi(page);
		await page.goto("./payments");
		await page.waitForLoadState("networkidle");
	});

	test("결제 관리 제목과 Payment 표가 표시되어야 한다", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "결제 관리" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Payment" }).first(),
		).toBeVisible();
		await expect(
			page.getByText("강남점 2026 상반기 6개월반 결제"),
		).toBeVisible();
		await expect(page.getByText("course · CourseOffering")).toBeVisible();
		await expect(page.getByText("결제 완료", { exact: true })).toBeVisible();
	});
});

test.describe("Payment 목록 페이지 empty state @mock", () => {
	test("Payment API 결과가 비어 있으면 empty state가 표시되어야 한다", async ({
		page,
	}) => {
		await mockPaymentManagementApi(page, { empty: true });
		await page.goto("./payments");
		await page.waitForLoadState("networkidle");

		await expect(
			page.getByText("표시할 Payment 항목이 없습니다"),
		).toBeVisible();
	});
});
