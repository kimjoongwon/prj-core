import { subject } from "@casl/ability";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { RoleAssignmentsRepository } from "@cocrepo/repository";
import type { ContextUserSnapshot } from "@cocrepo/type";
import { Test, type TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { CaslAbilityFactory } from "../casl-ability.factory";

describe("CaslAbilityFactory", () => {
	let factory: CaslAbilityFactory;
	let mockRoleAssignmentsRepository: jest.Mocked<RoleAssignmentsRepository>;
	let mockClsService: jest.Mocked<ClsService>;

	beforeEach(async () => {
		mockRoleAssignmentsRepository = {
			findActiveByRoleIdsInSpace: jest.fn(),
		} as unknown as jest.Mocked<RoleAssignmentsRepository>;

		mockClsService = {
			get: jest.fn(),
		} as unknown as jest.Mocked<ClsService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CaslAbilityFactory,
				{
					provide: RoleAssignmentsRepository,
					useValue: mockRoleAssignmentsRepository,
				},
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		factory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
	});

	it("팩토리가 정의되어야 한다", () => {
		expect(factory).toBeDefined();
	});

	it("Role Policy로부터 권한을 생성해야 한다", async () => {
		const user = {
			id: "01JSER00000000000000000C01",
			email: "u1@test.com",
			name: "u1",
			tenants: [
				{
					id: "01JTENANT00000000000000201",
					space: { id: "01JSPACE000000000000000301" },
					role: { id: "01JTASK0000000000000000401" },
				},
			],
		} as unknown as ContextUserSnapshot;

		mockClsService.get.mockImplementation((key) =>
			key === CONTEXT_KEYS.TENANT_ID ? "01JTENANT00000000000000201" : undefined,
		);
		mockRoleAssignmentsRepository.findActiveByRoleIdsInSpace.mockResolvedValue([
			{
				priority: 1,
				createdAt: new Date("2026-01-01T00:00:00.000Z"),
				policy: {
					entries: [
						{
							ability: {
								subject: { name: "entity:User" },
								action: { name: "READ" },
								inverted: false,
								fields: [],
								conditions: null,
							},
						},
					],
				},
			},
		] as never);
		const ability = await factory.createForUser(user);
		expect(ability.can("READ", "entity:User")).toBe(true);
	});

	it("같은 권한 조합에서는 RoleAssignment priority가 높은 정책이 우선해야 한다", async () => {
		const user = {
			id: 101n,
			spaceSeq: 301n,
			email: "u1@test.com",
			name: "u1",
			tenants: [
				{
					id: 201n,
					spaceSeq: 301n,
					roleSeq: 401n,
					role: { id: 401n },
				},
			],
		} as unknown as ContextUserSnapshot;

		mockClsService.get.mockImplementation((key) =>
			key === CONTEXT_KEYS.TENANT_ID ? 201n : undefined,
		);
		mockRoleAssignmentsRepository.findActiveByRoleIdsInSpace.mockResolvedValue([
			{
				priority: 1,
				createdAt: new Date("2026-01-01T00:00:00.000Z"),
				policy: {
					entries: [
						{
							ability: {
								subject: { name: "entity:User" },
								action: { name: "READ" },
								inverted: false,
								fields: [],
								conditions: null,
							},
						},
					],
				},
			},
			{
				priority: 10,
				createdAt: new Date("2026-01-02T00:00:00.000Z"),
				policy: {
					entries: [
						{
							ability: {
								subject: { name: "entity:User" },
								action: { name: "READ" },
								inverted: true,
								fields: [],
								conditions: null,
							},
						},
					],
				},
			},
		] as never);

		const ability = await factory.createForUser(user);
		expect(ability.cannot("READ", "entity:User")).toBe(true);
	});

	it("현재 space 컨텍스트가 없으면 빈 권한을 생성해야 한다", async () => {
		const user = {
			id: 101n,
			spaceSeq: 301n,
			email: "u1@test.com",
			name: "u1",
			tenants: [
				{
					id: 201n,
					spaceSeq: 301n,
					roleSeq: 401n,
					role: { id: 401n },
				},
			],
		} as unknown as ContextUserSnapshot;

		mockClsService.get.mockImplementation((key) =>
			key === CONTEXT_KEYS.SPACE_ID ? undefined : undefined,
		);

		const ability = await factory.createForUser(user);
		expect(ability.can("READ", "entity:User")).toBe(false);
		expect(
			mockRoleAssignmentsRepository.findActiveByRoleIdsInSpace,
		).not.toHaveBeenCalled();
	});

	it("같은 spaceId에 중복 tenant가 있어도 첫 tenant의 roleId로 조회해야 한다", async () => {
		const user = {
			id: "01JSER00000000000000000C01",
			email: "u1@test.com",
			name: "u1",
			tenants: [
				{
					id: "01JTENANT00000000000000201",
					space: { id: "01JSPACE000000000000000301" },
					role: { id: "01JTASK0000000000000000401", name: "PLATFORM_ADMIN" },
				},
				{
					id: "01JTENANT00000000000000202",
					space: { id: "01JSPACE000000000000000301" },
					role: { id: "01JTASK0000000000000000402", name: "COMPANY_MANAGER" },
				},
			],
		} as unknown as ContextUserSnapshot;

		mockClsService.get.mockImplementation((key) =>
			key === CONTEXT_KEYS.TENANT_ID ? "01JTENANT00000000000000201" : undefined,
		);
		mockRoleAssignmentsRepository.findActiveByRoleIdsInSpace.mockResolvedValue(
			[] as never,
		);

		await factory.createForUser(user);

		expect(
			mockRoleAssignmentsRepository.findActiveByRoleIdsInSpace,
		).toHaveBeenCalledWith(
			["01JTASK0000000000000000401"],
			"01JSPACE000000000000000301",
		);
	});

	it("조건의 ID 템플릿을 정밀도 손실 없이 bigint로 치환해야 한다", () => {
		const databaseId = 9007199254740993n;

		const conditions = factory.parseConditions(
			{
				spaceSeq: "${user.currentSpaceId}",
				label: "space-${user.currentSpaceId}",
				nested: { tenantId: "${user.currentTenantSeq}" },
			},
			{
				user: {
					currentSpaceId: databaseId,
					currentTenantSeq: 201n,
				},
			},
		);

		expect(conditions).toEqual({
			spaceSeq: databaseId,
			label: `space-${databaseId}`,
			nested: { tenantId: 201n },
		});
	});

	describe("본인 예약 조건", () => {
		const ownUserSeq = 9007199254740993n;
		const currentTenant = {
			id: "01JTENANT00000000000000201",
			userSeq: ownUserSeq,
			space: { id: "01JSPACE000000000000000301" },
			role: { id: "01JTASK0000000000000000401" },
		};
		const user: ContextUserSnapshot = {
			id: "01JSER00000000000000000C01",
			tenants: [currentTenant],
		};

		beforeEach(() => {
			mockClsService.get.mockImplementation((key) =>
				key === CONTEXT_KEYS.TENANT_ID ? currentTenant.id : undefined,
			);
		});

		function provideReservationPolicy(conditions: unknown, inverted = false) {
			const assignment = {
				priority: 1,
				policy: {
					entries: ["READ", "UPDATE"].map((actionName) => ({
						ability: {
							subject: { name: "entity:Reservation" },
							action: { name: actionName },
							inverted,
							conditions,
						},
					})),
				},
			};
			mockRoleAssignmentsRepository.findActiveByRoleIdsInSpace.mockResolvedValue(
				[assignment] as never,
			);
			return assignment;
		}

		it("READ와 UPDATE는 내부 사용자 FK가 일치하는 예약만 허용해야 한다", async () => {
			provideReservationPolicy({ userSeq: "${user.seq}" });

			const ability = await factory.createForUser(user);

			for (const action of ["READ", "UPDATE"] as const) {
				expect(
					ability.can(
						action,
						subject("entity:Reservation", { userSeq: ownUserSeq }),
					),
				).toBe(true);
				expect(
					ability.can(
						action,
						subject("entity:Reservation", { userSeq: ownUserSeq + 1n }),
					),
				).toBe(false);
				expect(
					ability.can(
						action,
						subject("entity:Reservation", { userSeq: user.id }),
					),
				).toBe(false);
				expect(ability.can(action, subject("entity:Reservation", {}))).toBe(
					false,
				);
			}
			expect(ability.rules.map((rule) => rule.conditions)).toEqual([
				{ userSeq: ownUserSeq },
				{ userSeq: ownUserSeq },
			]);
		});

		it.each([
			undefined,
			null,
			"9007199254740993",
			0n,
			-1n,
			9223372036854775808n,
		])(
			"내부 사용자 FK가 유효하지 않으면 빈 권한이어야 한다: %s",
			async (userSeq) => {
				provideReservationPolicy({ userSeq: "${user.seq}" });
				const ability = await factory.createForUser({
					...user,
					tenants: [{ ...currentTenant, userSeq }],
				} as ContextUserSnapshot);

				expect(ability.rules).toEqual([]);
				expect(ability.can("READ", "entity:Reservation")).toBe(false);
			},
		);

		it.each(
			[
				{ userSeq: "{{ user.id }}" },
				{ userSeq: "${user.unknown}" },
				{ userSeq: "${user.seq" },
				{ userSeq: "${}" },
				{ userSeq: { $ne: "${user.email}" } },
				"invalid-condition",
				[],
				false,
			].map((conditions) => ({ conditions })),
		)(
			"잘못된 조건이면 이미 적용된 허용 규칙도 반환하지 않아야 한다: %j",
			async ({ conditions }) => {
				const assignment = provideReservationPolicy(conditions);
				assignment.policy.entries.unshift({
					ability: {
						subject: { name: "all" },
						action: { name: "READ" },
						conditions: null,
						inverted: false,
					},
				});

				const ability = await factory.createForUser(user);

				expect(ability.rules).toEqual([]);
				expect(
					ability.can(
						"READ",
						subject("entity:Reservation", { userSeq: ownUserSeq }),
					),
				).toBe(false);
			},
		);

		it("거부 조건이 잘못된 경우에도 빈 권한을 반환해야 한다", async () => {
			const assignment = provideReservationPolicy(
				{ userSeq: "${user.unknown}" },
				true,
			);
			assignment.policy.entries.unshift({
				ability: {
					subject: { name: "all" },
					action: { name: "READ" },
					conditions: null,
					inverted: false,
				},
			});
			const ability = await factory.createForUser(user);
			expect(ability.rules).toEqual([]);
			expect(
				ability.can(
					"READ",
					subject("entity:Reservation", { userSeq: ownUserSeq }),
				),
			).toBe(false);
		});

		it("공개 사용자 ID 템플릿은 ULID 문자열을 유지해야 한다", () => {
			expect(factory.parseConditions({ id: "${user.id}" }, { user })).toEqual({
				id: user.id,
			});
		});
	});
});
