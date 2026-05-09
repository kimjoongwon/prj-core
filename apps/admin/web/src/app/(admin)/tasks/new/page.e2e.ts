import { expect, type Page, test } from "@playwright/test";

const SPACE_ID = "61ddca20-1752-466e-b4da-879ebdbe54e3";

const EN_MESSAGES = {
	"태스크 등록": "Create task",
	"새로운 태스크와 운동 detail을 등록합니다.":
		"Create a new task and exercise detail.",
	"기본 정보": "Basic information",
	"현재 Space 콘텐츠 언어": "Current Space content language",
	운동명: "Exercise name",
	"운동 이름을 입력하세요": "Enter exercise name",
	지속시간: "Duration",
	분: "min",
	초: "sec",
	반복횟수: "Repetitions",
	설명: "Description",
	"대표 이미지": "Main image",
	"운동 카드와 상세 화면에서 먼저 보일 이미지를 선택합니다.":
		"Select the image shown first on exercise cards and detail screens.",
	"이미지 에셋을 선택하면 여기서 바로 미리보기를 확인할 수 있습니다.":
		"Select an image asset to preview it here.",
	"운동 영상": "Exercise video",
	"루틴 편성과 프로그램 생성에는 영상이 연결된 운동이 필요합니다.":
		"Routine scheduling and program creation require an exercise with a video.",
	"영상 에셋을 선택하면 루틴 카드에서 영상 썸네일로 활용됩니다.":
		"Select a video asset to use it as the routine card video thumbnail.",
	"에셋에서 선택": "Choose from assets",
	해제: "Clear",
	"스케줄 가능 상태": "Schedulable status",
	불가: "Unavailable",
	가능: "Available",
	"영상 파일 ID가 입력된 Exercise만 루틴 편성 및 Program 생성에 사용할 수 있습니다.":
		"Only exercises with a video file ID can be used for routine scheduling and program creation.",
	"이미지 에셋 선택": "Select image asset",
	"대표 이미지로 사용할 에셋을 선택하거나 업로드하고 폴더를 정리할 수 있습니다.":
		"Select or upload an asset to use as the cover image and organize folders.",
	"파일명 검색...": "Search filename...",
	"등록된 에셋이 없습니다.": "No assets have been registered.",
	업로드: "Upload",
	"폴더 생성": "Create folder",
	취소: "Cancel",
	저장: "Save",
};

test.describe("태스크 등록 i18n", () => {
	test.beforeEach(async ({ page }) => {
		await mockAdminTaskCreateShell(page);
	});

	test("선택 언어 catalog 기준으로 정적 문구가 번역되어야 한다", async ({
		page,
	}) => {
		await page.route("**/api/v1/i18n/catalog/en_US", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					data: {
						languageCode: "en_US",
						messages: EN_MESSAGES,
					},
				}),
			});
		});
		await page.addInitScript(() => {
			window.localStorage.setItem(
				"admin-persist:locale",
				JSON.stringify({ languageCode: "en_US" }),
			);
		});

		await page.goto("./tasks/new", { waitUntil: "domcontentloaded" });

		await expect(
			page.getByRole("heading", { name: "Create task" }),
		).toBeVisible({ timeout: 30000 });
		await expect(
			page.getByText("Create a new task and exercise detail."),
		).toBeVisible();
		await expect(
			page.getByText("Current Space content language"),
		).toBeVisible();
		await expect(page.getByLabel("Exercise name")).toBeVisible();
		await expect(page.getByText("Duration")).toBeVisible();
		await expect(page.getByText("Main image")).toBeVisible();
		await expect(page.getByText("Exercise video")).toBeVisible();
		await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
	});

	test("에셋 picker modal도 선택 언어 catalog 기준으로 번역되어야 한다", async ({
		page,
	}) => {
		await page.route("**/api/v1/i18n/catalog/en_US", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					data: {
						languageCode: "en_US",
						messages: EN_MESSAGES,
					},
				}),
			});
		});
		await page.addInitScript(() => {
			window.localStorage.setItem(
				"admin-persist:locale",
				JSON.stringify({ languageCode: "en_US" }),
			);
		});

		await page.goto("./tasks/new", { waitUntil: "domcontentloaded" });
		await page
			.getByRole("button", { name: "Choose from assets" })
			.first()
			.click();

		await expect(
			page.getByRole("heading", { name: "Select image asset" }),
		).toBeVisible({ timeout: 30000 });
		await expect(page.getByPlaceholder("Search filename...")).toBeVisible();
	});
});

async function mockAdminTaskCreateShell(page: Page) {
	await page.addInitScript(
		({ spaceId }) => {
			window.localStorage.setItem(
				"admin-persist",
				JSON.stringify({
					spaceId,
					groundName: "플랫폼 운영본부",
					contentLanguageCode: "ko_KR",
					spaces: [
						{
							spaceId,
							groundName: "플랫폼 운영본부",
							contentLanguageCode: "ko_KR",
						},
					],
					accessTokenExpiresAt: Date.now() + 60 * 60 * 1000,
					refreshTokenExpiresAt: Date.now() + 2 * 60 * 60 * 1000,
				}),
			);
		},
		{ spaceId: SPACE_ID },
	);
	await page.route("**/api/v1/auth/verify-token**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					valid: true,
					hasFullAccess: true,
				},
			}),
		});
	});
	await page.route("**/api/v1/auth/current-space**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					id: SPACE_ID,
					contentLanguageCode: "ko_KR",
					ground: { name: "플랫폼 운영본부" },
				},
			}),
		});
	});
	await page.route("**/api/v1/auth/my-spaces**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [
					{
						id: SPACE_ID,
						contentLanguageCode: "ko_KR",
						ground: { name: "플랫폼 운영본부" },
					},
				],
			}),
		});
	});
	await page.route("**/api/v1/auth/token/refresh**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					accessToken: "stub-access-token",
					refreshToken: "stub-refresh-token",
					accessTokenExpiresAt: Date.now() + 60 * 60 * 1000,
					refreshTokenExpiresAt: Date.now() + 2 * 60 * 60 * 1000,
				},
			}),
		});
	});
	await page.route("**/api/v1/abilities**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [],
				meta: { total: 0 },
			}),
		});
	});
	await page.route("**/api/v1/assets**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [],
				meta: {
					total: 0,
					skip: 0,
					take: 20,
					totalPages: 1,
				},
			}),
		});
	});
	await page.route("**/api/v1/folders**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [],
				meta: { total: 0 },
			}),
		});
	});
}
