import { User } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import type { UserStats } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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
	 * ID로 조회 (기본 정보만)
	 */
	async findById(id: string): Promise<User | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.user.findUnique({
			where: { id },
		});

		return result ? plainToInstance(User, result) : null;
	}

	/**
	 * ID로 사용자 조회 (Tenants, Profiles 포함)
	 */
	async findByIdWithTenantsAndProfiles(id: string): Promise<User | null> {
		this.logger.debug(`ID로 사용자 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.user.findUnique({
			where: { id },
			include: {
				tenants: {
					orderBy: {
						createdAt: "asc",
					},
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
								associations: {
									include: { group: true },
								},
							},
						},
						space: {
							include: {
								company: {
									include: {
										grounds: {
											where: { removedAt: null },
											orderBy: { createdAt: "asc" },
										},
									},
								},
								classification: {
									include: {
										category: {
											include: {
												parent: true,
												children: true,
											},
										},
									},
								},
							},
						},
					},
				},
				profiles: true,
				classification: {
					include: { category: true },
				},
				associations: {
					include: { group: true },
				},
			},
		});

		return result ? plainToInstance(User, result) : null;
	}

	/**
	 * 이메일로 조회 (id, email, password만 select)
	 */
	async findByEmailSelectCredentials(
		email: string,
	): Promise<{ id: string; email: string; password: string } | null> {
		this.logger.debug(`인증용 이메일 조회: ${email}`);

		return this.txHost.tx.user.findUnique({
			where: { email },
			select: { id: true, email: true, password: true },
		});
	}

	/**
	 * 이메일로 조회 (기본 정보만)
	 */
	async findByEmail(email: string): Promise<User | null> {
		this.logger.debug(`이메일로 조회: ${email}`);

		const result = await this.txHost.tx.user.findUnique({
			where: { email },
		});

		return result ? plainToInstance(User, result) : null;
	}

	/**
	 * 이메일로 사용자 조회 (Tenants, Profiles 포함)
	 */
	async findByEmailWithTenantsAndProfiles(email: string): Promise<User | null> {
		this.logger.debug(`이메일로 사용자 조회: ${email}`);

		const result = await this.txHost.tx.user.findUnique({
			where: { email },
			include: {
				tenants: {
					orderBy: {
						createdAt: "asc",
					},
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
								associations: {
									include: { group: true },
								},
							},
						},
						space: {
							include: {
									company: {
										include: {
											grounds: {
												where: { removedAt: null },
												orderBy: { createdAt: "asc" },
											},
										},
									},
								classification: {
									include: {
										category: {
											include: {
												parent: true,
												children: true,
											},
										},
									},
								},
							},
						},
					},
				},
				profiles: true,
				classification: {
					include: { category: true },
				},
				associations: {
					include: { group: true },
				},
			},
		});

		return result ? plainToInstance(User, result) : null;
	}

	/**
	 * 접근 가능한 Space ID 목록으로 회원 목록 조회 (필터링, 페이지네이션 지원)
	 * Prisma 네이티브 타입만 수신합니다.
	 */
	async findManyBySpaceIds(params: {
		where: Prisma.UserWhereInput;
		orderBy: Record<string, "asc" | "desc">[];
		skip: number;
		take: number;
		spaceIds?: string[];
		includedRoleNames?: string[];
	}): Promise<{ users: User[]; totalCount: number }> {
		this.logger.debug(
			`접근 가능 Space 내 회원 목록 조회: spaceIds=${params.spaceIds?.length ?? "all"}개, includedRoles=${params.includedRoleNames?.join(",") ?? "없음"}`,
		);

		const scopedWhere = this.applySpaceScopeToUserWhere(
			params.where,
			params.spaceIds,
		);

		const [users, totalCount] = await Promise.all([
			this.txHost.tx.user.findMany({
				where: scopedWhere,
				include: {
					profiles: true,
					tenants: {
						where: {
							removedAt: null,
							...(params.spaceIds ? { spaceId: { in: params.spaceIds } } : {}),
							...(params.includedRoleNames?.length
								? {
										role: {
											name: { in: params.includedRoleNames },
										},
									}
								: {}),
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
				orderBy: params.orderBy,
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.user.count({ where: scopedWhere }),
		]);

		return {
			users: users.map((user) => plainToInstance(User, user)),
			totalCount,
		};
	}

	private applySpaceScopeToUserWhere(
		where: Prisma.UserWhereInput,
		spaceIds?: string[],
	): Prisma.UserWhereInput {
		if (spaceIds === undefined) {
			return where;
		}

		const tenantsFilter = where.tenants as
			| Prisma.TenantListRelationFilter
			| undefined;
		const existingSome =
			tenantsFilter?.some && typeof tenantsFilter.some === "object"
				? tenantsFilter.some
				: {};

		return {
			...where,
			tenants: {
				...(tenantsFilter ?? {}),
				some: {
					...existingSome,
					spaceId: { in: spaceIds },
					removedAt: null,
				},
			},
		};
	}

	/**
	 * 접근 가능한 Space ID 목록으로 회원 통계 조회
	 */
	async countStatsBySpaceIds(params?: {
		spaceIds?: string[];
	}): Promise<UserStats> {
		const queryParams = params ?? {};
		this.logger.debug(
			`접근 가능 Space 내 회원 통계 조회: spaceIds=${queryParams.spaceIds?.length ?? "all"}개`,
		);

		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);

		const baseWhere = {
			removedAt: null,
			...(queryParams.spaceIds
				? {
						tenants: {
							some: {
								spaceId: { in: queryParams.spaceIds },
								removedAt: null,
							},
						},
					}
				: {}),
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
		// 임시로 70% 활성으로 처리
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
	 * ID와 Space ID로 사용자 조회 (Tenants, Profiles, Classification, Associations 포함)
	 */
	async findByIdAndSpaceIdWithRelations(
		userId: string,
		spaceId: string,
	): Promise<User | null> {
		this.logger.debug(
			`ID와 Space ID로 조회: userId=${userId.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
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
									company: {
										include: {
											grounds: {
												where: { removedAt: null },
												orderBy: { createdAt: "asc" },
											},
										},
									},
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
	 * 생성
	 */
	async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
		this.logger.debug("생성 중...");

		const result = await this.txHost.tx.user.create({
			data,
		});

		return plainToInstance(User, result);
	}

	/**
	 * 관계 포함 생성 (Tenants, Profiles, Classification, Associations)
	 */
	async createWithRelations(data: Prisma.UserCreateInput): Promise<User> {
		this.logger.debug("관계 포함 생성 중...");

		const result = await this.txHost.tx.user.create({
			data,
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
	 * 업데이트
	 */
	async updateById(
		id: string,
		data: Prisma.UserUncheckedUpdateInput,
	): Promise<User> {
		this.logger.debug(`업데이트 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.user.update({
			where: { id },
			data,
		});

		return plainToInstance(User, result);
	}

	/**
	 * 관계 포함 업데이트 (Classification, Associations)
	 */
	async updateByIdWithRelations(
		userId: string,
		data: Prisma.UserUncheckedUpdateInput,
		options?: {
			categoryId?: string | null;
			groupIds?: string[];
		},
	): Promise<User> {
		this.logger.debug(`관계 포함 업데이트: userId=${userId.slice(-8)}`);

		// 기본 정보 업데이트
		if (Object.keys(data).length > 0) {
			await this.txHost.tx.user.update({
				where: { id: userId },
				data,
			});
		}

		// 분류 카테고리 업데이트
		if (options?.categoryId !== undefined) {
			await this.txHost.tx.userClassification.deleteMany({
				where: { userId },
			});

			if (options.categoryId) {
				await this.txHost.tx.userClassification.create({
					data: {
						userId,
						categoryId: options.categoryId,
					},
				});
			}
		}

		// 그룹 연결 업데이트
		if (options?.groupIds !== undefined) {
			await this.txHost.tx.userAssociation.deleteMany({
				where: { userId },
			});

			if (options.groupIds.length > 0) {
				await this.txHost.tx.userAssociation.createMany({
					data: options.groupIds.map((groupId) => ({ userId, groupId })),
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
	 * 비밀번호 업데이트 (관련 필드 함께)
	 */
	async updatePassword(id: string, hashedPassword: string): Promise<void> {
		this.logger.debug(`비밀번호 업데이트: ${id.slice(-8)}`);

		await this.txHost.tx.user.update({
			where: { id },
			data: {
				password: hashedPassword,
				passwordChangedAt: new Date(),
				mustChangePassword: false,
				failedLoginAttempts: 0,
				lockedUntil: null,
				isPermanentlyLocked: false,
			},
		});
	}

	/**
	 * 계정 잠금 해제 (failedLoginAttempts 초기화, lockedUntil null, isPermanentlyLocked false)
	 */
	async unlockAccount(id: string): Promise<void> {
		this.logger.debug(`계정 잠금 해제: ${id.slice(-8)}`);

		await this.txHost.tx.user.update({
			where: { id },
			data: {
				failedLoginAttempts: 0,
				lockedUntil: null,
				isPermanentlyLocked: false,
			},
		});
	}

	/**
	 * 사용자 보안 정보 조회 (잠금 상태, 로그인 시도 횟수 등)
	 */
	async findSecurityInfoById(id: string): Promise<{
		failedLoginAttempts: number;
		lockedUntil: Date | null;
		isPermanentlyLocked: boolean;
		passwordChangedAt: Date | null;
		lastLoginAt: Date | null;
		email: string;
	} | null> {
		this.logger.debug(`보안 정보 조회: ${id.slice(-8)}`);

		return this.txHost.tx.user.findUnique({
			where: { id, removedAt: null },
			select: {
				failedLoginAttempts: true,
				lockedUntil: true,
				isPermanentlyLocked: true,
				passwordChangedAt: true,
				lastLoginAt: true,
				email: true,
			},
		});
	}

	/**
	 * 물리 삭제
	 */
	async deleteById(id: string): Promise<User> {
		this.logger.debug(`삭제 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.user.delete({
			where: { id },
		});

		return plainToInstance(User, result);
	}
}
