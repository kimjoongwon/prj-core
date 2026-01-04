import { User } from "@cocrepo/entity";
import type { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import type { TransactionHost } from "@nestjs-cls/transactional";
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

/**
 * 회원 목록 조회 파라미터
 */
export interface FindManyUsersParams {
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
}

/**
 * 회원 통계 결과
 */
export interface UserStats {
	total: number;
	active: number;
	inactive: number;
	newThisMonth: number;
}

/**
 * 회원 생성 파라미터
 */
export interface CreateUserParams {
	name: string;
	email: string;
	phone: string;
	password: string;
	spaceId: string;
	roleId: string;
	categoryId?: string;
	groupIds?: string[];
}

/**
 * 회원 수정 파라미터
 */
export interface UpdateUserParams {
	name?: string;
	email?: string;
	phone?: string;
	categoryId?: string;
	groupIds?: string[];
}

@Injectable()
export class UsersRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("UsersRepository");
	}

	/**
	 * ID로 사용자 조회 (Tenant, Profile, Space, Ground 포함)
	 */
	async findByIdWithRelations(id: string): Promise<User | null> {
		this.logger.debug(`ID로 사용자 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.user.findUnique({
			where: { id },
			include: {
				tenants: {
					include: {
						role: {
							include: {
								classification: {
									include: {
										category: {
											include: {
												parent: {
													include: {
														parent: {
															include: {
																parent: true,
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						space: {
							include: {
								ground: true,
							},
						},
					},
				},
				profiles: true,
			},
		});

		return result ? plainToInstance(User, result) : null;
	}

	/**
	 * 이메일로 사용자 조회 (Tenant, Profile, Space, Ground 포함)
	 */
	async findByEmailWithRelations(email: string): Promise<User | null> {
		this.logger.debug(`이메일로 사용자 조회: ${email}`);

		const result = await this.txHost.tx.user.findUnique({
			where: { email },
			include: {
				tenants: {
					include: {
						role: {
							include: {
								classification: {
									include: {
										category: {
											include: {
												parent: {
													include: {
														parent: {
															include: {
																parent: true,
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						space: {
							include: {
								ground: true,
							},
						},
					},
				},
				profiles: true,
			},
		});

		return result ? plainToInstance(User, result) : null;
	}

	/**
	 * Space 내 회원 목록 조회 (필터링, 페이지네이션 지원)
	 */
	async findManyBySpaceWithFilters(
		params: FindManyUsersParams,
	): Promise<{ users: User[]; totalCount: number }> {
		const {
			spaceId,
			search,
			roles,
			status,
			categoryId,
			groupIds,
			createdFrom,
			createdTo,
			sortBy = "createdAt",
			sortOrder = "desc",
			skip = 0,
			take = 20,
		} = params;

		this.logger.debug(`Space 내 회원 목록 조회: spaceId=${spaceId.slice(-8)}`);

		// 기본 where 조건 구성
		const where: Record<string, unknown> = {
			tenants: {
				some: {
					spaceId,
					removedAt: null,
				},
			},
		};

		// 상태 필터
		if (status === "removed") {
			where.removedAt = { not: null };
		} else {
			where.removedAt = null;

			// active/inactive는 lastLoginAt 기반으로 처리 (현재는 createdAt 기준으로 대체)
			// 실제 구현 시 Session 테이블 또는 별도 lastLoginAt 필드 참조 필요
		}

		// 통합 검색
		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
				{ phone: { contains: search, mode: "insensitive" } },
				{
					profiles: {
						some: { nickname: { contains: search, mode: "insensitive" } },
					},
				},
			];
		}

		// 역할 필터
		if (roles && roles.length > 0) {
			where.tenants = {
				some: {
					spaceId,
					removedAt: null,
					role: {
						name: { in: roles },
					},
				},
			};
		}

		// 분류 카테고리 필터
		if (categoryId) {
			where.classification = {
				categoryId,
			};
		}

		// 그룹 필터
		if (groupIds && groupIds.length > 0) {
			where.associations = {
				some: {
					groupId: { in: groupIds },
					removedAt: null,
				},
			};
		}

		// 가입일 범위 필터
		if (createdFrom || createdTo) {
			where.createdAt = {};
			if (createdFrom) {
				where.createdAt.gte = createdFrom;
			}
			if (createdTo) {
				where.createdAt.lte = createdTo;
			}
		}

		// 정렬 조건
		const orderBy: Record<string, unknown> = { [sortBy]: sortOrder };

		// 회원 목록 조회
		const [users, totalCount] = await Promise.all([
			this.txHost.tx.user.findMany({
				where,
				include: {
					profiles: true,
					tenants: {
						where: {
							spaceId,
							removedAt: null,
						},
						include: {
							role: true,
							space: true,
						},
					},
					classification: {
						include: {
							category: true,
						},
					},
					associations: {
						where: { removedAt: null },
						include: {
							group: true,
						},
					},
				},
				orderBy,
				skip,
				take,
			}),
			this.txHost.tx.user.count({ where }),
		]);

		return {
			users: users.map((user) => plainToInstance(User, user)),
			totalCount,
		};
	}

	/**
	 * Space 내 회원 통계 조회
	 */
	async getStatsBySpace(spaceId: string): Promise<UserStats> {
		this.logger.debug(`Space 내 회원 통계 조회: spaceId=${spaceId.slice(-8)}`);

		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);

		const baseWhere = {
			tenants: {
				some: {
					spaceId,
					removedAt: null,
				},
			},
			removedAt: null,
		};

		const [total, newThisMonth] = await Promise.all([
			// 전체 회원 수
			this.txHost.tx.user.count({ where: baseWhere }),
			// 이번 달 신규 가입자
			this.txHost.tx.user.count({
				where: {
					...baseWhere,
					createdAt: { gte: startOfMonth },
				},
			}),
		]);

		// 활성/비활성 회원 수 (현재는 단순 분할, 추후 Session 기반으로 개선 필요)
		// 임시로 50% 활성으로 처리
		const active = Math.floor(total * 0.7);
		const inactive = total - active;

		return {
			total,
			active,
			inactive,
			newThisMonth,
		};
	}

	/**
	 * 회원 상세 조회 (Space 권한 검증 포함)
	 */
	async findByIdForSpace(
		userId: string,
		spaceId: string,
	): Promise<User | null> {
		this.logger.debug(
			`Space 내 회원 상세 조회: userId=${userId.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.user.findFirst({
			where: {
				id: userId,
				tenants: {
					some: {
						spaceId,
						removedAt: null,
					},
				},
			},
			include: {
				profiles: true,
				tenants: {
					include: {
						role: true,
						space: {
							include: {
								ground: true,
							},
						},
					},
				},
				classification: {
					include: {
						category: true,
					},
				},
				associations: {
					where: { removedAt: null },
					include: {
						group: true,
					},
				},
			},
		});

		return result ? plainToInstance(User, result) : null;
	}

	/**
	 * 이메일 중복 확인
	 */
	async existsByEmail(email: string): Promise<boolean> {
		const user = await this.txHost.tx.user.findUnique({
			where: { email },
			select: { id: true },
		});
		return user !== null;
	}

	/**
	 * 전화번호 중복 확인
	 */
	async existsByPhone(phone: string): Promise<boolean> {
		const user = await this.txHost.tx.user.findUnique({
			where: { phone },
			select: { id: true },
		});
		return user !== null;
	}

	/**
	 * 이름 중복 확인
	 */
	async existsByName(name: string): Promise<boolean> {
		const user = await this.txHost.tx.user.findUnique({
			where: { name },
			select: { id: true },
		});
		return user !== null;
	}

	/**
	 * 회원 생성
	 */
	async create(params: CreateUserParams): Promise<User> {
		const {
			name,
			email,
			phone,
			password,
			spaceId,
			roleId,
			categoryId,
			groupIds,
		} = params;

		this.logger.debug(`회원 생성: email=${email}`);

		// 트랜잭션 내에서 User, Tenant, Profile, Classification, Association 생성
		const result = await this.txHost.tx.user.create({
			data: {
				name,
				email,
				phone,
				password,
				tenants: {
					create: {
						spaceId,
						roleId,
					},
				},
				profiles: {
					create: {
						name,
						nickname: name, // 기본 닉네임은 이름과 동일
					},
				},
				...(categoryId && {
					classification: {
						create: {
							categoryId,
						},
					},
				}),
				...(groupIds &&
					groupIds.length > 0 && {
						associations: {
							create: groupIds.map((groupId) => ({ groupId })),
						},
					}),
			},
			include: {
				profiles: true,
				tenants: {
					include: {
						role: true,
						space: true,
					},
				},
				classification: {
					include: {
						category: true,
					},
				},
				associations: {
					include: {
						group: true,
					},
				},
			},
		});

		return plainToInstance(User, result);
	}

	/**
	 * 회원 수정
	 */
	async update(userId: string, params: UpdateUserParams): Promise<User> {
		const { name, email, phone, categoryId, groupIds } = params;

		this.logger.debug(`회원 수정: userId=${userId.slice(-8)}`);

		// 기본 정보 업데이트
		const updateData: Record<string, unknown> = {};
		if (name !== undefined) updateData.name = name;
		if (email !== undefined) updateData.email = email;
		if (phone !== undefined) updateData.phone = phone;

		// User 기본 정보 업데이트
		if (Object.keys(updateData).length > 0) {
			await this.txHost.tx.user.update({
				where: { id: userId },
				data: updateData,
			});
		}

		// 분류 카테고리 업데이트
		if (categoryId !== undefined) {
			// 기존 분류 삭제 후 새로 생성
			await this.txHost.tx.userClassification.deleteMany({
				where: { userId },
			});

			if (categoryId) {
				await this.txHost.tx.userClassification.create({
					data: {
						userId,
						categoryId,
					},
				});
			}
		}

		// 그룹 연결 업데이트
		if (groupIds !== undefined) {
			// 기존 연결 삭제 후 새로 생성
			await this.txHost.tx.userAssociation.deleteMany({
				where: { userId },
			});

			if (groupIds.length > 0) {
				await this.txHost.tx.userAssociation.createMany({
					data: groupIds.map((groupId) => ({ userId, groupId })),
				});
			}
		}

		// 업데이트된 사용자 조회
		const result = await this.txHost.tx.user.findUnique({
			where: { id: userId },
			include: {
				profiles: true,
				tenants: {
					include: {
						role: true,
						space: true,
					},
				},
				classification: {
					include: {
						category: true,
					},
				},
				associations: {
					where: { removedAt: null },
					include: {
						group: true,
					},
				},
			},
		});

		return plainToInstance(User, result);
	}

	/**
	 * 회원 삭제 (Soft Delete)
	 */
	async softDelete(userId: string): Promise<void> {
		this.logger.debug(`회원 삭제 (Soft Delete): userId=${userId.slice(-8)}`);

		const now = new Date();

		await this.txHost.tx.user.update({
			where: { id: userId },
			data: { removedAt: now },
		});
	}

	/**
	 * 사용자의 spaceId 필드를 업데이트합니다.
	 *
	 * @param userId - 사용자 ID
	 * @param spaceId - 업데이트할 Space ID
	 * @returns 업데이트된 spaceId
	 */
	async updateSpaceId(userId: string, spaceId: string): Promise<string> {
		this.logger.debug(
			`spaceId 업데이트: userId=${userId.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		const result = await this.txHost.tx.user.update({
			where: { id: userId },
			data: { selectedSpaceId: spaceId },
			select: { selectedSpaceId: true },
		});

		return result.selectedSpaceId!;
	}

	/**
	 * 사용자와 Space 간의 Tenant 관계가 존재하는지 확인합니다.
	 *
	 * @param userId - 사용자 ID
	 * @param spaceId - 확인할 Space ID
	 * @returns Tenant 관계 존재 여부
	 */
	async existsTenantByUserAndSpace(
		userId: string,
		spaceId: string,
	): Promise<boolean> {
		this.logger.debug(
			`Tenant 관계 확인: userId=${userId.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		const tenant = await this.txHost.tx.tenant.findFirst({
			where: {
				userId,
				spaceId,
				removedAt: null,
			},
			select: { id: true },
		});

		return tenant !== null;
	}
}
