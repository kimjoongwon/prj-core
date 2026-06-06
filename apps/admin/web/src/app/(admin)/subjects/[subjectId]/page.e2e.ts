import { getAdminSpaceRequestHeaders } from "@cocrepo/e2e";
import { expect, type Page, test } from "@playwright/test";

const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const getSpaceHeaders = () => getAdminSpaceRequestHeaders(SYSTEM_SPACE_ID);

test.describe("Subject 상세 페이지", () => {
	// ── E2E-008: Subject 필드 조회 (entity vs non-entity) ──

	test.describe("[E2E-008] Subject 필드 조회", () => {
		interface SubjectListItem {
			id: string;
			name: string;
			group?: string;
		}

		interface SubjectFieldListItem {
			name: string;
		}

		/**
		 * Subject 목록 API를 직접 호출하여 조건에 맞는 Subject를 반환합니다.
		 * 브라우저 origin에 영향받지 않도록 admin APIRequestContext를 직접 사용합니다.
		 */
		async function getSubjectByGroup(
			page: Page,
			condition: "entity" | "non-entity",
		): Promise<SubjectListItem | null> {
			const resp = await page.request.get(
				"http://localhost:3000/api/v1/subjects",
				{ headers: getSpaceHeaders() },
			);
			const body = (await resp.json()) as {
				data?: SubjectListItem[];
			};
			const subjects = body.data ?? [];
			if (condition === "entity") {
				for (const subject of subjects.filter(
					(item) => item.group === "entity",
				)) {
					const fieldsResp = await page.request.get(
						`http://localhost:3000/api/v1/subjects/${subject.id}/fields`,
						{ headers: getSpaceHeaders() },
					);
					const fieldsBody = (await fieldsResp.json()) as {
						data?: SubjectFieldListItem[];
					};
					if ((fieldsBody.data ?? []).length > 0) {
						return subject;
					}
				}
			}

			const subject =
				condition === "entity"
					? (subjects.find((item) => item.group === "entity") ?? null)
					: (subjects.find((item) => item.group !== "entity") ?? null);

			return subject;
		}

		test("entity 그룹 Subject 상세에서 필드 목록이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: entity Subject 추출
			const entitySubject = await getSubjectByGroup(page, "entity");
			test.skip(
				!entitySubject,
				"entity Subject seed가 없어 검증할 수 없습니다.",
			);
			await page.route("**/api/v1/subjects/**/fields", async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: [
							{
								name: "email",
								displayName: "이메일",
								type: "String",
								isRequired: true,
								isRelation: false,
							},
						],
					}),
				});
			});

			// When: Subject 상세 페이지로 직접 이동
			await page.goto(`./subjects/${entitySubject!.id}`);
			await page.waitForLoadState("networkidle");

			// Then: 기본 정보 섹션 표시
			await expect(page.getByText("기본 정보")).toBeVisible();
			await expect(page.getByText(entitySubject!.name)).toBeVisible();

			// Then: 필드 목록 섹션 표시
			await expect(page.getByText("필드 목록")).toBeVisible();

			// Then: 필드 테이블 컬럼 헤더
			await expect(page.getByText("필드명")).toBeVisible();
			await expect(page.getByText("타입")).toBeVisible();

			// Then: 필드 목록 테이블 구조가 표시됨
			await expect(
				page.getByRole("columnheader", { name: "표시명" }),
			).toBeVisible();
		});

		test("menu 그룹 Subject 상세에서 필드 없음 안내가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: non-entity Subject 추출
			const nonEntitySubject = await getSubjectByGroup(page, "non-entity");
			test.skip(
				!nonEntitySubject,
				"non-entity Subject seed가 없어 검증할 수 없습니다.",
			);

			// When: Subject 상세 페이지로 직접 이동
			await page.goto(`./subjects/${nonEntitySubject!.id}`);
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
			// Given: entity Subject 추출
			const entitySubject = await getSubjectByGroup(page, "entity");
			test.skip(
				!entitySubject,
				"entity Subject seed가 없어 검증할 수 없습니다.",
			);

			// Given: Subject 상세 페이지
			await page.goto(`./subjects/${entitySubject!.id}`);
			await page.waitForLoadState("networkidle");

			// When: 목록으로 버튼/링크 클릭
			const backButton = page
				.getByRole("button", { name: "목록으로" })
				.or(page.getByRole("link", { name: "목록으로" }));
			await backButton.click();
			await page.waitForLoadState("networkidle");

			// Then: 목록 페이지로 이동
			await expect(
				page.getByRole("heading", { name: "권한 대상 목록" }),
			).toBeVisible();
		});
	});
});
