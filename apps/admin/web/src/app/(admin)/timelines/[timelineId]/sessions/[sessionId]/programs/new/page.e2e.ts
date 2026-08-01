import { getAdminSpaceRequestHeaders, loginToConsole } from "@cocrepo/e2e";
import { expect, type Locator, type Page, test } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api/v1";
const TEST_VIDEO_FILE_ID = "11111111-1111-4111-8111-111111111111";
const SYSTEM_TENANT_ID =
	process.env.E2E_SYSTEM_TENANT_ID ?? "01J00000000000000000000002";
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "01J00000000000000000000001";
const getSpaceHeaders = () => getAdminSpaceRequestHeaders(SYSTEM_TENANT_ID);

interface IdOnlyDto {
	id: string;
}

interface UserDto extends IdOnlyDto {
	name: string;
}

interface RoutineActivityDto extends IdOnlyDto {
	task?: {
		exercise?: {
			videoFileId?: string | null;
		} | null;
	} | null;
}

interface RoutineOptionDto extends IdOnlyDto {
	name: string;
	label?: string | null;
	activities?: RoutineActivityDto[];
}

interface ProgramSnapshotDto extends IdOnlyDto {
	name?: string;
	routineId?: string;
	capacity?: number;
}

interface ApiListResponse<T> {
	data?: T[];
}

interface ApiItemResponse<T> {
	data?: T;
}

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function ensureAdminCurrentSpace(page: Page) {
	const response = await page.request.post(
		`${API_BASE_URL}/auth/current-space`,
		{
			headers: getSpaceHeaders(),
			data: { tenantId: SYSTEM_TENANT_ID },
		},
	);
	expect(response.ok()).toBeTruthy();

	const body = (await response.json()) as ApiItemResponse<
		IdOnlyDto & { tenantId?: string | null }
	>;
	expect(body.data?.id).toBe(SYSTEM_SPACE_ID);
	expect(body.data?.tenantId).toBe(SYSTEM_TENANT_ID);
}

async function waitForRoutineToBeSelectable(page: Page, routineId: string) {
	await expect
		.poll(
			async () => {
				const response = await page.request.get(`${API_BASE_URL}/routines`, {
					headers: getSpaceHeaders(),
					params: {
						take: 50,
						skip: 0,
						spaceScope: "INCLUDE_ANCESTORS",
					},
				});
				if (!response.ok()) {
					return false;
				}

				const body = (await response.json()) as ApiListResponse<IdOnlyDto>;
				return body.data?.some((routine) => routine.id === routineId) ?? false;
			},
			{
				timeout: 30_000,
				message: `루틴 ${routineId} 가 선택 목록에 노출될 때까지 대기`,
			},
		)
		.toBe(true);
}

async function getFirstInstructor(page: Page) {
	const usersResponse = await page.request.get(
		`${API_BASE_URL}/users?take=20&skip=0&status=active&roles=COMPANY_MANAGER&roles=PLATFORM_ADMIN`,
		{ headers: getSpaceHeaders() },
	);
	test.skip(
		usersResponse.status() !== 200,
		`강사 조회 API 응답이 200이 아닙니다. status=${usersResponse.status()}`,
	);
	const usersBody = (await usersResponse.json()) as ApiListResponse<UserDto>;
	const instructor = usersBody.data?.[0];
	expect(instructor?.id).toBeTruthy();
	expect(instructor?.name).toBeTruthy();

	return instructor as UserDto;
}

async function getFirstUnschedulableRoutine(page: Page) {
	const response = await page.request.get(`${API_BASE_URL}/routines`, {
		headers: getSpaceHeaders(),
		params: {
			take: 50,
			skip: 0,
			spaceScope: "INCLUDE_ANCESTORS",
		},
	});
	expect(response.status()).toBe(200);
	const body = (await response.json()) as ApiListResponse<RoutineOptionDto>;

	return body.data?.find((routine) =>
		(routine.activities ?? []).some(
			(activity) => !activity.task?.exercise?.videoFileId,
		),
	);
}

function waitForRoutineOptions(page: Page) {
	return page
		.waitForResponse(
			(response) =>
				response.url().includes("/api/v1/routines") &&
				response.request().method() === "GET",
			{ timeout: 15_000 },
		)
		.catch(() => undefined);
}

async function openRoutinePicker(page: Page) {
	const routineDialog = page
		.getByRole("dialog")
		.filter({ has: page.getByLabel("루틴 검색") })
		.first();
	for (let attempt = 0; attempt < 3; attempt += 1) {
		if (await routineDialog.isVisible().catch(() => false)) {
			return routineDialog;
		}

		const routineOptionsResponse = waitForRoutineOptions(page);
		await page.getByRole("button", { name: "루틴 선택" }).click();
		await routineDialog
			.waitFor({ state: "visible", timeout: 5000 })
			.catch(() => undefined);
		await routineOptionsResponse;
		if (await routineDialog.isVisible().catch(() => false)) {
			return routineDialog;
		}
		await page.waitForTimeout(500);
	}
	await expect(routineDialog).toBeVisible({ timeout: 45_000 });
	return routineDialog;
}

async function waitForProgramSnapshot(
	page: Page,
	params: {
		timelineId: string;
		sessionId: string;
		programId: string;
		assert: (program: ProgramSnapshotDto | undefined) => boolean;
		message: string;
	},
) {
	await expect
		.poll(
			async () => {
				const response = await page.request.get(
					`${API_BASE_URL}/timelines/${params.timelineId}/sessions/${params.sessionId}/programs/${params.programId}`,
					{ headers: getSpaceHeaders() },
				);
				if (!response.ok()) {
					return false;
				}

				const body =
					(await response.json()) as ApiItemResponse<ProgramSnapshotDto>;
				return params.assert(body.data);
			},
			{
				timeout: 30_000,
				message: params.message,
			},
		)
		.toBe(true);
}

async function selectRoutineInDialog({
	page,
	dialog,
	routineName,
}: {
	page: Page;
	dialog: Locator;
	routineName: string;
}) {
	const routineSearchResponse = page
		.waitForResponse(
			(response) =>
				response.url().includes("/api/v1/routines") &&
				response.request().method() === "GET",
			{ timeout: 10_000 },
		)
		.catch(() => undefined);
	await dialog.getByLabel("루틴 검색").fill(routineName);
	await routineSearchResponse;
	const routineButton = dialog
		.getByRole("button")
		.filter({ hasText: routineName })
		.first();
	await expect(routineButton).toBeVisible({ timeout: 45_000 });
	await routineButton.click();
}

async function selectRoutineOptionInDialog({
	page,
	dialog,
	routine,
}: {
	page: Page;
	dialog: Locator;
	routine: RoutineOptionDto;
}) {
	const routineSearchResponse = page
		.waitForResponse(
			(response) =>
				response.url().includes("/api/v1/routines") &&
				response.request().method() === "GET",
			{ timeout: 10_000 },
		)
		.catch(() => undefined);
	await dialog.getByLabel("루틴 검색").fill(routine.name);
	await routineSearchResponse;

	let routineButton = dialog
		.getByRole("button")
		.filter({ hasText: routine.name });
	if (routine.label) {
		routineButton = routineButton.filter({ hasText: routine.label });
	}
	await expect(routineButton).toHaveCount(1, { timeout: 45_000 });
	await routineButton.click();
}

async function selectInstructorInDialog({
	page,
	instructor,
}: {
	page: Page;
	instructor: UserDto;
}) {
	await page.getByRole("button", { name: "강사 선택" }).click();
	const instructorSelectDialog = page
		.getByRole("dialog")
		.filter({ has: page.getByLabel("강사 검색") })
		.first();
	await expect(instructorSelectDialog).toBeVisible({ timeout: 10000 });
	await instructorSelectDialog.getByLabel("강사 검색").fill(instructor.name);
	await instructorSelectDialog
		.getByRole("button", {
			name: new RegExp(escapeRegExp(instructor.name)),
		})
		.click();
}

test.describe("프로그램 등록/수정 연결 플로우", () => {
	test("프로그램 등록 후 수정에서 루틴 전환이 정상 동작해야 한다", async ({
		page,
	}) => {
		const uniqueSuffix = `${Date.now()}`;
		const timelineName = `E2E 타임라인 ${uniqueSuffix}`;
		const sessionName = `E2E 세션 ${uniqueSuffix}`;
		const routineOneName = `E2E 루틴 A ${uniqueSuffix}`;
		const routineTwoName = `E2E 루틴 B ${uniqueSuffix}`;
		const programName = `E2E 프로그램 ${uniqueSuffix}`;
		const exerciseTaskName = `E2E 프로그램 운동 ${uniqueSuffix}`;
		const initialCapacity = "12";
		const updatedCapacity = "18";

		let timelineId: string | undefined;
		let sessionId: string | undefined;
		let routineOneId: string | undefined;
		let routineTwoId: string | undefined;
		let programId: string | undefined;
		let exerciseTaskId: string | undefined;
		let createdExerciseTaskId: string | undefined;

		try {
			// Given: API로 타임라인/세션/루틴/강사 데이터를 준비한다
			await loginToConsole(page);
			await ensureAdminCurrentSpace(page);

			const createTimelineResponse = await page.request.post(
				`${API_BASE_URL}/timelines`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: timelineName,
						description: "프로그램 E2E 테스트용 타임라인",
					},
				},
			);
			expect(createTimelineResponse.status()).toBe(201);
			const createdTimeline =
				(await createTimelineResponse.json()) as ApiItemResponse<IdOnlyDto>;
			timelineId = createdTimeline.data?.id;
			expect(timelineId).toBeTruthy();

			const startDateTime = new Date(Date.now() + 86_400_000).toISOString();
			const createSessionResponse = await page.request.post(
				`${API_BASE_URL}/timelines/${timelineId}/sessions`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: sessionName,
						type: "ONE_TIME",
						timelineId,
						startDateTime,
						description: "프로그램 E2E 테스트용 세션",
					},
				},
			);
			expect(createSessionResponse.status()).toBe(201);
			const createdSession =
				(await createSessionResponse.json()) as ApiItemResponse<IdOnlyDto>;
			sessionId = createdSession.data?.id;
			expect(sessionId).toBeTruthy();

			const createTaskResponse = await page.request.post(
				`${API_BASE_URL}/tasks`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: exerciseTaskName,
						duration: 60,
						count: 10,
						videoFileId: TEST_VIDEO_FILE_ID,
					},
				},
			);
			expect(createTaskResponse.status()).toBe(201);
			const createdTask =
				(await createTaskResponse.json()) as ApiItemResponse<IdOnlyDto>;
			exerciseTaskId = createdTask.data?.id;
			createdExerciseTaskId = exerciseTaskId;

			expect(exerciseTaskId).toBeTruthy();

			const createRoutineOneResponse = await page.request.post(
				`${API_BASE_URL}/routines`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: routineOneName,
						label: `E2E-A-${uniqueSuffix}`,
						activities: [
							{
								taskId: exerciseTaskId as string,
								order: 1,
								repetitions: 10,
								restTime: 30,
							},
						],
					},
				},
			);
			expect(createRoutineOneResponse.status()).toBe(201);
			const createdRoutineOne =
				(await createRoutineOneResponse.json()) as ApiItemResponse<IdOnlyDto>;
			routineOneId = createdRoutineOne.data?.id;
			expect(routineOneId).toBeTruthy();

			const createRoutineTwoResponse = await page.request.post(
				`${API_BASE_URL}/routines`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: routineTwoName,
						label: `E2E-B-${uniqueSuffix}`,
						activities: [
							{
								taskId: exerciseTaskId as string,
								order: 1,
								repetitions: 12,
								restTime: 20,
							},
						],
					},
				},
			);
			expect(createRoutineTwoResponse.status()).toBe(201);
			const createdRoutineTwo =
				(await createRoutineTwoResponse.json()) as ApiItemResponse<IdOnlyDto>;
			routineTwoId = createdRoutineTwo.data?.id;
			expect(routineTwoId).toBeTruthy();

			const instructor = await getFirstInstructor(page);
			await waitForRoutineToBeSelectable(page, routineOneId as string);
			await waitForRoutineToBeSelectable(page, routineTwoId as string);

			// When: 프로그램 등록 페이지에 진입해 필수 필드와 연결 대상을 선택한다
			await page.goto(
				`./timelines/${timelineId}/sessions/${sessionId}/programs/new`,
			);
			await page.waitForLoadState("networkidle");
			await expect(
				page.getByText("Space 선택 필요", { exact: true }),
			).not.toBeVisible();

			await expect(
				page.getByRole("heading", { name: "프로그램 등록" }),
			).toBeVisible();

			await page.getByLabel("프로그램 이름").fill(programName);
			await page.getByLabel("정원").fill(initialCapacity);

			const routineSelectDialogInCreate = await openRoutinePicker(page);
			await selectRoutineInDialog({
				page,
				dialog: routineSelectDialogInCreate,
				routineName: routineOneName,
			});

			await selectInstructorInDialog({ page, instructor });
			await expect(page.getByRole("button", { name: "등록" })).toBeEnabled();

			const createProgramResponse = page.waitForResponse(
				(response) =>
					response
						.url()
						.includes(
							`/api/v1/timelines/${timelineId}/sessions/${sessionId}/programs`,
						) && response.request().method() === "POST",
			);
			await page.getByRole("button", { name: "등록" }).click();
			const postProgramResponse = await createProgramResponse;

			// Then: 프로그램 생성 응답과 세션 상세 이동을 확인한다
			expect(postProgramResponse.status()).toBe(201);
			const createdProgram =
				(await postProgramResponse.json()) as ApiItemResponse<IdOnlyDto>;
			programId = createdProgram.data?.id;
			expect(programId).toBeTruthy();
			const createdProgramId = programId as string;
			await waitForProgramSnapshot(page, {
				timelineId: timelineId as string,
				sessionId: sessionId as string,
				programId: createdProgramId,
				assert: (program) => program?.name === programName,
				message: "생성한 프로그램이 상세 조회에 반영될 때까지 대기",
			});

			await page.goto("about:blank");
			const programDetailPath = `/admin/timelines/${timelineId}/sessions/${sessionId}/programs/${createdProgramId}`;
			await page.goto(programDetailPath, { waitUntil: "commit" });
			await expect(page).toHaveURL(
				new RegExp(
					`/timelines/${timelineId}/sessions/${sessionId}/programs/${createdProgramId}$`,
				),
				{ timeout: 45_000 },
			);
			await page.waitForLoadState("networkidle");
			await expect(
				page.getByRole("heading", { name: programName, exact: true }),
			).toBeVisible({ timeout: 45_000 });
			await expect(page.getByRole("button", { name: "수정" })).toBeVisible({
				timeout: 45_000,
			});

			// When: 수정 페이지에서 루틴을 두 번째 루틴으로 변경하고 저장한다
			await page.getByRole("button", { name: "수정" }).click();
			await page.waitForURL(
				new RegExp(
					`/timelines/${timelineId}/sessions/${sessionId}/programs/[^/]+/edit$`,
				),
				{ timeout: 15_000 },
			);
			await expect(
				page.getByRole("heading", { name: "프로그램 수정" }),
			).toBeVisible();

			const routineSelectDialogInEdit = await openRoutinePicker(page);
			await selectRoutineInDialog({
				page,
				dialog: routineSelectDialogInEdit,
				routineName: routineTwoName,
			});

			const capacityInput = page.getByLabel("정원");
			await capacityInput.click();
			await capacityInput.press("Meta+a");
			await capacityInput.fill(updatedCapacity);

			const updateProgramResponse = page.waitForResponse(
				(response) =>
					response
						.url()
						.includes(
							`/api/v1/timelines/${timelineId}/sessions/${sessionId}/programs/`,
						) && response.request().method() === "PATCH",
			);
			await page.getByRole("button", { name: "저장" }).click();
			const patchProgramResponse = await updateProgramResponse;

			// Then: 프로그램 수정 응답과 상세 화면의 변경 데이터를 확인한다
			expect(patchProgramResponse.status()).toBe(200);
			await waitForProgramSnapshot(page, {
				timelineId: timelineId as string,
				sessionId: sessionId as string,
				programId: createdProgramId,
				assert: (program) =>
					program?.routineId === routineTwoId &&
					program?.capacity === Number(updatedCapacity),
				message: "수정한 프로그램의 루틴/정원이 상세 조회에 반영될 때까지 대기",
			});
			await page.waitForURL(
				new RegExp(
					`/timelines/${timelineId}/sessions/${sessionId}/programs/[^/]+$`,
				),
				{ timeout: 15_000 },
			);
			await page.reload({ waitUntil: "domcontentloaded" });
			await expect(
				page.getByRole("link", { name: routineTwoName }),
			).toBeVisible({
				timeout: 10_000,
			});
			await expect(
				page.getByText(`${updatedCapacity}명`, { exact: true }),
			).toBeVisible();
		} finally {
			// Cleanup: 생성한 프로그램/세션/타임라인/루틴을 삭제한다
			if (programId && sessionId && timelineId) {
				await page.request
					.delete(
						`${API_BASE_URL}/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}`,
						{ headers: getSpaceHeaders() },
					)
					.catch(() => undefined);
			}

			if (sessionId && timelineId) {
				await page.request
					.delete(
						`${API_BASE_URL}/timelines/${timelineId}/sessions/${sessionId}`,
						{ headers: getSpaceHeaders() },
					)
					.catch(() => undefined);
			}

			if (timelineId) {
				await page.request
					.delete(`${API_BASE_URL}/timelines/${timelineId}`, {
						headers: getSpaceHeaders(),
					})
					.catch(() => undefined);
			}

			if (routineOneId) {
				await page.request
					.delete(`${API_BASE_URL}/routines/${routineOneId}`, {
						headers: getSpaceHeaders(),
					})
					.catch(() => undefined);
			}

			if (routineTwoId) {
				await page.request
					.delete(`${API_BASE_URL}/routines/${routineTwoId}`, {
						headers: getSpaceHeaders(),
					})
					.catch(() => undefined);
			}

			if (createdExerciseTaskId) {
				await page.request
					.delete(`${API_BASE_URL}/tasks/${createdExerciseTaskId}`, {
						headers: getSpaceHeaders(),
					})
					.catch(() => undefined);
			}
		}
	});

	test("영상 누락 루틴을 선택하면 등록 버튼이 비활성화되고 경고가 노출되어야 한다", async ({
		page,
	}) => {
		const uniqueSuffix = `${Date.now()}`;
		const timelineName = `E2E 차단 타임라인 ${uniqueSuffix}`;
		const sessionName = `E2E 차단 세션 ${uniqueSuffix}`;
		const programName = `E2E 차단 프로그램 ${uniqueSuffix}`;

		let timelineId: string | undefined;
		let sessionId: string | undefined;

		try {
			await loginToConsole(page);
			await ensureAdminCurrentSpace(page);
			const unschedulableRoutine = await getFirstUnschedulableRoutine(page);
			if (!unschedulableRoutine) {
				test.skip(
					true,
					"영상이 누락된 seed 루틴이 없어 차단 상태를 검증할 수 없습니다.",
				);
				return;
			}
			const instructor = await getFirstInstructor(page);

			const createTimelineResponse = await page.request.post(
				`${API_BASE_URL}/timelines`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: timelineName,
						description: "영상 누락 루틴 차단 E2E 테스트용 타임라인",
					},
				},
			);
			expect(createTimelineResponse.status()).toBe(201);
			const createdTimeline =
				(await createTimelineResponse.json()) as ApiItemResponse<IdOnlyDto>;
			timelineId = createdTimeline.data?.id;
			expect(timelineId).toBeTruthy();

			const createSessionResponse = await page.request.post(
				`${API_BASE_URL}/timelines/${timelineId}/sessions`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: sessionName,
						type: "ONE_TIME",
						timelineId,
						startDateTime: new Date(Date.now() + 86_400_000).toISOString(),
						description: "영상 누락 루틴 차단 E2E 테스트용 세션",
					},
				},
			);
			expect(createSessionResponse.status()).toBe(201);
			const createdSession =
				(await createSessionResponse.json()) as ApiItemResponse<IdOnlyDto>;
			sessionId = createdSession.data?.id;
			expect(sessionId).toBeTruthy();

			await page.goto(
				`./timelines/${timelineId}/sessions/${sessionId}/programs/new`,
			);
			await page.waitForLoadState("networkidle");
			await expect(
				page.getByRole("heading", { name: "프로그램 등록" }),
			).toBeVisible();

			await page.getByLabel("프로그램 이름").fill(programName);
			await page.getByLabel("정원").fill("10");

			const routineSelectDialog = await openRoutinePicker(page);
			await selectRoutineOptionInDialog({
				page,
				dialog: routineSelectDialog,
				routine: unschedulableRoutine,
			});
			await selectInstructorInDialog({ page, instructor });

			await expect(page.getByText("저장 불가", { exact: true })).toBeVisible();
			await expect(
				page.getByText("영상이 없는 운동이 포함되어 있어 저장 버튼이"),
			).toBeVisible();
			await expect(page.getByRole("button", { name: "등록" })).toBeDisabled();
		} finally {
			if (sessionId && timelineId) {
				await page.request
					.delete(
						`${API_BASE_URL}/timelines/${timelineId}/sessions/${sessionId}`,
						{ headers: getSpaceHeaders() },
					)
					.catch(() => undefined);
			}

			if (timelineId) {
				await page.request
					.delete(`${API_BASE_URL}/timelines/${timelineId}`, {
						headers: getSpaceHeaders(),
					})
					.catch(() => undefined);
			}
		}
	});
});
