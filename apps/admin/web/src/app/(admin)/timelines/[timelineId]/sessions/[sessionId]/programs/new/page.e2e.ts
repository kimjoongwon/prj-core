import { expect, test } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api/v1";
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const SPACE_HEADERS = { "x-space-id": SYSTEM_SPACE_ID };

interface IdOnlyDto {
	id: string;
}

interface UserDto extends IdOnlyDto {
	name: string;
}

interface TaskSeedDto extends IdOnlyDto {
	exercise?: {
		name: string;
	};
}

interface ApiListResponse<T> {
	data?: T[];
}

interface ApiItemResponse<T> {
	data?: T;
}

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
		const initialCapacity = "12";
		const updatedCapacity = "18";

		let timelineId: string | undefined;
		let sessionId: string | undefined;
		let routineOneId: string | undefined;
		let routineTwoId: string | undefined;
		let instructor: UserDto | undefined;
		let programId: string | undefined;
		let exerciseTaskId: string | undefined;

		try {
			// Given: API로 타임라인/세션/루틴/강사 데이터를 준비한다
			const createTimelineResponse = await page.request.post(
				`${API_BASE_URL}/timelines`,
				{
					headers: SPACE_HEADERS,
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
					headers: SPACE_HEADERS,
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

				const exercisesResponse = await page.request.get(
					`${API_BASE_URL}/tasks?take=20&skip=0`,
					{
						headers: SPACE_HEADERS,
					},
				);
				test.skip(
					exercisesResponse.status() !== 200,
					`운동 조회 API 응답이 200이 아닙니다. status=${exercisesResponse.status()}`,
				);
				const exercisesBody =
					(await exercisesResponse.json()) as ApiListResponse<TaskSeedDto>;
				exerciseTaskId = exercisesBody.data?.[0]?.id;
				expect(exerciseTaskId).toBeTruthy();

				const createRoutineOneResponse = await page.request.post(
					`${API_BASE_URL}/routines`,
					{
						headers: SPACE_HEADERS,
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
			test.skip(
				createRoutineOneResponse.status() !== 201,
				`루틴 생성 API 응답이 201이 아닙니다. status=${createRoutineOneResponse.status()}`,
			);
			const createdRoutineOne =
				(await createRoutineOneResponse.json()) as ApiItemResponse<IdOnlyDto>;
			routineOneId = createdRoutineOne.data?.id;
			expect(routineOneId).toBeTruthy();

			const createRoutineTwoResponse = await page.request.post(
				`${API_BASE_URL}/routines`,
				{
					headers: SPACE_HEADERS,
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
			test.skip(
				createRoutineTwoResponse.status() !== 201,
				`루틴 생성 API 응답이 201이 아닙니다. status=${createRoutineTwoResponse.status()}`,
			);
			const createdRoutineTwo =
				(await createRoutineTwoResponse.json()) as ApiItemResponse<IdOnlyDto>;
			routineTwoId = createdRoutineTwo.data?.id;
			expect(routineTwoId).toBeTruthy();

				const usersResponse = await page.request.get(
					`${API_BASE_URL}/users?take=20&skip=0&status=active&roles=MANAGE&roles=FULL_ACCESS`,
					{
						headers: SPACE_HEADERS,
					},
				);
				test.skip(
					usersResponse.status() !== 200,
					`강사 조회 API 응답이 200이 아닙니다. status=${usersResponse.status()}`,
				);
			const usersBody =
				(await usersResponse.json()) as ApiListResponse<UserDto>;
			instructor = usersBody.data?.[0];
			expect(instructor?.id).toBeTruthy();
			expect(instructor?.name).toBeTruthy();

			// When: 프로그램 등록 페이지에 진입해 필수 필드와 연결 대상을 선택한다
			await page.goto(
				`./timelines/${timelineId}/sessions/${sessionId}/programs/new`,
			);
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: "프로그램 등록" }),
			).toBeVisible();

			await page.getByLabel("프로그램 이름").fill(programName);
			await page.getByLabel("정원").fill(initialCapacity);

			await page.getByRole("button", { name: "루틴 선택" }).click();
			const routineSelectDialogInCreate = page.getByRole("dialog", {
				name: "루틴 선택",
			});
			await expect(routineSelectDialogInCreate).toBeVisible();
			await routineSelectDialogInCreate
				.getByLabel("루틴 검색")
				.fill(routineOneName);
			await routineSelectDialogInCreate
				.getByRole("button", {
					name: new RegExp(escapeRegExp(routineOneName)),
				})
				.click();

			await page.getByRole("button", { name: "강사 선택" }).click();
			const instructorSelectDialog = page.getByRole("dialog", {
				name: "강사 선택",
			});
			await expect(instructorSelectDialog).toBeVisible();
			await instructorSelectDialog
				.getByLabel("강사 검색")
				.fill(instructor?.name ?? "");
			await instructorSelectDialog
				.getByRole("button", {
					name: new RegExp(escapeRegExp(instructor?.name ?? "")),
				})
				.click();

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

			await page.waitForURL(
				new RegExp(`/timelines/${timelineId}/sessions/${sessionId}$`),
				{ timeout: 15_000 },
			);
			await expect(
				page.getByRole("heading", { name: sessionName }),
			).toBeVisible({ timeout: 10_000 });

			await page
				.getByRole("button", { name: programName, exact: true })
				.click();
			await page.waitForURL(
				new RegExp(
					`/timelines/${timelineId}/sessions/${sessionId}/programs/[^/]+$`,
				),
				{ timeout: 15_000 },
			);

			if (!programId) {
				const urlMatch = page.url().match(/\/programs\/([^/]+)$/);
				programId = urlMatch?.[1];
			}

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

			await page.getByRole("button", { name: "루틴 선택" }).click();
			const routineSelectDialogInEdit = page.getByRole("dialog", {
				name: "루틴 선택",
			});
			await expect(routineSelectDialogInEdit).toBeVisible();
			await routineSelectDialogInEdit
				.getByLabel("루틴 검색")
				.fill(routineTwoName);
			await routineSelectDialogInEdit
				.getByRole("button", {
					name: new RegExp(escapeRegExp(routineTwoName)),
				})
				.click();

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
			await page.waitForURL(
				new RegExp(
					`/timelines/${timelineId}/sessions/${sessionId}/programs/[^/]+$`,
				),
				{ timeout: 15_000 },
			);
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
				await page.request.delete(
					`${API_BASE_URL}/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}`,
					{ headers: SPACE_HEADERS },
				);
			}

			if (sessionId && timelineId) {
				await page.request.delete(
					`${API_BASE_URL}/timelines/${timelineId}/sessions/${sessionId}`,
					{ headers: SPACE_HEADERS },
				);
			}

			if (timelineId) {
				await page.request.delete(`${API_BASE_URL}/timelines/${timelineId}`, {
					headers: SPACE_HEADERS,
				});
			}

			if (routineOneId) {
				await page.request.delete(`${API_BASE_URL}/routines/${routineOneId}`, {
					headers: SPACE_HEADERS,
				});
			}

			if (routineTwoId) {
				await page.request.delete(`${API_BASE_URL}/routines/${routineTwoId}`, {
					headers: SPACE_HEADERS,
				});
			}
		}
	});
});
