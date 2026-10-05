import { USER_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import type { Tenant, User } from "@cocrepo/entity";
import type { GetUsersInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	buildUserQueryOrderBy,
	buildUserQueryWhere,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { Email, HashedPassword, Phone, PlainPassword } from "@cocrepo/vo";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AuthCacheService } from "../auth/auth-cache.service";
import type { GetUsersResult } from "./get-users.result";

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		private readonly repository: UsersRepository,
		private readonly tenantsRepository: TenantsRepository,
		private readonly spaceCtx: SpaceContext,
		private readonly authCacheService: AuthCacheService,
	) {}

	/**
	 * 공개 사용자 식별자로 사용자 조회 (Tenant 정보 포함)
	 */
	findByUserIdWithTenants(userId: string): Promise<User | null> {
		return this.repository.findByUserIdWithTenantsAndProfiles(userId);
	}

	/** 내부 숫자 ID로 사용자와 Tenant/Profile 권한 그래프를 조회합니다. */
	getByIdWithTenants(userId: bigint): Promise<User | null> {
		return this.repository.findByIdWithTenantsAndProfiles(userId);
	}

	/**
	 * 현재 Space에서 사용자에게 속한 Tenant 상세와 권한 그래프를 조회합니다.
	 */
	async getTenantDetailForUser(
		userId: bigint,
		tenantId: bigint,
		_spaceId: bigint,
	): Promise<Tenant> {
		const [user, tenantSnapshot] = await Promise.all([
			this.repository.findById(userId),
			this.tenantsRepository.findById(tenantId),
		]);
		if (!user || !tenantSnapshot?.tenantId || !tenantSnapshot.space?.spaceId) {
			throw new NotFoundException("사용자의 테넌트를 찾을 수 없습니다");
		}

		const tenant = await this.repository.findTenantDetailForUserInSpace(
			user.userId,
			tenantSnapshot.tenantId,
			tenantSnapshot.space.spaceId,
		);
		if (!tenant) {
			throw new NotFoundException("사용자의 테넌트를 찾을 수 없습니다");
		}
		return tenant;
	}

	/** 현재 Tenant를 영구 저장하고 인증 사용자 캐시를 무효화합니다. */
	async setCurrentTenant(userId: bigint, tenantId: bigint): Promise<void> {
		const user = await this.repository.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		await this.repository.updateCurrentTenantId(userId, tenantId);
		await this.authCacheService.invalidate(user.userId);
	}

	/**
	 * 인증용 경량 유저 조회 (이메일 기반, id/email/password만)
	 */
	findUserForAuth(email: string) {
		const normalizedEmail = Email.create(email);
		return this.repository.findByEmailSelectCredentials(normalizedEmail.value);
	}

	/**
	 * 현재 선택 Space 내 사용자 목록 조회
	 * x-tenant-id 기준으로 현재 Tenant를 해석하고,
	 * 현재 tenant role이 PLATFORM_ADMIN이면 전체 사용자,
	 * 그 외에는 현재 Tenant의 Space 사용자만 필터링합니다.
	 * UseCase에서 Prisma 조건으로 변환한 입력에 Space scope를 합성합니다.
	 */
	async getUsersBySpace(input: GetUsersInput): Promise<GetUsersResult> {
		const currentSpaceId = this.spaceCtx.spaceId;
		const scopedSpaceIds = this.spaceCtx.spaceIds;

		this.logger.debug(
			`회원 목록 조회: requestedSpaceId=${currentSpaceId ?? "없음"}, scope=${scopedSpaceIds?.join(",") ?? "all"}`,
		);

		const where = this.applySpaceScope(
			buildUserQueryWhere(input),
			scopedSpaceIds,
		);

		const [{ users, totalCount }, stats] = await Promise.all([
			this.repository.findManyBySpaceIds({
				where,
				orderBy: buildUserQueryOrderBy(input),
				skip: input.skip ?? 0,
				take: input.take ?? 10,
				spaceIds: scopedSpaceIds,
				includedRoleNames: input.roles,
			}),
			this.repository.countStatsBySpaceIds({
				spaceIds: scopedSpaceIds,
			}),
		]);

		return {
			users,
			totalCount,
			stats,
		};
	}

	private applySpaceScope(
		where: Prisma.UserWhereInput,
		scopedSpaceIds?: bigint[],
	): Prisma.UserWhereInput {
		if (scopedSpaceIds === undefined) {
			return where;
		}

		const existingTenants = where.tenants as
			| { some?: Record<string, unknown> }
			| undefined;
		const existingTenantSome = existingTenants?.some ?? {};

		return {
			...where,
			tenants: {
				some: {
					...existingTenantSome,
					space: { id: { in: scopedSpaceIds } },
					removedAt: null,
				},
			},
		};
	}

	/**
	 * Space 내 사용자 상세 조회
	 * 현재 요청의 유효 Space 범위에 접근 권한이 있는 사용자만 조회 가능합니다.
	 * PLATFORM_ADMIN처럼 유효 범위가 undefined면 Space 제한 없이 조회합니다.
	 *
	 * @param userId 조회할 사용자 ULID
	 * @param spaceId 현재 선택된 Space ULID
	 * @returns 접근 범위 안의 사용자 상세
	 */
	async getUserDetailForSpace(
		userId: bigint,
		spaceId: bigint,
	): Promise<User> {
		const scopedSpaceIds = this.spaceCtx.spaceIds;
		this.logger.debug(
			`Space 내 사용자 상세 조회: userId=${userId.toString()}, selectedSpaceId=${spaceId.toString()}, scope=${scopedSpaceIds?.join(",") ?? "all"}`,
		);

		const targetUser = await this.repository.findById(userId);
		if (!targetUser?.userId) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		const user = await this.repository.findByIdAndSpaceIdsWithRelations(
			targetUser.userId,
			scopedSpaceIds,
		);

		if (!user) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		return user;
	}

	/**
	 * 계정 잠금 해제 (관리자 전용)
	 */
	async unlockAccount(userId: bigint): Promise<void> {
		this.logger.debug(`계정 잠금 해제: userId=${userId.toString()}`);

		const user = await this.repository.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		await this.repository.unlockAccount(user.userId);
		await this.authCacheService.invalidate(user.userId);
	}

	/**
	 * 비밀번호 강제 재설정 (관리자 전용)
	 * 임시 비밀번호를 생성하고 이메일로 발송합니다.
	 *
	 * @returns 생성된 임시 비밀번호 (관리자 확인용)
	 */
	async forceResetPassword(
		userId: bigint,
	): Promise<{ temporaryPassword: string; email: string }> {
		this.logger.debug(`비밀번호 강제 재설정: userId=${userId.toString()}`);

		const user = await this.repository.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		// 임시 비밀번호 생성 (12자리, 대소문자+숫자+특수문자)
		const temporaryPassword = this.generateTemporaryPassword();

		// 비밀번호 변경
		const plainPassword = PlainPassword.create(temporaryPassword);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);
		await this.repository.updatePassword(user.userId, hashedPassword.value);

		// 잠금도 해제
		await this.repository.unlockAccount(user.userId);

		// 캐시 무효화
		await this.authCacheService.invalidate(user.userId);

		return { temporaryPassword, email: user.email };
	}

	/**
	 * 사용자 보안 정보 조회 (관리자 전용)
	 */
	async getSecurityInfo(userId: bigint) {
		this.logger.debug(`사용자 보안 정보 조회: userId=${userId.toString()}`);

		const user = await this.repository.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		const info = await this.repository.findSecurityInfoById(user.userId);
		if (!info) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		return info;
	}

	/**
	 * 임시 비밀번호 생성 (12자리)
	 */
	private generateTemporaryPassword(): string {
		const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
		const lower = "abcdefghjkmnpqrstuvwxyz";
		const digits = "23456789";
		const special = "!@#$%&*";
		const all = upper + lower + digits + special;

		let password = "";
		// 각 종류에서 최소 1개씩
		password += upper[Math.floor(Math.random() * upper.length)];
		password += lower[Math.floor(Math.random() * lower.length)];
		password += digits[Math.floor(Math.random() * digits.length)];
		password += special[Math.floor(Math.random() * special.length)];

		// 나머지 8자리 랜덤
		for (let i = 0; i < 8; i++) {
			password += all[Math.floor(Math.random() * all.length)];
		}

		// 셔플
		return password
			.split("")
			.sort(() => Math.random() - 0.5)
			.join("");
	}

	/**
	 * 회원가입용 사용자 생성 (Tenant, Profile 포함)
	 * UseCase에서 사용
	 */
	createUserForSignUp(params: {
		name: string;
		email: string;
		phone: string;
		address: string;
		password: string;
		spaceId: bigint;
		roleId: bigint;
		nickname?: string;
	}): Promise<User> {
		const email = Email.create(params.email);
		const phone = Phone.create(params.phone);

		this.logger.debug(`회원가입 사용자 생성: email=${email.value}`);
		return this.repository.createWithRelations({
			name: params.name,
			email: email.value,
			phone: phone.normalized,
			password: params.password,
			status: {
				create: {},
			},
			tenants: {
				create: {
					space: { connect: { id: params.spaceId } },
					role: { connect: { id: params.roleId } },
				},
			},
			profiles: {
				create: {
					name: params.name,
					nickname: params.nickname || params.name,
					address: params.address,
				},
			},
		});
	}
}
