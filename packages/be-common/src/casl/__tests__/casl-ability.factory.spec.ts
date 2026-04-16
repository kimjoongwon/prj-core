import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { UserDto } from "@cocrepo/dto";
import {
	RoleGrantsRepository,
	UserGrantsRepository,
} from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { CaslAbilityFactory } from "../casl-ability.factory";

describe("CaslAbilityFactory", () => {
	let factory: CaslAbilityFactory;
	let mockRoleGrantsRepository: jest.Mocked<RoleGrantsRepository>;
	let mockUserGrantsRepository: jest.Mocked<UserGrantsRepository>;
	let mockClsService: jest.Mocked<ClsService>;

	beforeEach(async () => {
		mockRoleGrantsRepository = {
			findActiveByRoleIds: jest.fn(),
		} as unknown as jest.Mocked<RoleGrantsRepository>;

		mockUserGrantsRepository = {
			findActiveByUserId: jest.fn(),
		} as unknown as jest.Mocked<UserGrantsRepository>;

		mockClsService = {
			get: jest.fn(),
		} as unknown as jest.Mocked<ClsService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CaslAbilityFactory,
				{
					provide: RoleGrantsRepository,
					useValue: mockRoleGrantsRepository,
				},
				{
					provide: UserGrantsRepository,
					useValue: mockUserGrantsRepository,
				},
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		factory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
	});

	it("팩토리가 정의되어야 한다", () => {
		expect(factory).toBeDefined();
	});

	it("Role Grant로부터 권한을 생성해야 한다", async () => {
		const user = {
			id: "user-1",
			spaceId: "space-1",
			email: "u1@test.com",
			name: "u1",
			tenants: [{ id: "tenant-1", spaceId: "space-1", roleId: "role-1", role: { id: "role-1" } }],
		} as unknown as UserDto;

		mockClsService.get.mockReturnValueOnce("space-1");
		mockRoleGrantsRepository.findActiveByRoleIds.mockResolvedValue([
			{
				priority: 1,
				ability: {
					subject: { name: "entity:User" },
					action: { name: "READ" },
					inverted: false,
					fields: [],
					conditions: null,
				},
			},
		] as never);
		mockUserGrantsRepository.findActiveByUserId.mockResolvedValue([] as never);

		const ability = await factory.createForUser(user);
		expect(ability.can("READ", "entity:User")).toBe(true);
	});

	it("User 예외 Grant가 더 높은 priority면 우선해야 한다", async () => {
		const user = {
			id: "user-1",
			spaceId: "space-1",
			email: "u1@test.com",
			name: "u1",
			tenants: [{ id: "tenant-1", spaceId: "space-1", roleId: "role-1", role: { id: "role-1" } }],
		} as unknown as UserDto;

		mockClsService.get.mockReturnValueOnce("space-1");
		mockRoleGrantsRepository.findActiveByRoleIds.mockResolvedValue([
			{
				priority: 1,
				ability: {
					subject: { name: "entity:User" },
					action: { name: "READ" },
					inverted: false,
					fields: [],
					conditions: null,
				},
			},
		] as never);
		mockUserGrantsRepository.findActiveByUserId.mockResolvedValue([
			{
				priority: 10,
				ability: {
					subject: { name: "entity:User" },
					action: { name: "READ" },
					inverted: true,
					fields: [],
					conditions: null,
				},
			},
		] as never);

		const ability = await factory.createForUser(user);
		expect(ability.cannot("READ", "entity:User")).toBe(true);
	});

	it("현재 space 컨텍스트가 없으면 첫 tenant로 계산해야 한다", async () => {
		const user = {
			id: "user-1",
			spaceId: "space-1",
			email: "u1@test.com",
			name: "u1",
			tenants: [{ id: "tenant-1", spaceId: "space-1", roleId: "role-1", role: { id: "role-1" } }],
		} as unknown as UserDto;

		mockClsService.get.mockImplementation((key) =>
			key === CONTEXT_KEYS.SPACE_ID ? undefined : undefined,
		);
		mockRoleGrantsRepository.findActiveByRoleIds.mockResolvedValue([] as never);
		mockUserGrantsRepository.findActiveByUserId.mockResolvedValue([] as never);

		await factory.createForUser(user);
		expect(mockRoleGrantsRepository.findActiveByRoleIds).toHaveBeenCalledWith([
			"role-1",
		]);
	});

it("같은 spaceId에 중복 tenant가 있어도 첫 tenant의 roleId로 조회해야 한다", async () => {
		const user = {
			id: "user-1",
			spaceId: "space-1",
			email: "u1@test.com",
			name: "u1",
			tenants: [
				{
					id: "tenant-full-access",
					spaceId: "space-1",
					roleId: "role-full-access",
					role: { id: "role-full-access", name: "FULL_ACCESS" },
				},
				{
					id: "tenant-manage",
					spaceId: "space-1",
					roleId: "role-manage",
					role: { id: "role-manage", name: "MANAGE" },
				},
			],
		} as unknown as UserDto;

		mockClsService.get.mockReturnValueOnce("space-1");
		mockRoleGrantsRepository.findActiveByRoleIds.mockResolvedValue([] as never);
		mockUserGrantsRepository.findActiveByUserId.mockResolvedValue([] as never);

		await factory.createForUser(user);

		expect(mockRoleGrantsRepository.findActiveByRoleIds).toHaveBeenCalledWith([
			"role-full-access",
		]);
	});
});
