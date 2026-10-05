import {
	BigIntResponseInterceptor,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
import { PUBLIC_ROUTE_KEY } from "@cocrepo/decorator";
import { CreateActionDto, CreateRoleDto, UpdateRoleDto } from "@cocrepo/dto";
import { I18nTranslationService, TokenStorageService } from "@cocrepo/service";
import {
	Body,
	type CallHandler,
	Controller,
	type ExecutionContext,
	type INestApplication,
	Patch,
	Post,
	SetMetadata,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import request from "supertest";
import { setNestApp } from "../setNestApp";

@SetMetadata(PUBLIC_ROUTE_KEY, true)
@Controller()
class ValidationContractController {
	@Post("roles")
	createRole(@Body() roleInput: CreateRoleDto) {
		return roleInput;
	}

	@Patch("roles/1")
	updateRole(@Body() roleInput: UpdateRoleDto) {
		return roleInput;
	}

	@Post("actions")
	createAction(@Body() actionInput: CreateActionDto) {
		return actionInput;
	}
}

describe("setNestApp의 실제 HTTP 요청 검증", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const testingModule = await Test.createTestingModule({
			controllers: [ValidationContractController],
			providers: [
				{
					provide: I18nTranslationService,
					useValue: { translate: async (message: string) => message },
				},
				{ provide: TokenStorageService, useValue: {} },
				{ provide: ClsService, useValue: {} },
				{ provide: SpaceAccessGuard, useValue: { canActivate: () => true } },
				{
					provide: SpaceScopeInterceptor,
					useValue: {
						intercept: (_context: ExecutionContext, next: CallHandler) =>
							next.handle(),
					},
				},
				BigIntResponseInterceptor,
				ResponseEntityInterceptor,
			],
		}).compile();
		app = testingModule.createNestApplication();
		app.useLogger(false);
		setNestApp(app);
		await app.init();
	});

	afterAll(async () => {
		await app?.close();
	});

	it.each([
		"assignments",
		"unknownField",
	])("역할 생성의 %s 입력을 제거하지 않고 400으로 거부한다", async (fieldName) => {
		const response = await request(app.getHttpServer())
			.post("/roles")
			.send({ name: "MEMBER", [fieldName]: [] })
			.expect(400);

		expect(JSON.stringify(response.body)).toContain(
			`property ${fieldName} should not exist`,
		);
	});

	it.each([
		"assignments",
		"name",
		"unknownField",
	])("역할 수정의 %s 입력을 400으로 거부한다", async (fieldName) => {
		const response = await request(app.getHttpServer())
			.patch("/roles/1")
			.send({ [fieldName]: "forbidden" })
			.expect(400);

		expect(JSON.stringify(response.body)).toContain(
			`property ${fieldName} should not exist`,
		);
	});

	it.each([
		{},
		{ name: "lowercase" },
		{ name: null },
	])("필수 이름 누락과 잘못된 역할 이름을 거부한다: %j", async (roleInput) => {
		await request(app.getHttpServer())
			.post("/roles")
			.send(roleInput)
			.expect(400);
	});

	it.each([
		{ name: "MEMBER" },
		{ name: "MEMBER", displayName: null, description: null },
		{ name: "MEMBER", displayName: "회원", description: "기본 역할" },
	])("역할 생성의 선택값과 null 계약을 유지한다: %j", async (roleInput) => {
		const response = await request(app.getHttpServer())
			.post("/roles")
			.send(roleInput)
			.expect(201);

		expect(response.body.data).toEqual(roleInput);
	});

	it.each([
		{},
		{ displayName: null, description: null },
	])("빈 수정과 nullable 역할 필드를 허용한다: %j", async (roleInput) => {
		const response = await request(app.getHttpServer())
			.patch("/roles/1")
			.send(roleInput)
			.expect(200);

		expect(response.body.data).toEqual(roleInput);
	});

	it("다른 DTO의 알 수 없는 필드는 기존처럼 제거하고 변환을 유지한다", async () => {
		const response = await request(app.getHttpServer())
			.post("/actions")
			.send({ name: "read", order: "2", assignments: [], unknownField: true })
			.expect(201);

		expect(response.body.data).toEqual({ name: "read", order: 2 });
	});
});
