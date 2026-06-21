jest.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) =>
			descriptor,
}));

import { SYSTEM_ROLES } from "@cocrepo/constant";
import type { Tenant, TenantAccessRequest } from "@cocrepo/entity";
import {
	TenantAccessRequestsRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { ForbiddenException } from "@nestjs/common";
import { TenantAccessRequestAggregate } from "../src/tenant-access-request/tenant-access-request.aggregate";

describe("TenantAccessRequestAggregate", () => {
	let service: TenantAccessRequestAggregate;
	let repository: jest.Mocked<TenantAccessRequestsRepository>;
	let tenantsRepository: jest.Mocked<TenantsRepository>;
	let usersRepository: jest.Mocked<UsersRepository>;

	const managedSpaceId = "11111111-1111-4111-8111-111111111111";
	const otherSpaceId = "22222222-2222-4222-8222-222222222222";
	const requesterId = "33333333-3333-4333-8333-333333333333";
	const reviewerId = "44444444-4444-4444-8444-444444444444";
	const requestId = "55555555-5555-4555-8555-555555555555";
	const memberRoleId = "66666666-6666-4666-8666-666666666666";
	const platformAdminRoleId = "77777777-7777-4777-8777-777777777777";

	beforeEach(() => {
		repository = {
			findByIdWithRelations: jest.fn(),
			findPendingByRequesterAndSpace: jest.fn(),
			findMany: jest.fn(),
			create: jest.fn(),
			updateById: jest.fn(),
		} as unknown as jest.Mocked<TenantAccessRequestsRepository>;
		tenantsRepository = {
			findActiveByUserIdAndSpaceId: jest.fn(),
			upsertByUserIdAndSpaceId: jest.fn(),
		} as unknown as jest.Mocked<TenantsRepository>;
		usersRepository = {
			findByIdWithTenantsAndProfiles: jest.fn(),
		} as unknown as jest.Mocked<UsersRepository>;
		service = new TenantAccessRequestAggregate(
			repository,
			tenantsRepository,
			usersRepository,
		);
	});

	it("COMPANY_MANAGER는 본인 Space의 non-PLATFORM_ADMIN 신청을 승인할 수 있다", async () => {
		repository.findByIdWithRelations.mockResolvedValue(
			buildRequest({ spaceId: managedSpaceId }),
		);
		usersRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(
			buildReviewer({
				roleName: SYSTEM_ROLES.COMPANY_MANAGER,
				spaceId: managedSpaceId,
			}),
		);
		tenantsRepository.upsertByUserIdAndSpaceId.mockResolvedValue({
			id: "tenant-applied-id",
		} as unknown as Tenant);
		repository.updateById.mockResolvedValue(
			buildRequest({ status: "APPROVED" }),
		);

		await service.approve({
			tenantAccessRequestId: requestId,
			reviewerId,
			reviewComment: "승인합니다.",
		});

		expect(tenantsRepository.upsertByUserIdAndSpaceId).toHaveBeenCalledWith({
			userId: requesterId,
			spaceId: managedSpaceId,
			roleId: memberRoleId,
		});
		expect(repository.updateById).toHaveBeenCalledWith(
			requestId,
			expect.objectContaining({
				status: "APPROVED",
				reviewerId,
				reviewComment: "승인합니다.",
				appliedTenantId: "tenant-applied-id",
			}),
		);
	});

	it("COMPANY_MANAGER가 다른 Space 신청을 승인하면 403을 반환한다", async () => {
		repository.findByIdWithRelations.mockResolvedValue(
			buildRequest({ spaceId: otherSpaceId }),
		);
		usersRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(
			buildReviewer({
				roleName: SYSTEM_ROLES.COMPANY_MANAGER,
				spaceId: managedSpaceId,
			}),
		);

		await expect(
			service.approve({
				tenantAccessRequestId: requestId,
				reviewerId,
			}),
		).rejects.toThrow(ForbiddenException);
		expect(tenantsRepository.upsertByUserIdAndSpaceId).not.toHaveBeenCalled();
	});

	it("COMPANY_MANAGER가 PLATFORM_ADMIN 신청을 승인하면 403을 반환한다", async () => {
		repository.findByIdWithRelations.mockResolvedValue(
			buildRequest({
				requestedRoleId: platformAdminRoleId,
				requestedRole: {
					id: platformAdminRoleId,
					name: SYSTEM_ROLES.PLATFORM_ADMIN,
					displayName: "PLATFORM_ADMIN",
				},
			}),
		);
		usersRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(
			buildReviewer({
				roleName: SYSTEM_ROLES.COMPANY_MANAGER,
				spaceId: managedSpaceId,
			}),
		);

		await expect(
			service.approve({
				tenantAccessRequestId: requestId,
				reviewerId,
			}),
		).rejects.toThrow(ForbiddenException);
		expect(tenantsRepository.upsertByUserIdAndSpaceId).not.toHaveBeenCalled();
	});

	it("COMPANY_MANAGER는 본인 Space의 PLATFORM_ADMIN 신청을 반려할 수 있다", async () => {
		repository.findByIdWithRelations.mockResolvedValue(
			buildRequest({
				requestedRoleId: platformAdminRoleId,
				requestedRole: {
					id: platformAdminRoleId,
					name: SYSTEM_ROLES.PLATFORM_ADMIN,
					displayName: "PLATFORM_ADMIN",
				},
			}),
		);
		usersRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(
			buildReviewer({
				roleName: SYSTEM_ROLES.COMPANY_MANAGER,
				spaceId: managedSpaceId,
			}),
		);
		repository.updateById.mockResolvedValue(
			buildRequest({ status: "REJECTED" }),
		);

		await service.reject({
			tenantAccessRequestId: requestId,
			reviewerId,
			reviewComment: "PLATFORM_ADMIN은 플랫폼 관리자가 처리합니다.",
		});

		expect(tenantsRepository.upsertByUserIdAndSpaceId).not.toHaveBeenCalled();
		expect(repository.updateById).toHaveBeenCalledWith(
			requestId,
			expect.objectContaining({
				status: "REJECTED",
				reviewerId,
				reviewComment: "PLATFORM_ADMIN은 플랫폼 관리자가 처리합니다.",
			}),
		);
	});

	it("PLATFORM_ADMIN은 모든 Space와 Role 신청을 승인할 수 있다", async () => {
		repository.findByIdWithRelations.mockResolvedValue(
			buildRequest({
				spaceId: otherSpaceId,
				requestedRoleId: platformAdminRoleId,
				requestedRole: {
					id: platformAdminRoleId,
					name: SYSTEM_ROLES.PLATFORM_ADMIN,
					displayName: "PLATFORM_ADMIN",
				},
			}),
		);
		usersRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(
			buildReviewer({
				roleName: SYSTEM_ROLES.PLATFORM_ADMIN,
				spaceId: managedSpaceId,
			}),
		);
		tenantsRepository.upsertByUserIdAndSpaceId.mockResolvedValue({
			id: "tenant-applied-id",
		} as unknown as Tenant);
		repository.updateById.mockResolvedValue(
			buildRequest({ status: "APPROVED" }),
		);

		await service.approve({
			tenantAccessRequestId: requestId,
			reviewerId,
		});

		expect(tenantsRepository.upsertByUserIdAndSpaceId).toHaveBeenCalledWith({
			userId: requesterId,
			spaceId: otherSpaceId,
			roleId: platformAdminRoleId,
		});
	});

	function buildRequest(
		overrides: Record<string, unknown> = {},
	): TenantAccessRequest {
		return {
			id: requestId,
			requesterId,
			spaceId: managedSpaceId,
			requestedRoleId: memberRoleId,
			previousRoleId: null,
			reason: "업무 권한이 필요합니다.",
			status: "PENDING",
			reviewerId: null,
			reviewComment: null,
			reviewedAt: null,
			appliedTenantId: null,
			requestedRole: {
				id: memberRoleId,
				name: SYSTEM_ROLES.MEMBER,
				displayName: "MEMBER",
			},
			...overrides,
		} as unknown as TenantAccessRequest;
	}

	type ReviewerWithTenants = NonNullable<
		Awaited<ReturnType<UsersRepository["findByIdWithTenantsAndProfiles"]>>
	>;

	function buildReviewer(params: { roleName: string; spaceId: string }) {
		return {
			id: reviewerId,
			tenants: [
				{
					removedAt: null,
					spaceId: params.spaceId,
					role: {
						name: params.roleName,
					},
				},
			],
		} as unknown as ReviewerWithTenants;
	}
});
