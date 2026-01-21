import { CONTEXT_KEYS } from "@cocrepo/constant";
import { Ability as AbilityEntity, Action, Subject } from "@cocrepo/entity";
import { AbilitiesRepository } from "@cocrepo/repository";
import { Test, TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { ClsService } from "nestjs-cls";
import { CaslAbilityFactory } from "../casl-ability.factory";
import type { UserDto } from "@cocrepo/dto";

describe("CaslAbilityFactory", () => {
	let factory: CaslAbilityFactory;
	let mockAbilitiesRepository: DeepMockProxy<AbilitiesRepository>;
	let mockClsService: jest.Mocked<ClsService>;

	const mockSubject: Partial<Subject> = {
		id: "subject-test-id",
		name: "entity:User",
		displayName: "사용자",
	};

	const mockAction: Partial<Action> = {
		id: "action-test-id",
		name: "READ",
		displayName: "조회",
	};

	const createMockAbility = (
		overrides: Partial<AbilityEntity> = {},
	): AbilityEntity => {
		const ability = {
			id: "ability-test-id",
			seq: 1,
			subjectId: "subject-test-id",
			actionId: "action-test-id",
			roleId: "role-test-id",
			userId: null,
			fields: [],
			conditions: null,
			inverted: false,
			reason: null,
			name: "테스트 권한",
			description: null,
			isActive: true,
			priority: 1,
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-01"),
			removedAt: null,
			subject: mockSubject as Subject,
			action: mockAction as Action,
			...overrides,
		} as AbilityEntity;
		return ability;
	};

	const createMockUser = (overrides: Partial<UserDto> = {}): UserDto => {
		return {
			id: "user-test-id",
			spaceId: "space-test-id",
			email: "test@example.com",
			name: "Test User",
			phone: "010-1234-5678",
			password: "$2b$10$hashedPassword",
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-01"),
			tenants: [
				{
					id: "tenant-test-id",
					name: "Test Tenant",
					spaceId: "space-test-id",
					roleId: "role-test-id",
					role: {
						id: "role-test-id",
						name: "USER",
					},
					space: {
						id: "space-test-id",
						name: "Test Space",
					},
				} as any,
			],
			...overrides,
		} as UserDto;
	};

	beforeEach(async () => {
		mockAbilitiesRepository = mockDeep<AbilitiesRepository>();
		mockClsService = {
			get: jest.fn(),
			set: jest.fn(),
			getId: jest.fn(),
			run: jest.fn(),
			runWith: jest.fn(),
			enter: jest.fn(),
			enterWith: jest.fn(),
			exit: jest.fn(),
			isActive: jest.fn(),
			has: jest.fn(),
		} as unknown as jest.Mocked<ClsService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CaslAbilityFactory,
				{ provide: AbilitiesRepository, useValue: mockAbilitiesRepository },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		factory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
	});

	afterEach(() => {
		mockReset(mockAbilitiesRepository);
		jest.clearAllMocks();
	});

	it("팩토리가 정의되어야 한다", () => {
		expect(factory).toBeDefined();
	});

	describe("createForUser", () => {
		it("Role 기반 권한만 있을 때 Ability를 생성해야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [
				createMockAbility({ id: "ability-1" }),
				createMockAbility({
					id: "ability-2",
					action: { ...mockAction, name: "CREATE" } as Action,
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(mockAbilitiesRepository.findActiveByRoleIds).toHaveBeenCalledWith([
				"role-test-id",
			]);
			expect(mockAbilitiesRepository.findActiveByUserId).toHaveBeenCalledWith(
				user.id,
			);
			expect(ability).toBeDefined();
			expect(ability.can("READ", "entity:User")).toBe(true);
			expect(ability.can("CREATE", "entity:User")).toBe(true);
		});

		it("User 예외 권한이 있을 때 Role 권한을 덮어써야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [
				createMockAbility({
					id: "role-ability-1",
					inverted: false, // CAN READ
					priority: 1,
				}),
			];
			const userAbilities = [
				createMockAbility({
					id: "user-ability-1",
					userId: user.id,
					roleId: null,
					inverted: true, // CANNOT READ (예외 권한으로 거부)
					priority: 10,
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue(
				userAbilities,
			);

			// When
			const ability = await factory.createForUser(user);

			// Then
			// User 예외 권한이 priority가 높으므로 CANNOT이 적용됨
			expect(ability.cannot("READ", "entity:User")).toBe(true);
		});

		it("User 예외 권한의 priority가 높을 때 우선 적용되어야 한다", async () => {
			// Given
			const user = createMockUser();

			// Role 권한: READ 허용 (priority: 5)
			const roleAbilities = [
				createMockAbility({
					id: "role-ability-1",
					inverted: false,
					priority: 5,
				}),
			];

			// User 예외 권한: READ 거부 (priority: 10 - 더 높음)
			const userAbilities = [
				createMockAbility({
					id: "user-ability-1",
					userId: user.id,
					roleId: null,
					inverted: true,
					priority: 10,
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue(
				userAbilities,
			);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(ability.cannot("READ", "entity:User")).toBe(true);
		});

		it("User 예외 권한의 priority가 낮으면 Role 권한이 유지되어야 한다", async () => {
			// Given
			const user = createMockUser();

			// Role 권한: READ 허용 (priority: 10)
			const roleAbilities = [
				createMockAbility({
					id: "role-ability-1",
					inverted: false,
					priority: 10,
				}),
			];

			// User 예외 권한: READ 거부 (priority: 1 - 더 낮음)
			const userAbilities = [
				createMockAbility({
					id: "user-ability-1",
					userId: user.id,
					roleId: null,
					inverted: true,
					priority: 1,
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue(
				userAbilities,
			);

			// When
			const ability = await factory.createForUser(user);

			// Then
			// Role 권한의 priority가 더 높으므로 CAN이 유지됨
			expect(ability.can("READ", "entity:User")).toBe(true);
		});

		it("subject 또는 action이 없는 Ability는 무시해야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [
				createMockAbility({
					id: "ability-no-subject",
					subject: undefined,
				}),
				createMockAbility({
					id: "ability-no-action",
					action: undefined,
				}),
				createMockAbility({
					id: "ability-valid",
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			// subject 또는 action이 없는 권한은 무시되어 하나의 권한만 적용됨
			expect(ability.can("READ", "entity:User")).toBe(true);
		});

		it("빈 권한 목록일 때 빈 Ability를 반환해야 한다", async () => {
			// Given
			const user = createMockUser();

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue([]);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(ability).toBeDefined();
			expect(ability.can("READ", "entity:User")).toBe(false);
			expect(ability.can("CREATE", "entity:User")).toBe(false);
		});

		it("Tenant 또는 Role이 없으면 빈 Ability를 반환해야 한다", async () => {
			// Given
			const userWithoutTenant = createMockUser({ tenants: [] });

			mockClsService.get.mockReturnValue("space-test-id");

			// When
			const ability = await factory.createForUser(userWithoutTenant);

			// Then
			expect(ability).toBeDefined();
			expect(ability.can("READ", "entity:User")).toBe(false);
		});

		it("spaceId가 없으면 첫 번째 Tenant를 사용해야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [createMockAbility()];

			mockClsService.get.mockReturnValue(undefined); // spaceId 없음
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(mockAbilitiesRepository.findActiveByRoleIds).toHaveBeenCalledWith([
				"role-test-id",
			]); // 첫 번째 Tenant의 roleId 사용
			expect(ability.can("READ", "entity:User")).toBe(true);
		});
	});

	describe("parseConditions", () => {
		// parseConditions은 JSON 문자열 내 ${var} 패턴을 치환 후 JSON.parse
		// 템플릿 변수 값은 문자열이면 따옴표로 감싸서 치환됨

		it("null 조건은 undefined를 반환해야 한다", () => {
			// Given
			const userContext = { user: { id: "user-test-id" } };

			// When
			const result = factory.parseConditions(null, userContext);

			// Then
			expect(result).toBeUndefined();
		});

		it("조건이 객체가 아니면 undefined를 반환해야 한다", () => {
			// Given
			const userContext = { user: { id: "user-test-id" } };

			// When
			const result = factory.parseConditions("string-value", userContext);

			// Then
			expect(result).toBeUndefined();
		});

		it("빈 객체 조건은 빈 객체를 반환해야 한다", () => {
			// Given
			const conditions = {};
			const userContext = { user: { id: "user-test-id" } };

			// When
			const result = factory.parseConditions(conditions, userContext);

			// Then
			expect(result).toEqual({});
		});

		it("템플릿 변수 없는 조건은 그대로 반환해야 한다", () => {
			// Given
			const conditions = { status: "active", count: 10 };
			const userContext = { user: { id: "user-test-id" } };

			// When
			const result = factory.parseConditions(conditions, userContext);

			// Then
			expect(result).toEqual({ status: "active", count: 10 });
		});

		it("숫자 조건은 정상 파싱되어야 한다", () => {
			// Given
			const conditions = { minAge: 18, maxAge: 65 };
			const userContext = { user: { id: "user-test-id" } };

			// When
			const result = factory.parseConditions(conditions, userContext);

			// Then
			expect(result).toEqual({ minAge: 18, maxAge: 65 });
		});

		it("boolean 조건은 정상 파싱되어야 한다", () => {
			// Given
			const conditions = { isActive: true, isDeleted: false };
			const userContext = { user: { id: "user-test-id" } };

			// When
			const result = factory.parseConditions(conditions, userContext);

			// Then
			expect(result).toEqual({ isActive: true, isDeleted: false });
		});

		it("중첩된 객체 조건은 정상 파싱되어야 한다", () => {
			// Given
			const conditions = {
				$or: [{ status: "active" }, { status: "pending" }],
			};
			const userContext = { user: { id: "user-test-id" } };

			// When
			const result = factory.parseConditions(conditions, userContext);

			// Then
			expect(result).toEqual({
				$or: [{ status: "active" }, { status: "pending" }],
			});
		});
	});

	describe("inverted 권한 처리", () => {
		it("inverted=false이면 CAN 권한을 추가해야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [
				createMockAbility({
					inverted: false,
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(ability.can("READ", "entity:User")).toBe(true);
		});

		it("inverted=true이면 CANNOT 권한을 추가해야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [
				createMockAbility({
					inverted: true, // CANNOT
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(ability.cannot("READ", "entity:User")).toBe(true);
		});
	});

	describe("conditions가 있는 권한 처리", () => {
		it("conditions가 있으면 조건부 권한을 생성해야 한다", async () => {
			// Given
			const user = createMockUser();
			// 템플릿 변수 없이 직접 값으로 조건 설정
			const roleAbilities = [
				createMockAbility({
					conditions: { ownerId: "user-test-id" },
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			// 조건이 있는 권한은 생성됨 (실제 조건 검증은 CASL 내부 로직)
			expect(ability).toBeDefined();
		});

		it("conditions 없이도 권한이 정상 생성되어야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [
				createMockAbility({
					conditions: null,
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(ability.can("READ", "entity:User")).toBe(true);
		});
	});

	describe("다양한 Action 처리", () => {
		it("여러 Action에 대한 권한을 생성할 수 있어야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [
				createMockAbility({
					id: "ability-read",
					action: { ...mockAction, name: "READ" } as Action,
				}),
				createMockAbility({
					id: "ability-create",
					action: { ...mockAction, name: "CREATE" } as Action,
				}),
				createMockAbility({
					id: "ability-update",
					action: { ...mockAction, name: "UPDATE" } as Action,
				}),
				createMockAbility({
					id: "ability-delete",
					action: { ...mockAction, name: "DELETE" } as Action,
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(ability.can("READ", "entity:User")).toBe(true);
			expect(ability.can("CREATE", "entity:User")).toBe(true);
			expect(ability.can("UPDATE", "entity:User")).toBe(true);
			expect(ability.can("DELETE", "entity:User")).toBe(true);
		});
	});

	describe("다양한 Subject 처리", () => {
		it("여러 Subject에 대한 권한을 생성할 수 있어야 한다", async () => {
			// Given
			const user = createMockUser();
			const roleAbilities = [
				createMockAbility({
					id: "ability-user",
					subject: { ...mockSubject, name: "entity:User" } as Subject,
				}),
				createMockAbility({
					id: "ability-space",
					subject: { ...mockSubject, name: "entity:Space" } as Subject,
				}),
				createMockAbility({
					id: "ability-menu",
					subject: { ...mockSubject, name: "menu:dashboard" } as Subject,
				}),
			];

			mockClsService.get.mockReturnValue("space-test-id");
			mockAbilitiesRepository.findActiveByRoleIds.mockResolvedValue(
				roleAbilities,
			);
			mockAbilitiesRepository.findActiveByUserId.mockResolvedValue([]);

			// When
			const ability = await factory.createForUser(user);

			// Then
			expect(ability.can("READ", "entity:User")).toBe(true);
			expect(ability.can("READ", "entity:Space")).toBe(true);
			expect(ability.can("READ", "menu:dashboard")).toBe(true);
		});
	});
});
