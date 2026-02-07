import { SYSTEM_ROLES } from "@cocrepo/constant";
import { Role } from "@cocrepo/entity";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { RolesRepository } from "../src/roles.repository";

describe("RolesRepository", () => {
	let repository: RolesRepository;
	let mockTxHost: {
		tx: {
			role: {
				findUnique: jest.Mock;
				findFirst: jest.Mock;
				findMany: jest.Mock;
				create: jest.Mock;
				update: jest.Mock;
			};
		};
	};

	const mockRoleData = {
		id: "role-test-id",
		name: SYSTEM_ROLES.VIEW,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
	};

	beforeEach(async () => {
		mockTxHost = {
			tx: {
				role: {
					findUnique: jest.fn(),
					findFirst: jest.fn(),
					findMany: jest.fn(),
					create: jest.fn(),
					update: jest.fn(),
				},
			},
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RolesRepository,
				{
					provide: TransactionHost,
					useValue: mockTxHost,
				},
			],
		}).compile();

		repository = module.get<RolesRepository>(RolesRepository);
	});

	it("리포지토리가 정의되어야 한다", () => {
		expect(repository).toBeDefined();
	});

	describe("findById", () => {
		it("ID로 역할을 조회해야 한다", async () => {
			// Given
			const roleId = "role-test-id";
			mockTxHost.tx.role.findUnique.mockResolvedValue(mockRoleData);

			// When
			const result = await repository.findById(roleId);

			// Then
			expect(mockTxHost.tx.role.findUnique).toHaveBeenCalledWith({
				where: { id: roleId },
			});
			expect(result).toBeInstanceOf(Role);
			expect(result?.id).toBe(mockRoleData.id);
			expect(result?.name).toBe(mockRoleData.name);
		});

		it("역할이 없으면 null을 반환해야 한다", async () => {
			// Given
			const roleId = "non-existent-role";
			mockTxHost.tx.role.findUnique.mockResolvedValue(null);

			// When
			const result = await repository.findById(roleId);

			// Then
			expect(mockTxHost.tx.role.findUnique).toHaveBeenCalledWith({
				where: { id: roleId },
			});
			expect(result).toBeNull();
		});
	});

	describe("findByName", () => {
		it("이름으로 역할을 조회해야 한다", async () => {
			// Given
			const roleName = SYSTEM_ROLES.VIEW;
			mockTxHost.tx.role.findFirst.mockResolvedValue(mockRoleData);

			// When
			const result = await repository.findByName(roleName);

			// Then
			expect(mockTxHost.tx.role.findFirst).toHaveBeenCalledWith({
				where: { name: roleName },
			});
			expect(result).toBeInstanceOf(Role);
			expect(result?.name).toBe(roleName);
		});

		it("역할을 찾지 못하면 null을 반환해야 한다", async () => {
			// Given
			const roleName = SYSTEM_ROLES.MANAGE;
			mockTxHost.tx.role.findFirst.mockResolvedValue(null);

			// When
			const result = await repository.findByName(roleName);

			// Then
			expect(mockTxHost.tx.role.findFirst).toHaveBeenCalledWith({
				where: { name: roleName },
			});
			expect(result).toBeNull();
		});
	});

	describe("findAll", () => {
		it("전체 역할 목록을 조회해야 한다", async () => {
			// Given
			const mockRoles = [
				mockRoleData,
				{ ...mockRoleData, id: "role-2", name: SYSTEM_ROLES.MANAGE },
			];
			mockTxHost.tx.role.findMany.mockResolvedValue(mockRoles);

			// When
			const result = await repository.findAll();

			// Then
			expect(mockTxHost.tx.role.findMany).toHaveBeenCalledWith({
				orderBy: { createdAt: "asc" },
			});
			expect(result).toHaveLength(2);
			expect(result[0]).toBeInstanceOf(Role);
		});

		it("역할이 없으면 빈 배열을 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.role.findMany.mockResolvedValue([]);

			// When
			const result = await repository.findAll();

			// Then
			expect(result).toEqual([]);
		});
	});

	describe("create", () => {
		it("새 역할을 생성해야 한다", async () => {
			// Given
			const createData = {
				name: SYSTEM_ROLES.MANAGE,
			};
			mockTxHost.tx.role.create.mockResolvedValue({
				...mockRoleData,
				name: SYSTEM_ROLES.MANAGE,
			});

			// When
			const result = await repository.create(createData);

			// Then
			expect(mockTxHost.tx.role.create).toHaveBeenCalledWith({
				data: createData,
			});
			expect(result).toBeInstanceOf(Role);
			expect(result.name).toBe(createData.name);
		});
	});

	describe("updateById", () => {
		it("역할을 수정해야 한다", async () => {
			// Given
			const roleId = "role-test-id";
			const updateData = { name: SYSTEM_ROLES.MANAGE };
			mockTxHost.tx.role.update.mockResolvedValue({
				...mockRoleData,
				name: SYSTEM_ROLES.MANAGE,
			});

			// When
			const result = await repository.updateById(roleId, updateData);

			// Then
			expect(mockTxHost.tx.role.update).toHaveBeenCalledWith({
				where: { id: roleId },
				data: updateData,
			});
			expect(result).toBeInstanceOf(Role);
			expect(result.name).toBe(updateData.name);
		});
	});
});
