import { expect, test } from "@playwright/test";

test.describe("Subject 상세 페이지", () => {
	// ── E2E-008: Subject 필드 조회 (entity vs non-entity) ──

	test.describe("[E2E-008] Subject 필드 조회", () => {
		/**
		 * Subject 목록 API를 직접 호출하여 특정 이름의 Subject ID를 추출합니다.
		 * SSR prefetch로 인해 브라우저에서 API 호출이 발생하지 않으므로
		 * page.evaluate(fetch)를 사용합니다. (Subject API는 @Public)
		 */
		async function getSubjectIdByName(
			page: import("@playwright/test").Page,
			name: string,
		): Promise<string> {
			const subjectId = await page.evaluate(async (targetName) => {
				const resp = await fetch("/api/v1/subjects");
				const body = await resp.json();
				const subjects = (body.data ?? body) as {
					name: string;
					id: string;
				}[];
				const found = subjects.find((s) => s.name === targetName);
				return found?.id ?? null;
			}, name);
			if (!subjectId) {
				throw new Error(`Subject "${name}" not found in API response`);
			}
			return subjectId;
		}

		test("entity 그룹 Subject 상세에서 필드 목록이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: Subject ID 추출
			await page.goto("./subjects");
			await page.waitForLoadState("networkidle");
			const entityUserId = await getSubjectIdByName(page, "entity:User");

			// When: Subject 상세 페이지로 직접 이동
			await page.goto(`./subjects/${entityUserId}`);
			await page.waitForLoadState("networkidle");

			// Then: 기본 정보 섹션 표시
			await expect(page.getByText("기본 정보")).toBeVisible();
			await expect(page.getByText("entity:User")).toBeVisible();

			// Then: 필드 목록 섹션 표시
			await expect(page.getByText("필드 목록")).toBeVisible();

			// Then: 필드 테이블 컬럼 헤더
			await expect(page.getByText("필드명")).toBeVisible();
			await expect(page.getByText("타입")).toBeVisible();

			// Then: User 모델의 DMMF 필드가 표시됨 (email 등)
			await expect(page.getByText("email").first()).toBeVisible();
		});

		test("menu 그룹 Subject 상세에서 필드 없음 안내가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: Subject ID 추출
			await page.goto("./subjects");
			await page.waitForLoadState("networkidle");
			const menuDashboardId = await getSubjectIdByName(page, "menu:dashboard");

			// When: Subject 상세 페이지로 직접 이동
			await page.goto(`./subjects/${menuDashboardId}`);
			await page.waitForLoadState("networkidle");

			// Then: 기본 정보 섹션 표시
			await expect(page.getByText("기본 정보")).toBeVisible();

			// Then: 필드 없음 안내 메시지
			await expect(
				page.getByText(/Entity 기반이 아니므로 필드 정보가 없습니다/),
			).toBeVisible();
		});

		test("Subject 상세에서 목록으로 돌아갈 수 있어야 한다", async ({
			page,
		}) => {
			// Given: Subject ID 추출
			await page.goto("./subjects");
			await page.waitForLoadState("networkidle");
			const entityUserId = await getSubjectIdByName(page, "entity:User");

			// Given: Subject 상세 페이지
			await page.goto(`./subjects/${entityUserId}`);
			await page.waitForLoadState("networkidle");

			// When: 목록으로 버튼/링크 클릭
			const backButton = page
				.getByRole("button", { name: "목록으로" })
				.or(page.getByRole("link", { name: "목록으로" }));
			await backButton.click();
			await page.waitForLoadState("networkidle");

			// Then: 목록 페이지로 이동
			await expect(
				page.getByRole("heading", { name: "Subject 목록" }),
			).toBeVisible();
		});
	});
});
