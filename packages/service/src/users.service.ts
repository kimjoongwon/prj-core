import { UserStats, UsersRepository } from "@cocrepo/repository";
import { HashedPassword, PlainPassword } from "@cocrepo/vo";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

/**
 * 회원 목록 조회 결과
 */
export interface GetMembersResult {
	users: Awaited<
		ReturnType<UsersRepository["findManyBySpaceIdWithRelations"]>
	>["users"];
	totalCount: number;
	stats: UserStats;
}

/**
 * 회원 관리 서비스 에러 메시지
 */
const UserServiceErrorMessages = {
	USER_NOT_FOUND: "회원을 찾을 수 없습니다",
	EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다",
	PHONE_ALREADY_EXISTS: "이미 사용 중인 전화번호입니다",
	NAME_ALREADY_EXISTS: "이미 사용 중인 이름입니다",
	SPACE_ACCESS_DENIED: "해당 Space에 접근 권한이 없습니다",
	CANNOT_DELETE_SELF: "자신의 계정은 삭제할 수 없습니다",
} as const;

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

	constructor(private readonly repository: UsersRepository) {}

	/**
	 * ID로 사용자 조회 (Tenant 정보 포함)
	 */
	getByIdWithTenants(id: string) {
		return this.repository.findByIdWithTenantsAndProfiles(id);
	}

	/**
	 * 인증용 유저 조회 (이메일 기반)
	 */
	findUserForAuth(email: string) {
		return this.repository.findByEmailWithTenantsAndProfiles(email);
	}

	/**
	 * Space 내 회원 목록 조회
	 * 필터링, 검색, 페이지네이션, 통계 정보를 함께 반환합니다.
	 */
	async getMembersBySpace(params: {
		spaceId: string;
		search?: string;
		roles?: string[];
		status?: "active" | "inactive" | "removed";
		categoryId?: string;
		groupIds?: string[];
		createdFrom?: Date;
		createdTo?: Date;
		sortBy?: string;
		sortOrder?: "asc" | "desc";
		skip?: number;
		take?: number;
	}): Promise<GetMembersResult> {
		this.logger.debug(`Space 내 회원 목록 조회: spaceId=${params.spaceId}`);

		// 회원 목록과 통계를 병렬로 조회
		const [{ users, totalCount }, stats] = await Promise.all([
			this.repository.findManyBySpaceIdWithRelations(params),
			this.repository.getStatsBySpaceId(params.spaceId),
		]);

		return {
			users,
			totalCount,
			stats,
		};
	}

	/**
	 * Space 내 회원 상세 조회
	 * 해당 Space에 접근 권한이 있는 회원만 조회 가능합니다.
	 */
	async getMemberDetailForSpace(userId: string, spaceId: string) {
		this.logger.debug(
			`Space 내 회원 상세 조회: userId=${userId}, spaceId=${spaceId}`,
		);

		const user = await this.repository.findByIdAndSpaceIdWithRelations(
			userId,
			spaceId,
		);

		if (!user) {
			throw new NotFoundException(UserServiceErrorMessages.USER_NOT_FOUND);
		}

		return user;
	}

	/**
	 * 회원 등록
	 * 중복 검사 후 회원을 생성합니다.
	 */
	async createMemberForSpace(params: {
		name: string;
		email: string;
		phone: string;
		password: string;
		spaceId: string;
		roleId: string;
		categoryId?: string;
		groupIds?: string[];
	}) {
		this.logger.debug(`회원 등록: email=${params.email}`);

		// 중복 검사
		await this.validateUniqueness(params.email, params.phone, params.name);

		// 비밀번호 해싱
		const plainPassword = PlainPassword.create(params.password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);

		// 회원 생성 - Prisma.UserCreateInput 형태로 전달
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
	 * 회원 수정
	 * Space 권한 검증 후 회원 정보를 수정합니다.
	 */
	async updateMemberForSpace(
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
		this.logger.debug(`회원 수정: userId=${userId}, spaceId=${spaceId}`);

		// 회원 존재 및 Space 접근 권한 확인
		const existingUser = await this.repository.findByIdAndSpaceIdWithRelations(
			userId,
			spaceId,
		);

		if (!existingUser) {
			throw new NotFoundException(UserServiceErrorMessages.USER_NOT_FOUND);
		}

		// 중복 검사 (변경된 필드만)
		if (params.email && params.email !== existingUser.email) {
			const emailExists = await this.repository.existsByEmail(params.email);
			if (emailExists) {
				throw new BadRequestException(
					UserServiceErrorMessages.EMAIL_ALREADY_EXISTS,
				);
			}
		}

		if (params.phone && params.phone !== existingUser.phone) {
			const phoneExists = await this.repository.existsByPhone(params.phone);
			if (phoneExists) {
				throw new BadRequestException(
					UserServiceErrorMessages.PHONE_ALREADY_EXISTS,
				);
			}
		}

		if (params.name && params.name !== existingUser.name) {
			const nameExists = await this.repository.existsByName(params.name);
			if (nameExists) {
				throw new BadRequestException(
					UserServiceErrorMessages.NAME_ALREADY_EXISTS,
				);
			}
		}

		// 회원 수정
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

		return updatedUser;
	}

	/**
	 * 회원 삭제 (Soft Delete)
	 * Space 권한 검증 후 회원을 삭제합니다.
	 */
	async deleteMemberForSpace(
		userId: string,
		spaceId: string,
		currentUserId: string,
	) {
		this.logger.debug(`회원 삭제: userId=${userId}, spaceId=${spaceId}`);

		// 자기 자신 삭제 방지
		if (userId === currentUserId) {
			throw new BadRequestException(
				UserServiceErrorMessages.CANNOT_DELETE_SELF,
			);
		}

		// 회원 존재 및 Space 접근 권한 확인
		const existingUser = await this.repository.findByIdAndSpaceIdWithRelations(
			userId,
			spaceId,
		);

		if (!existingUser) {
			throw new NotFoundException(UserServiceErrorMessages.USER_NOT_FOUND);
		}

		// 회원 삭제 (Soft Delete)
		await this.repository.removeById(userId);
	}

	/**
	 * 현재 사용자의 선택된 Space를 변경합니다.
	 *
	 * 비즈니스 로직:
	 * 1. 사용자가 해당 Space에 접근 권한이 있는지 검증 (Tenant 확인)
	 * 2. 검증 통과 시 User.selectedSpaceId 업데이트
	 * 3. 업데이트된 selectedSpaceId 반환
	 *
	 * @param userId - 사용자 ID
	 * @param spaceId - 변경할 Space ID
	 * @returns 업데이트된 selectedSpaceId
	 * @throws ForbiddenException - Space 접근 권한이 없는 경우
	 */
	async updateSelectedSpaceForCurrentUser(
		userId: string,
		spaceId: string,
	): Promise<string> {
		// 1. Space 접근 권한 검증
		const hasAccess = await this.repository.existsTenantByUserIdAndSpaceId(
			userId,
			spaceId,
		);

		if (!hasAccess) {
			throw new ForbiddenException(
				"해당 Space에 접근 권한이 없습니다. Tenant 목록을 확인해주세요.",
			);
		}

		// 2. selectedSpaceId 업데이트
		const updatedSpaceId = await this.repository.updateSelectedSpaceIdById(
			userId,
			spaceId,
		);

		return updatedSpaceId;
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
				UserServiceErrorMessages.EMAIL_ALREADY_EXISTS,
			);
		}

		if (phoneExists) {
			throw new BadRequestException(
				UserServiceErrorMessages.PHONE_ALREADY_EXISTS,
			);
		}

		if (nameExists) {
			throw new BadRequestException(
				UserServiceErrorMessages.NAME_ALREADY_EXISTS,
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
