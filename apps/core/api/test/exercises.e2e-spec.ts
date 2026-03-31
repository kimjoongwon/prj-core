import { PRISMA_SERVICE_TOKEN, SYSTEM_ROLES } from "@cocrepo/constant";
import { SpaceScope } from "@cocrepo/dto";
import { TaskFacade } from "@cocrepo/facade";
import {
	AuthCacheService,
	JwtStrategy,
	TokenStorageService,
} from "@cocrepo/service";
import { INestApplication, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";

const TEST_JWT_SECRET = "test-jwt-secret-e2e";
const USER_ID = "00000000-0000-4000-8000-000000000011";
const SPACE_MANAGE_ID = "11111111-1111-4111-8111-111111111111";
const SPACE_FULL_ACCESS_ID = "22222222-2222-4222-8222-222222222222";
const SPACE_VIEW_ID = "33333333-3333-4333-8333-333333333333";
const UNKNOWN_SPACE_ID = "44444444-4444-4444-8444-444444444444";
const TASK_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const EXERCISE_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const ROUTINE_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

function createTestUser() {
	return {
		id: USER_ID,
		email: "tasks-e2e@example.com",
		tenants: [
			{
				id: "10000000-0000-4000-8000-000000000011",
				spaceId: SPACE_MANAGE_ID,
				role: { name: SYSTEM_ROLES.MANAGE },
			},
			{
				id: "20000000-0000-4000-8000-000000000011",
				spaceId: SPACE_FULL_ACCESS_ID,
				role: { name: SYSTEM_ROLES.FULL_ACCESS },
			},
			{
				id: "30000000-0000-4000-8000-000000000011",
				spaceId: SPACE_VIEW_ID,
				role: { name: SYSTEM_ROLES.VIEW },
			},
		],
	};
}

@Injectable()
class TasksTestJwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: TEST_JWT_SECRET,
			algorithms: ["HS256"],
		});
	}

	async validate(payload: { user: ReturnType<typeof createTestUser> }) {
		return payload.user;
	}
}

describe("Tasks API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;

	const taskFacadeMock = {
		findTasks: jest.fn(),
		getExerciseByTaskId: jest.fn(),
		findTaskRoutines: jest.fn(),
		createTaskWithExercise: jest.fn(),
		updateTaskExercise: jest.fn(),
		deleteTask: jest.fn(),
	};

	beforeAll(async () => {
		const jwtService = new JwtService({ secret: TEST_JWT_SECRET });
		jwtToken = jwtService.sign({
			sub: USER_ID,
			user: createTestUser(),
		});

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(PRISMA_SERVICE_TOKEN)
			.useValue({})
			.overrideProvider(JwtStrategy)
			.useClass(TasksTestJwtStrategy)
			.overrideProvider(TokenStorageService)
			.useValue({
				isBlacklisted: async () => false,
			})
			.overrideProvider(AuthCacheService)
			.useValue({
				invalidate: async () => {},
			})
			.overrideProvider(TaskFacade)
			.useValue(taskFacadeMock)
			.compile();

		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();
	}, 60000);

	beforeEach(() => {
		jest.clearAllMocks();

		taskFacadeMock.findTasks.mockResolvedValue({
			data: [
				{
					id: TASK_ID,
					spaceId: SPACE_MANAGE_ID,
				},
			],
			meta: {
				total: 1,
				skip: 0,
				take: 10,
				totalPages: 1,
			},
		});
		taskFacadeMock.getExerciseByTaskId.mockResolvedValue({
			id: EXERCISE_ID,
			taskId: TASK_ID,
			name: "Burpee",
			duration: 30,
			count: 12,
			description: "Core movement",
			imageFileId: null,
			videoFileId: null,
		});
		taskFacadeMock.findTaskRoutines.mockResolvedValue([
			{
				id: ROUTINE_ID,
				name: "Morning routine",
				label: "A",
			},
		]);
		taskFacadeMock.createTaskWithExercise.mockResolvedValue({
			id: TASK_ID,
			spaceId: SPACE_MANAGE_ID,
		});
		taskFacadeMock.updateTaskExercise.mockResolvedValue({
			id: TASK_ID,
			spaceId: SPACE_MANAGE_ID,
		});
		taskFacadeMock.deleteTask.mockResolvedValue(undefined);
	});

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	it("인증 없이 목록 조회 시 401을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer()).get("/api/v1/tasks");

		expect(response.status).toBe(401);
	});

	it("인증은 있지만 X-Space-ID가 없으면 400을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/tasks")
			.set("Authorization", `Bearer ${jwtToken}`);

		expect(response.status).toBe(400);
	});

	it("목록 조회는 현재 선택된 space와 query를 facade에 전달해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/tasks")
			.query({
				skip: 1,
				take: 5,
				search: "bur",
				spaceScope: SpaceScope.INCLUDE_ANCESTORS,
			})
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", SPACE_MANAGE_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data).toBeInstanceOf(Array);
		expect(response.body.meta).toMatchObject({
			total: 1,
			skip: 0,
			take: 10,
			totalPages: 1,
		});
		expect(taskFacadeMock.findTasks).toHaveBeenCalledWith({
			spaceId: SPACE_MANAGE_ID,
			spaceScope: SpaceScope.INCLUDE_ANCESTORS,
			skip: 1,
			take: 5,
			search: "bur",
		});
	});

	it("Task exercise 상세 조회 시 현재 spaceId를 함께 사용해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(`/api/v1/tasks/${TASK_ID}/exercise`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", SPACE_MANAGE_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data.id).toBe(EXERCISE_ID);
		expect(taskFacadeMock.getExerciseByTaskId).toHaveBeenCalledWith(
			TASK_ID,
			SPACE_MANAGE_ID,
		);
	});

	it("Task routines 조회 시 현재 spaceId를 함께 사용해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(`/api/v1/tasks/${TASK_ID}/routines`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", SPACE_MANAGE_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data).toHaveLength(1);
		expect(taskFacadeMock.findTaskRoutines).toHaveBeenCalledWith(
			TASK_ID,
			SPACE_MANAGE_ID,
		);
	});

	it("MANAGE tenant는 Task를 생성할 수 있어야 한다", async () => {
		const createDto = {
			name: "Burpee",
			duration: 30,
			count: 12,
			description: "Core movement",
		};

		const response = await request(app.getHttpServer())
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", SPACE_MANAGE_ID)
			.send(createDto);

		expect(response.status).toBe(201);
		expect(response.body.httpStatus).toBe(201);
		expect(response.body.data.id).toBe(TASK_ID);
		expect(taskFacadeMock.createTaskWithExercise).toHaveBeenCalledWith(
			createDto,
			SPACE_MANAGE_ID,
			USER_ID,
		);
	});

	it("VIEW tenant는 Task 생성 시 403을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", SPACE_VIEW_ID)
			.send({
				name: "Blocked task",
				duration: 20,
				count: 8,
				description: "Blocked by role",
			});

		expect(response.status).toBe(403);
		expect(taskFacadeMock.createTaskWithExercise).not.toHaveBeenCalled();
	});

	it("Task exercise 수정 시 현재 spaceId를 함께 사용해야 한다", async () => {
		const updateDto = {
			name: "Updated Burpee",
			description: "Updated description",
		};

		const response = await request(app.getHttpServer())
			.patch(`/api/v1/tasks/${TASK_ID}/exercise`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", SPACE_MANAGE_ID)
			.send(updateDto);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data.id).toBe(TASK_ID);
		expect(taskFacadeMock.updateTaskExercise).toHaveBeenCalledWith(
			TASK_ID,
			updateDto,
			SPACE_MANAGE_ID,
		);
	});

	it("Task 삭제 시 204를 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.delete(`/api/v1/tasks/${TASK_ID}`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", SPACE_MANAGE_ID);

		expect(response.status).toBe(204);
		expect(response.body).toEqual({});
		expect(taskFacadeMock.deleteTask).toHaveBeenCalledWith(
			TASK_ID,
			SPACE_MANAGE_ID,
		);
	});

	it("접근 불가한 space를 선택하면 403을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/tasks")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", UNKNOWN_SPACE_ID);

		expect(response.status).toBe(403);
		expect(taskFacadeMock.findTasks).not.toHaveBeenCalled();
	});

	it("유효하지 않은 UUID taskId는 400을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/tasks/not-a-valid-uuid/exercise")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", SPACE_MANAGE_ID);

		expect(response.status).toBe(400);
		expect(taskFacadeMock.getExerciseByTaskId).not.toHaveBeenCalled();
	});
});
