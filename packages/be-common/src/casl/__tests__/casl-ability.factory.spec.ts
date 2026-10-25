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
		).toHaveBeenCalledWith(["01JTASK0000000000000000401"], "01JSPACE000000000000000301");
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
});
