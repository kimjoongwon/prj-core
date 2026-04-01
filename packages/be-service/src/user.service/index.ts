import { SpaceContext } from "@cocrepo/context";
import { USER_ERRORS } from "@cocrepo/constant";
import { validatePasswordPolicy } from "@cocrepo/toolkit";
import type { QueryUsersDto } from "@cocrepo/dto";
import type { Prisma } from "@cocrepo/prisma";
import { UsersRepository } from "@cocrepo/repository";
import type { UserStats } from "@cocrepo/type";
import { HashedPassword, PlainPassword } from "@cocrepo/vo";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { AuthCacheService } from "../auth-cache.service";

/**
 * 사용자 목록 조회 결과
 */
export interface GetUsersResult {
	users: Awaited<
		ReturnType<UsersRepository["findManyBySpaceIds"]>
	>["users"];
	totalCount: number;
	stats: UserStats;
}


@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		private readonly repository: UsersRepository,
		private readonly spaceCtx: SpaceContext,
		private readonly authCacheService: AuthCacheService,
	) {}

	/**
	 * ID로 사용자 조회 (Tenant 정보 포함)
	 */
	getByIdWithTenants(id: string) {
		return this.repository.findByIdWithTenantsAndProfiles(id);
	}

	/**
	 * 인증용 경량 유저 조회 (이메일 기반, id/email/password만)
	 */
	findUserForAuth(email: string) {
		return this.repository.findByEmailSelectCredentials(email);
	}

	/**
	 * 현재 선택 Space 내 사용자 목록 조회
	 * selectedSpaceId 기준으로 현재 Space 사용자만 필터링합니다.
	 * DTO → Prisma 변환을 Service에서 수행하고 Repository에는 원시값만 전달합니다.
	 */
	async getUsersBySpace(query: QueryUsersDto): Promise<GetUsersResult> {
		const currentSpaceId = this.spaceCtx.spaceId;
		this.logger.debug(
			`현재 Space 내 사용자 목록 조회: spaceId=${currentSpaceId ?? "없음"}`,
		);

		const baseWhere: Partial<Prisma.UserWhereInput> = currentSpaceId
			? {
					tenants: {
						some: { spaceId: currentSpaceId, removedAt: null },
					},
				}
			: {};

		const where = query.toPrismaWhere(baseWhere);
		const orderBy = query.toPrismaOrderBy();

		const [{ users, totalCount }, stats] = await Promise.all([
			this.repository.findManyBySpaceIds({
				where,
				orderBy,
				skip: query.skip ?? 0,
				take: query.take ?? 10,
				spaceIds: currentSpaceId ? [currentSpaceId] : undefined,
			}),
			this.repository.countStatsBySpaceIds(
				currentSpaceId ? [currentSpaceId] : undefined,
			),
		]);

		return {
			users,
			totalCount,
			stats,
		};
	}

	/**
	 * Space 내 사용자 상세 조회
	 * 해당 Space에 접근 권한이 있는 사용자만 조회 가능합니다.
	 */
	async getUserDetailForSpace(userId: string, spaceId: string) {
		this.logger.debug(
			`Space 내 사용자 상세 조회: userId=${userId}, spaceId=${spaceId}`,
		);

		const user = await this.repository.findByIdAndSpaceIdWithRelations(
			userId,
			spaceId,
		);

		if (!user) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		return user;
	}

	/**
	 * 사용자 삭제 (Soft Delete)
	 * Space 권한 검증 후 사용자를 삭제합니다.
	 */
	async deleteUserForSpace(
		userId: string,
		spaceId: string,
		currentUserId: string,
	) {
		this.logger.debug(`사용자 삭제: userId=${userId}, spaceId=${spaceId}`);

		// 자기 자신 삭제 방지
		if (userId === currentUserId) {
			throw new BadRequestException(
				USER_ERRORS.CANNOT_DELETE_SELF,
			);
		}

		// 사용자 존재 및 Space 접근 권한 확인
		const existingUser = await this.repository.findByIdAndSpaceIdWithRelations(
			userId,
			spaceId,
		);

		if (!existingUser) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		// 사용자 삭제 (Soft Delete)
		await this.repository.removeById(userId);
		await this.authCacheService.invalidate(userId);
	}

	/**
	 * 비밀번호 변경
	 *
	 * 1. 현재 비밀번호 검증
	 * 2. 비밀번호 정책 검증
	 * 3. 이전 비밀번호 재사용 확인
	 * 4. 비밀번호 변경 + 히스토리 저장
	 */
	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string,
	): Promise<void> {
		this.logger.debug(`비밀번호 변경: userId=${userId.slice(-8)}`);

		// 1. 현재 비밀번호 확인
		const user = await this.repository.findPasswordById(userId);
		if (!user) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		const currentHashed = HashedPassword.fromHash(user.password);
		const currentPlain = PlainPassword.create(currentPassword);
		const isCurrentValid = await currentHashed.compare(currentPlain);
		if (!isCurrentValid) {
			throw new BadRequestException("CURRENT_PASSWORD_INCORRECT");
		}

		// 2. 비밀번호 정책 검증
		const policyResult = validatePasswordPolicy(newPassword);
		if (!policyResult.isValid) {
			const failedRules = policyResult.rules
				.filter((r) => !r.passed)
				.map((r) => r.label)
				.join(", ");
			throw new BadRequestException(
				`PASSWORD_POLICY_VIOLATION: ${failedRules}`,
			);
		}

		// 3. 현재 비밀번호와 동일한지 확인
		const newPlain = PlainPassword.create(newPassword);
		const isSameAsCurrent = await currentHashed.compare(newPlain);
		if (isSameAsCurrent) {
			throw new BadRequestException("PASSWORD_REUSE");
		}

		// 4. 이전 비밀번호 재사용 확인 (최근 5개)
		const histories = await this.repository.getPasswordHistory(userId, 5);
		for (const history of histories) {
			const historyHashed = HashedPassword.fromHash(history.passwordHash);
			const isReused = await historyHashed.compare(newPlain);
			if (isReused) {
				throw new BadRequestException("PASSWORD_REUSE");
			}
		}

		// 5. 비밀번호 변경
		const newHashed = await HashedPassword.fromPlain(newPlain);
		await this.repository.updatePassword(userId, newHashed.value);

		// 6. 히스토리 저장 (이전 비밀번호를 히스토리에 추가)
		await this.repository.addPasswordHistory(userId, user.password);
		await this.repository.prunePasswordHistory(userId, 5);

		// 7. 인증 캐시 무효화
		await this.authCacheService.invalidate(userId);
	}

	/**
	 * 계정 잠금 해제 (관리자 전용)
	 */
	async unlockAccount(userId: string): Promise<void> {
		this.logger.debug(`계정 잠금 해제: userId=${userId.slice(-8)}`);

		const user = await this.repository.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		await this.repository.unlockAccount(userId);
		await this.authCacheService.invalidate(userId);
	}

	/**
	 * 비밀번호 강제 재설정 (관리자 전용)
	 * 임시 비밀번호를 생성하고 이메일로 발송합니다.
	 *
	 * @returns 생성된 임시 비밀번호 (관리자 확인용)
	 */
	async forceResetPassword(userId: string): Promise<{ temporaryPassword: string; email: string }> {
		this.logger.debug(`비밀번호 강제 재설정: userId=${userId.slice(-8)}`);

		const securityInfo = await this.repository.findSecurityInfoById(userId);
		if (!securityInfo) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		// 임시 비밀번호 생성 (12자리, 대소문자+숫자+특수문자)
		const temporaryPassword = this.generateTemporaryPassword();

		// 비밀번호 변경
		const plainPassword = PlainPassword.create(temporaryPassword);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);
		await this.repository.updatePassword(userId, hashedPassword.value);

		// 잠금도 해제
		await this.repository.unlockAccount(userId);

		// 캐시 무효화
		await this.authCacheService.invalidate(userId);

		return { temporaryPassword, email: securityInfo.email };
	}

	/**
	 * 사용자 보안 정보 조회 (관리자 전용)
	 */
	async getSecurityInfo(userId: string) {
		this.logger.debug(`사용자 보안 정보 조회: userId=${userId.slice(-8)}`);

		const info = await this.repository.findSecurityInfoById(userId);
		if (!info) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		return info;
	}

	/**
	 * 고유성 검증 (이메일, 전화번호, 이름)
	 */
	private async validateUniqueness(
		email: string,
		phone: string,
		name: string,
	): Promise<void> {
		const [emailExists, phoneExists, nameExists] = await Promise.all([
			this.repository.existsByEmail(email),
			this.repository.existsByPhone(phone),
			this.repository.existsByName(name),
		]);

		if (emailExists) {
			throw new BadRequestException(
				USER_ERRORS.EMAIL_ALREADY_EXISTS,
			);
		}

		if (phoneExists) {
			throw new BadRequestException(
				USER_ERRORS.PHONE_ALREADY_EXISTS,
			);
		}

		if (nameExists) {
			throw new BadRequestException(
				USER_ERRORS.NAME_ALREADY_EXISTS,
			);
		}
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
		return password.split("").sort(() => Math.random() - 0.5).join("");
	}

	/**
	 * 회원가입용 사용자 생성 (Tenant, Profile 포함)
	 * ApplicationService에서 사용
	 */
	createUserForSignUp(params: {
		name: string;
		email: string;
		phone: string;
		password: string;
		spaceId: string;
		roleId: string;
		nickname?: string;
	}) {
		this.logger.debug(`회원가입 사용자 생성: email=${params.email}`);
		return this.repository.createWithRelations({
			name: params.name,
			email: params.email,
			phone: params.phone,
			password: params.password,
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
				},
			},
		});
	}
}
