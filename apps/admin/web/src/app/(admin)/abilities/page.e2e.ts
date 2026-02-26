import { expect, test } from "@playwright/test";

test.describe("권한 목록 페이지", () => {
	// ── E2E-003: 목록 렌더링 ──

	test.describe("[E2E-003] 목록 렌더링", () => {
		test("권한 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지 진입
			await page.goto("./abilities");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "권한 목록" }),
			).toBeVisible();
		});

		test("권한 추가 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지 진입
			await page.goto("./abilities");
			await page.waitForLoadState("networkidle");

			// Then: 권한 추가 버튼 확인
			await expect(
				page.getByRole("button", { name: "권한 추가" }),
			).toBeVisible();
		});

		test("권한 목록에 시드 데이터가 표시되어야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지 진입
			await page.goto("./abilities");
			await page.waitForLoadState("networkidle");

			// Then: 시드 데이터 권한 항목 확인
			await expect(page.getByText("Can 조회 콘텐츠")).toBeVisible();

			// Then: 총 건수 표시
			await expect(page.getByText("총")).toBeVisible();
		});
	});

	// ── E2E-003: 등록 폼 ──

	test.describe("[E2E-003] 등록 폼", () => {
		test("권한 등록 페이지에서 폼이 렌더링되어야 한다", async ({ page }) => {
			// Given: 권한 등록 페이지 진입
			await page.goto("./abilities/new");
			await page.waitForLoadState("networkidle");

			// Then: 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "권한 등록" }),
			).toBeVisible();

			// Then: CASL 정보 섹션의 Subject/Action 드롭다운 확인
			await expect(page.getByRole("button", { name: /Subject/ })).toBeVisible();
			await expect(page.getByRole("button", { name: /Action/ })).toBeVisible();
		});
	});

	// ── E2E-006: 거부 규칙(inverted) 등록 ──

	test.describe("[E2E-006] 거부 규칙(inverted)", () => {
		test("등록 폼에서 inverted 관련 UI가 존재해야 한다", async ({ page }) => {
			// Given: 권한 등록 페이지
			await page.goto("./abilities/new");
			await page.waitForLoadState("networkidle");

			// Then: "거부 권한 (cannot)" 텍스트와 스위치 확인
			await expect(page.getByText("거부 권한")).toBeVisible();
		});
	});

	// ── 필터 기능 ──

	test.describe("필터 기능", () => {
		test("검색 입력란이 존재해야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지
			await page.goto("./abilities");
			await page.waitForLoadState("networkidle");

			// Then: 검색 입력란 확인
			await expect(
				page.getByRole("textbox", { name: "권한 이름 검색" }),
			).toBeVisible();
		});

		test("Subject/Action/유형 필터가 존재해야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지
			await page.goto("./abilities");
			await page.waitForLoadState("networkidle");

			// Then: 필터 버튼 확인
			await expect(
				page.getByRole("button", { name: "Subject 선택" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "Action 선택" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "유형 선택" }),
			).toBeVisible();
		});
	});
});
