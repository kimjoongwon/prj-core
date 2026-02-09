import { SpaceContext } from "@cocrepo/be-common";
import { USER_ERRORS } from "@cocrepo/constant";
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
import { AuthCacheService } from "./auth-cache.service";

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
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

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
	 * 접근 가능한 Space 내 사용자 목록 조회
	 * CLS 컨텍스트에서 ACCESSIBLE_SPACE_IDS를 가져와 필터링합니다.
	 * DTO → Prisma 변환을 Service에서 수행하고 Repository에는 원시값만 전달합니다.
	 */
	async getUsersBySpace(query: QueryUsersDto): Promise<GetUsersResult> {
		const spaceIds = this.spaceCtx.spaceIds;
		this.logger.debug(`접근 가능 Space 내 사용자 목록 조회: spaceIds=${spaceIds.length}개`);

		const baseWhere: Partial<Prisma.UserWhereInput> = {
			tenants: { some: { spaceId: { in: spaceIds }, removedAt: null } },
		};

		const where = query.toPrismaWhere(baseWhere);
		const orderBy = query.toPrismaOrderBy();

		const [{ users, totalCount }, stats] = await Promise.all([
			this.repository.findManyBySpaceIds({
				where,
				orderBy,
				skip: query.skip ?? 0,
				take: query.take ?? 10,
				spaceIds,
			}),
			this.repository.countStatsBySpaceIds(spaceIds),
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
	 * 사용자 등록
	 * 중복 검사 후 사용자를 생성합니다.
	 */
	async createUserForSpace(params: {
		name: string;
		email: string;
		phone: string;
		password: string;
		spaceId: string;
		roleId: string;
		categoryId?: string;
		groupIds?: string[];
	}) {
		this.logger.debug(`사용자 등록: email=${params.email}`);

		// 중복 검사
		await this.validateUniqueness(params.email, params.phone, params.name);

		// 비밀번호 해싱
		const plainPassword = PlainPassword.create(params.password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);

		// 사용자 생성 - Prisma.UserCreateInput 형태로 전달
		const user = await this.repository.createWithRelations({
			name: params.name,
			email: params.email,
			phone: params.phone,
			password: hashedPassword.value,
			tenants: {
				create: {
					space: { connect: { id: params.spaceId } },
					role: { connect: { id: params.roleId } },
				},
			},
			profiles: {
				create: {
					name: params.name,
					nickname: params.name,
				},
			},
			...(params.categoryId && {
				classification: {
					create: {
						category: { connect: { id: params.categoryId } },
					},
				},
			}),
			...(params.groupIds &&
				params.groupIds.length > 0 && {
					associations: {
						create: params.groupIds.map((groupId) => ({
							group: { connect: { id: groupId } },
						})),
					},
				}),
		});

		return user;
	}

	/**
	 * 사용자 수정
	 * Space 권한 검증 후 사용자 정보를 수정합니다.
	 */
	async updateUserForSpace(
		userId: string,
		spaceId: string,
		params: {
			name?: string;
			email?: string;
			phone?: string;
			categoryId?: string;
			groupIds?: string[];
		},
	) {
		this.logger.debug(`사용자 수정: userId=${userId}, spaceId=${spaceId}`);

		// 사용자 존재 및 Space 접근 권한 확인
		const existingUser = await this.repository.findByIdAndSpaceIdWithRelations(
			userId,
			spaceId,
		);

		if (!existingUser) {
			throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
		}

		// 중복 검사 (변경된 필드만)
		if (params.email && params.email !== existingUser.email) {
			const emailExists = await this.repository.existsByEmail(params.email);
			if (emailExists) {
				throw new BadRequestException(
					USER_ERRORS.EMAIL_ALREADY_EXISTS,
				);
			}
		}

		if (params.phone && params.phone !== existingUser.phone) {
			const phoneExists = await this.repository.existsByPhone(params.phone);
			if (phoneExists) {
				throw new BadRequestException(
					USER_ERRORS.PHONE_ALREADY_EXISTS,
				);
			}
		}

		if (params.name && params.name !== existingUser.name) {
			const nameExists = await this.repository.existsByName(params.name);
			if (nameExists) {
				throw new BadRequestException(
					USER_ERRORS.NAME_ALREADY_EXISTS,
				);
			}
		}

		// 사용자 수정
		const updatedUser = await this.repository.updateByIdWithRelations(
			userId,
			{
				name: params.name,
				email: params.email,
				phone: params.phone,
			},
			{
				categoryId: params.categoryId,
				groupIds: params.groupIds,
			},
		);

		await this.authCacheService.invalidate(userId);
		return updatedUser;
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
	 * 회원가입용 사용자 생성 (Tenant, Profile 포함)
	 * Facade에서 사용
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
