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
								ground: true,
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
								ground: true,
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
	 * - Tenants, Profiles, Classification, Associations 포함
	 */
	async findManyBySpaceIdsWithRelations(params: {
		spaceIds: string[];
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
	}): Promise<{ users: User[]; totalCount: number }> {
		const {
			spaceIds,
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

		this.logger.debug(`접근 가능 Space 내 회원 목록 조회: spaceIds=${spaceIds.length}개`);

		// 기본 where 조건 구성
		const where: Record<string, unknown> = {
			tenants: {
				some: {
					spaceId: { in: spaceIds },
					removedAt: null,
				},
			},
		};

		// 상태 필터
		if (status === "removed") {
			where.removedAt = { not: null };
		} else {
			where.removedAt = null;
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
					spaceId: { in: spaceIds },
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
			const dateFilter: Record<string, Date> = {};
			if (createdFrom) {
				dateFilter.gte = createdFrom;
			}
			if (createdTo) {
				dateFilter.lte = createdTo;
			}
			where.createdAt = dateFilter;
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
							spaceId: { in: spaceIds },
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
	 * 접근 가능한 Space ID 목록으로 회원 통계 조회
	 */
	async countStatsBySpaceIds(spaceIds: string[]): Promise<UserStats> {
		this.logger.debug(`접근 가능 Space 내 회원 통계 조회: spaceIds=${spaceIds.length}개`);

		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);

		const baseWhere = {
			tenants: {
				some: {
					spaceId: { in: spaceIds },
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
	 * 소프트 삭제
	 */
	async removeById(id: string): Promise<User> {
		this.logger.debug(`소프트 삭제 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.user.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return plainToInstance(User, result);
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
