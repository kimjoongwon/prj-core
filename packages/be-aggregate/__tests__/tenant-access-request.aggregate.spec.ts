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

	const managedSpaceId = "01JSPACE0000000000000000M1";
	const otherSpaceId = "01JSPACE0000000000000000O2";
	const requesterId = "01JDDDDDDDDDDDDDDDDDDDDDDDD";
	const reviewerId = "01JREVIEWER000000000000000R1";
	const requestId = "01JREQUEST00000000000000055";
	const memberRoleId = 666n;
	const platformAdminRoleId = 777n;

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
			id: 888n,
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
				appliedTenant: { connect: { id: 888n } },
			}),
		);
	});

	it("COMPANY_MANAGER가 다른 Space 신청을 승인하면 403을 반환한다", async () => {
		repository.findByIdWithRelations.mockResolvedValue(
			buildRequest({ space: { id: "01JSPACE0000000000000000O2" } }),
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
				requestedRoleSeq: platformAdminRoleId,
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
				requestedRoleSeq: platformAdminRoleId,
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
				spaceSeq: otherSpaceId,
				requestedRoleSeq: platformAdminRoleId,
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
			id: 999n,
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
			spaceId: "01JSPACE0000000000000000M1",
			roleId: platformAdminRoleId,
		});
	});

	function buildRequest(
		overrides: Record<string, unknown> = {},
	): TenantAccessRequest {
		return {
			id: requestId,
			requester: { id: requesterId },
			space: { id: managedSpaceId },
			previousRoleSeq: null,
			reason: "업무 권한이 필요합니다.",
			status: "PENDING",
			reviewerId: null,
			reviewComment: null,
			reviewedAt: null,
			appliedTenantSeq: null,
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
					space: { id: params.spaceId },
					role: {
						name: params.roleName,
					},
				},
			],
		} as unknown as ReviewerWithTenants;
	}
});
