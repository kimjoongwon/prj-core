import { SYSTEM_ROLES } from "@cocrepo/constant";
import type { CreateTenantAccessRequestDto } from "@cocrepo/dto";
import type { TenantAccessRequest } from "@cocrepo/entity";
import type { Prisma, TenantAccessRequestStatus } from "@cocrepo/prisma";
import {
	RolesRepository,
	SpacesRepository,
	TenantAccessRequestsRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

export interface TenantAccessRequestFormOptionItem {
	value: string;
	label: string;
	description?: string;
}

export interface TenantAccessRequestCreateFormBootstrap {
	mode: "CREATE";
	defaultObject: Record<string, unknown>;
	options: Record<string, TenantAccessRequestFormOptionItem[]>;
	ui: {
		readOnlyPaths: string[];
		hiddenPaths: string[];
		disabledPaths: string[];
	};
	fieldMeta: Record<string, { label?: string }>;
	aiSchemas: Array<{ key: string; label: string; paths: string[] }>;
}

interface ReviewerScope {
	hasFullAccess: boolean;
	managedSpaceIds: string[];
}

type ReviewerTenant = {
	removedAt?: Date | null;
	spaceId?: string | null;
	role?: { name?: string | null } | null;
};

@Injectable()
export class TenantAccessRequestService {
	private readonly logger = new Logger(TenantAccessRequestService.name);

	constructor(
		private readonly repository: TenantAccessRequestsRepository,
		private readonly tenantsRepository: TenantsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly spacesRepository: SpacesRepository,
		private readonly rolesRepository: RolesRepository,
	) {}

	async getCreateFormBootstrap(): Promise<TenantAccessRequestCreateFormBootstrap> {
		const [spaces, roles] = await Promise.all([
			this.spacesRepository.findManyWithGround({ take: 1000 }),
			this.rolesRepository.findAll(),
		]);
		const [spaceItems] = spaces;
		const spaceOptions = spaceItems.map((space) => ({
			value: space.id,
			label: space.ground?.name ?? space.id,
			description: space.ground?.address ?? undefined,
		}));
		const roleOptions = roles.map((role) => ({
			value: role.id,
			label: role.displayName ?? role.name,
			description: role.description ?? role.name,
		}));

		return {
			mode: "CREATE",
			defaultObject: {
				spaceId: spaceOptions[0]?.value ?? "",
				requestedRoleId: roleOptions[0]?.value ?? "",
				reason: "",
			},
			options: {
				spaceId: spaceOptions,
				requestedRoleId: roleOptions,
			},
			ui: {
				readOnlyPaths: [],
				hiddenPaths: [],
				disabledPaths: [],
			},
			fieldMeta: {
				spaceId: { label: "Space" },
				requestedRoleId: { label: "희망 역할" },
				reason: { label: "신청 사유" },
			},
			aiSchemas: [],
		};
	}

	async listMine(params: {
		requesterId: string;
		where: Prisma.TenantAccessRequestWhereInput;
		orderBy: Prisma.TenantAccessRequestOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: TenantAccessRequest[]; totalCount: number }> {
		return this.repository.findMany({
			where: {
				...params.where,
				requesterId: params.requesterId,
				removedAt: null,
			},
			orderBy: params.orderBy,
			skip: params.skip,
			take: params.take,
		});
	}

	async listForReview(params: {
		reviewerId: string;
		where: Prisma.TenantAccessRequestWhereInput;
		orderBy: Prisma.TenantAccessRequestOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: TenantAccessRequest[]; totalCount: number }> {
		const scope = await this.getReviewerScope(params.reviewerId);
		const scopedWhere = this.applyReviewerScope(params.where, scope);

		return this.repository.findMany({
			where: {
				...scopedWhere,
				removedAt: null,
			},
			orderBy: params.orderBy,
			skip: params.skip,
			take: params.take,
		});
	}

	async findForReview(params: {
		tenantAccessRequestId: string;
		reviewerId: string;
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
	async create(
		requesterId: string,
		dto: CreateTenantAccessRequestDto,
	): Promise<TenantAccessRequest> {
		this.logger.debug(
			`테넌트 접근 신청 생성 요청: requester=${requesterId.slice(-8)}`,
		);

		const [space, role, activeTenant, pendingRequest] = await Promise.all([
			this.spacesRepository.findById(dto.spaceId),
			this.rolesRepository.findById(dto.requestedRoleId),
			this.tenantsRepository.findActiveByUserIdAndSpaceId(
				requesterId,
				dto.spaceId,
			),
			this.repository.findPendingByRequesterAndSpace(requesterId, dto.spaceId),
		]);

		if (!space) {
			throw new NotFoundException("신청 대상 Space를 찾을 수 없습니다");
		}
		if (!role) {
			throw new NotFoundException("신청 대상 Role을 찾을 수 없습니다");
		}
		if (activeTenant?.roleId === dto.requestedRoleId) {
			throw new ConflictException(
				"이미 동일한 Space와 Role 권한을 보유 중입니다",
			);
		}
		if (pendingRequest) {
			throw new ConflictException(
				"해당 Space에 처리 대기 중인 신청이 있습니다",
			);
		}

		return this.repository.create({
			requesterId,
			spaceId: dto.spaceId,
			requestedRoleId: dto.requestedRoleId,
			previousRoleId: activeTenant?.roleId ?? null,
			reason: dto.reason ?? null,
			status: "PENDING",
		});
	}

	@Transactional()
	async cancel(params: {
		tenantAccessRequestId: string;
		requesterId: string;
	}): Promise<TenantAccessRequest> {
		const request = await this.getById(params.tenantAccessRequestId);

		if (request.requesterId !== params.requesterId) {
			throw new ForbiddenException("본인의 신청만 취소할 수 있습니다");
		}
		this.assertPending(request.status);

		return this.repository.updateById(params.tenantAccessRequestId, {
			status: "CANCELED",
		});
	}

	@Transactional()
	async approve(params: {
		tenantAccessRequestId: string;
		reviewerId: string;
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
		tenantAccessRequestId: string;
		reviewerId: string;
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

	private async getById(id: string): Promise<TenantAccessRequest> {
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
			AND: [where, { spaceId: { in: scope.managedSpaceIds } }],
		};
	}

	private async assertCanReview(params: {
		request: TenantAccessRequest;
		reviewerId: string;
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
			params.request.requestedRole?.name === SYSTEM_ROLES.FULL_ACCESS
		) {
			throw new ForbiddenException(
				"MANAGE 권한자는 FULL_ACCESS 역할 신청을 승인할 수 없습니다",
			);
		}
	}

	private async getReviewerScope(reviewerId: string): Promise<ReviewerScope> {
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
				(tenant) => tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS,
			),
			managedSpaceIds: activeTenants
				.filter((tenant) => tenant.role?.name === SYSTEM_ROLES.MANAGE)
				.map((tenant) => tenant.spaceId)
				.filter((spaceId): spaceId is string => Boolean(spaceId)),
		};
	}
}
