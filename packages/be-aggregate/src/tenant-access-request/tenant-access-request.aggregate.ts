import { SYSTEM_ROLES } from "@cocrepo/constant";
import type { TenantAccessRequest } from "@cocrepo/entity";
import type { ListTenantAccessRequestsForReviewQueryInput } from "@cocrepo/input";
import type { Prisma, TenantAccessRequestStatus } from "@cocrepo/prisma";
import {
	buildTenantAccessRequestQueryOrderBy,
	buildTenantAccessRequestQueryWhere,
	TenantAccessRequestsRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import type { ReviewerScope } from "./reviewer-scope";
import type { ReviewerTenant } from "./reviewer-tenant";

@Injectable()
export class TenantAccessRequestAggregate {
	constructor(
		private readonly repository: TenantAccessRequestsRepository,
		private readonly tenantsRepository: TenantsRepository,
		private readonly usersRepository: UsersRepository,
	) {}

	async listForReview(
		params: ListTenantAccessRequestsForReviewQueryInput,
	): Promise<{ items: TenantAccessRequest[]; totalCount: number }> {
		const scope = await this.getReviewerScope(params.reviewerId);
		const scopedWhere = this.applyReviewerScope(
			buildTenantAccessRequestQueryWhere(params),
			scope,
		);

		return this.repository.findMany({
			where: {
				...scopedWhere,
				removedAt: null,
			},
			orderBy: buildTenantAccessRequestQueryOrderBy(params),
			skip: params.skip,
			take: params.take,
		});
	}

	async findForReview(params: {
		tenantAccessRequestId: bigint;
		reviewerId: bigint;
	}): Promise<TenantAccessRequest> {
		const request = await this.getById(params.tenantAccessRequestId);
		await this.assertCanReview({
			request,
			reviewerId: params.reviewerId,
			action: "read",
		});
		return request;
	}

	@Transactional()
	async approve(params: {
		tenantAccessRequestId: bigint;
		reviewerId: bigint;
		reviewComment?: string | null;
	}): Promise<TenantAccessRequest> {
		const request = await this.getById(params.tenantAccessRequestId);
		this.assertPending(request.status);
		await this.assertCanReview({
			request,
			reviewerId: params.reviewerId,
			action: "approve",
		});

		const tenant = await this.tenantsRepository.upsertByUserIdAndSpaceId({
			userId: request.requesterId,
			spaceId: request.spaceId,
			roleId: request.requestedRoleId,
		});

		return this.repository.updateById(params.tenantAccessRequestId, {
			status: "APPROVED",
			reviewerId: params.reviewerId,
			reviewComment: params.reviewComment ?? null,
			reviewedAt: new Date(),
			appliedTenantId: tenant.id,
		});
	}

	@Transactional()
	async reject(params: {
		tenantAccessRequestId: bigint;
		reviewerId: bigint;
		reviewComment?: string | null;
	}): Promise<TenantAccessRequest> {
		const request = await this.getById(params.tenantAccessRequestId);
		this.assertPending(request.status);
		await this.assertCanReview({
			request,
			reviewerId: params.reviewerId,
			action: "reject",
		});

		return this.repository.updateById(params.tenantAccessRequestId, {
			status: "REJECTED",
			reviewerId: params.reviewerId,
			reviewComment: params.reviewComment ?? null,
			reviewedAt: new Date(),
		});
	}

	private async getById(id: bigint): Promise<TenantAccessRequest> {
		const request = await this.repository.findByIdWithRelations(id);
		if (!request) {
			throw new NotFoundException("테넌트 접근 신청을 찾을 수 없습니다");
		}
		return request;
	}

	private assertPending(status: TenantAccessRequestStatus): void {
		if (status !== "PENDING") {
			throw new BadRequestException("처리 대기 중인 신청만 변경할 수 있습니다");
		}
	}

	private applyReviewerScope(
		where: Prisma.TenantAccessRequestWhereInput,
		scope: ReviewerScope,
	): Prisma.TenantAccessRequestWhereInput {
		if (scope.hasFullAccess) {
			return where;
		}

		if (scope.managedSpaceIds.length === 0) {
			return {
				...where,
				id: { in: [] },
			};
		}

		return {
			AND: [where, { space: { id: { in: scope.managedSpaceIds } } }],
		};
	}

	private async assertCanReview(params: {
		request: TenantAccessRequest;
		reviewerId: bigint;
		action: "read" | "approve" | "reject";
	}): Promise<void> {
		const scope = await this.getReviewerScope(params.reviewerId);
		if (scope.hasFullAccess) {
			return;
		}

		if (!scope.managedSpaceIds.includes(params.request.spaceId)) {
			throw new ForbiddenException("해당 Space 신청을 처리할 권한이 없습니다");
		}

		if (
			params.action === "approve" &&
			params.request.requestedRole?.name === SYSTEM_ROLES.PLATFORM_ADMIN
		) {
			throw new ForbiddenException(
				"COMPANY_MANAGER 권한자는 PLATFORM_ADMIN 역할 신청을 승인할 수 없습니다",
			);
		}
	}

	private async getReviewerScope(reviewerId: bigint): Promise<ReviewerScope> {
		const reviewer =
			await this.usersRepository.findByIdWithTenantsAndProfiles(reviewerId);
		if (!reviewer) {
			throw new NotFoundException("검토자를 찾을 수 없습니다");
		}

		const activeTenants = (reviewer.tenants ?? [])
			.map((tenant) => tenant as ReviewerTenant)
			.filter((tenant) => tenant.removedAt == null);

		return {
			hasFullAccess: activeTenants.some(
				(tenant) => tenant.role?.name === SYSTEM_ROLES.PLATFORM_ADMIN,
			),
			managedSpaceIds: activeTenants
				.filter((tenant) => tenant.role?.name === SYSTEM_ROLES.COMPANY_MANAGER)
				.map((tenant) => tenant.spaceId)
				.filter(
					(spaceId): spaceId is bigint =>
						spaceId !== undefined && spaceId !== null,
				),
		};
	}
}
