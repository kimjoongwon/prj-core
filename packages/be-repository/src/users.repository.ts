import { Tenant, User } from "@cocrepo/entity";
import type { IdpAccountListInput } from "@cocrepo/input";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import type { UserStats } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import {
	IDP_ACCOUNT_SELECT,
	flattenIdpAccountRecord,
	type IdpAccountRecord,
} from "./idp-account.select";
import {
	buildIdpAccountQueryOrderBy,
	buildIdpAccountQueryWhere,
	withStatusRelationOrderBy,
} from "./idp-account-query.mapper";
import { toDomainEntity } from "./to-domain-entity";

/** UserStatus 관계를 포함한 조회 결과의 상태 필드를 평평하게 펼칩니다(API 형상 유지). */
function flattenUserStatus(user: Record<string, unknown>) {
	const { status, ...userWithoutStatus } = user;
	return {
		...userWithoutStatus,
		...((status as Record<string, unknown> | null) ?? {}),
	};
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
	 * ID로 조회 (기본 정보만)
	 */
	async findById(id: string): Promise<User | null> {
		this.logger.debug(`공개 ID로 조회: ${id}`);

		const result = await this.txHost.tx.user.findUnique({
			where: { id },
		});

		return result ? toDomainEntity(User, result) : null;
	}

	/**
	 * 내부 숫자 ID로 사용자 조회 (Tenants, Profiles 포함)
	 * 현재 선택 Tenant는 UserStatus 1:1 관계에서 읽어 평평하게 포함합니다(CLS 스냅샷 계약 유지).
	 */
	async findByIdWithTenantsAndProfiles(
		id: string,
	): Promise<(User & { currentTenantSeq: bigint | null }) | null> {
		this.logger.debug(`공개 ID로 사용자 조회: ${id}`);

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
								fitnessCenter: {
									include: {
										company: true,
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
				status: {
					select: { currentTenantSeq: true },
				},
			},
		} as never);

		if (!result) {
			return null;
		}

		// as never 쿼리는 select 결과를 스칼라로만 추론하므로 status는 수동으로 꺼낸다.
		const { status, ...user } = result as unknown as {
			status: { currentTenantSeq: bigint | null } | null;
		} & Record<string, unknown>;
		return toDomainEntity(User, {
			...user,
			currentTenantSeq: status?.currentTenantSeq ?? null,
		}) as User & { currentTenantSeq: bigint | null };
	}

	/**
	 * 인증·OIDC 연동 경계에서 모델 ULID로 사용자와 권한 그래프를 조회합니다.
	 */
	async findByUserIdWithTenantsAndProfiles(
		userSeq: string,
	): Promise<(User & { currentTenantSeq: bigint | null }) | null> {
		this.logger.debug(`사용자 ULID로 조회: ${userSeq}`);

		return this.findByIdWithTenantsAndProfiles(userSeq);
	}

	/**
	 * 이메일로 조회 (id, email, password만 select)
	 */
	async findByEmailSelectCredentials(email: string): Promise<{
		id: string;
		seq: bigint;
		email: string;
		password: string;
	} | null> {
		this.logger.debug(`인증용 이메일 조회: ${email}`);

		return this.txHost.tx.user.findUnique({
			where: { email },
			select: { id: true, seq: true, email: true, password: true },
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

		return result ? toDomainEntity(User, result) : null;
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
								fitnessCenter: {
									include: {
										company: true,
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
		} as never);

		return result ? toDomainEntity(User, result) : null;
	}

	/**
	 * IDP 계정 목록 projection 조회.
	 */
	async findManyIdpAccounts(params: {
		input: IdpAccountListInput;
		spaceIds?: string[];
	}): Promise<{ data: IdpAccountRecord[]; totalCount: number }> {
		this.logger.debug(
			`IDP 계정 목록 조회: spaceIds=${params.spaceIds?.length ?? "all"}개`,
		);

		const where = this.applySpaceScopeToUserWhere(
			buildIdpAccountQueryWhere(params.input, { removedAt: null }),
			params.spaceIds,
		);
		const orderBy = withStatusRelationOrderBy(
			buildIdpAccountQueryOrderBy(params.input),
		);
		const skip = params.input.skip ?? 0;
		const take = params.input.take ?? 20;

		const [data, totalCount] = await Promise.all([
			this.txHost.tx.user.findMany({
				where,
				orderBy,
				skip,
				take,
				select: IDP_ACCOUNT_SELECT,
			}),
			this.txHost.tx.user.count({ where }),
		]);

		return {
			data: data.map(flattenIdpAccountRecord),
			totalCount,
		};
	}

	/**
	 * IDP 계정 상세 projection 조회.
	 */
	async findIdpAccountById(params: {
		userSeq: bigint;
		spaceIds?: string[];
	}): Promise<IdpAccountRecord | null> {
		this.logger.debug(`IDP 계정 조회: ${params.userSeq}`);

		return this.txHost.tx.user
			.findFirst({
				where: this.applySpaceScopeToUserWhere(
					{ seq: params.userSeq, removedAt: null },
					params.spaceIds,
				),
				select: IDP_ACCOUNT_SELECT,
			})
			.then((account) => account && flattenIdpAccountRecord(account));
	}

	/**
	 * IDP 계정 projection 수정. data는 UserStatus 상태 필드만 다룹니다.
	 */
	async updateIdpAccountById(params: {
		userSeq: bigint;
		data: {
			isActive?: boolean;
			failedLoginAttempts?: number;
			lockedUntil?: Date | null;
			isPermanentlyLocked?: boolean;
		};
		spaceIds?: string[];
	}): Promise<IdpAccountRecord | null> {
		this.logger.debug(`IDP 계정 수정: ${params.userSeq}`);

		const account = await this.findIdpAccountById({
			userSeq: params.userSeq,
			spaceIds: params.spaceIds,
		});
		if (!account) {
			return null;
		}

		const updated = await this.txHost.tx.user.update({
			where: { seq: params.userSeq },
			data: {
				status: { upsert: { create: params.data, update: params.data } },
			},
			select: IDP_ACCOUNT_SELECT,
		});

		return flattenIdpAccountRecord(updated);
	}

	/**
	 * 접근 가능한 Space ID 목록으로 회원 목록 조회 (필터링, 페이지네이션 지원)
	 * Prisma 네이티브 타입만 수신합니다.
	 */
	async findManyBySpaceIds(params: {
		where: Prisma.UserWhereInput;
		orderBy: Prisma.UserOrderByWithRelationInput[];
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
					status: true,
					profiles: true,
					tenants: {
						where: {
							removedAt: null,
							...(params.spaceIds
								? { space: { id: { in: params.spaceIds } } }
								: {}),
							...(params.includedRoleNames?.length
								? {
										role: {
											name: { in: params.includedRoleNames },
										},
									}
								: {}),
						},
						include: {
							user: { select: { id: true } },
							role: true,
							space: true,
						},
					},
					classification: {
						include: {
							user: { select: { id: true } },
							category: true,
						},
					},
					associations: {
						where: { removedAt: null },
						include: {
							user: { select: { id: true } },
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
			// API 형상 유지를 위해 UserStatus 관계 필드를 평평하게 펴서 반환합니다.
			users: users.map((user) => toDomainEntity(User, flattenUserStatus(user))),
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
					space: { id: { in: spaceIds } },
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
								space: { id: { in: queryParams.spaceIds } },
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
	 * 조건별 사용자 수 조회.
	 */
	async count(where: Prisma.UserWhereInput): Promise<number> {
		return this.txHost.tx.user.count({ where });
	}

	/**
	 * ID와 접근 가능한 Space ID 범위로 사용자 조회
	 * (Tenants, Profiles, Classification, Associations 포함)
	 *
	 * @param userSeq 조회할 사용자 ULID
	 * @param spaceIds 접근 가능한 Space ULID 목록. undefined면 Space 제한 없음
	 * @returns 범위 안의 사용자 또는 null
	 */
	async findByIdAndSpaceIdsWithRelations(
		userSeq: string,
		spaceIds?: string[],
	): Promise<User | null> {
		this.logger.debug(
			`ID와 Space 범위로 조회: userSeq=${userSeq.slice(-8)}, scope=${spaceIds?.join(",") ?? "all"}`,
		);

		const result = await this.txHost.tx.user.findFirst({
			where: {
				userSeq,
				...(spaceIds
					? {
							tenants: {
								some: {
									space: { id: { in: spaceIds } },
									removedAt: null,
								},
							},
						}
					: {}),
			},
			include: {
				status: true,
				profiles: true,
				tenants: {
					include: {
						user: { select: { id: true } },
						role: true,
						space: {
							include: {
								fitnessCenter: {
									include: {
										company: true,
									},
								},
							},
						},
					},
				},
				classification: {
					include: {
						user: { select: { id: true } },
						category: true,
					},
				},
				associations: {
					where: { removedAt: null },
					include: {
						user: { select: { id: true } },
						group: true,
					},
				},
			},
		} as never);

		return result
			? toDomainEntity(User, flattenUserStatus(result))
			: null;
	}

	/**
	 * 사용자와 현재 Space에 속한 활성 Tenant 상세를 권한 그래프와 함께 조회합니다.
	 */
	async findTenantDetailForUserInSpace(
		userSeq: string,
		tenantId: string,
		spaceSeq: string,
	): Promise<Tenant | null> {
		const result = await this.txHost.tx.tenant.findFirst({
			where: {
				id: tenantId,
				user: { id: userSeq },
				space: { id: spaceSeq },
				removedAt: null,
			},
			include: {
				user: { select: { id: true } },
				space: {
					include: {
						fitnessCenter: {
							include: { company: true },
						},
					},
				},
				role: {
					include: {
						assignments: {
							where: {
								removedAt: null,
								policy: { space: { id: spaceSeq }, removedAt: null },
							},
							orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
							include: {
								policy: {
									include: {
										entries: {
											where: {
												removedAt: null,
												ability: { removedAt: null },
											},
											orderBy: { createdAt: "asc" },
											include: {
												policy: { select: { id: true } },
												ability: {
													include: {
														action: true,
														subject: true,
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
			},
		});

		return result ? toDomainEntity(Tenant, result) : null;
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

		return toDomainEntity(User, result);
	}

	/** 공개 ULID로 사용자의 현재 Tenant 선택값을 UserStatus에 저장합니다. */
	async updateCurrentTenantIdByPublicIds(
		userId: string,
		tenantId: string,
	): Promise<void> {
		this.logger.debug(`현재 Tenant 저장(공개 ID): userId=${userId}`);

		await this.txHost.tx.user.update({
			where: { id: userId },
			data: {
				status: {
					upsert: {
						create: { currentTenant: { connect: { id: tenantId } } },
						update: { currentTenant: { connect: { id: tenantId } } },
					},
				},
			},
		});
	}

	/** 사용자의 현재 Tenant 선택값을 UserStatus에 저장합니다. */
	async updateCurrentTenantId(
		userSeq: bigint,
		currentTenantSeq: bigint | null,
	): Promise<void> {
		this.logger.debug(`현재 Tenant 저장: userSeq=${userSeq.toString()}`);

		await this.txHost.tx.user.update({
			where: { seq: userSeq },
			data: {
				status: {
					upsert: { create: { currentTenantSeq }, update: { currentTenantSeq } },
				},
			},
		});
	}

	/**
	 * 비밀번호 업데이트 (자격 증명은 User에, 잠금 해제는 UserStatus에 함께 반영)
	 */
	async updatePassword(id: string, hashedPassword: string): Promise<void> {
		this.logger.debug(`비밀번호 업데이트: ${id.toString()}`);

		await this.txHost.tx.user.update({
			where: { id: id },
			data: {
				password: hashedPassword,
				passwordChangedAt: new Date(),
				status: {
					upsert: {
						create: {
							failedLoginAttempts: 0,
							lockedUntil: null,
							isPermanentlyLocked: false,
						},
						update: {
							failedLoginAttempts: 0,
							lockedUntil: null,
							isPermanentlyLocked: false,
						},
					},
				},
			},
		});
	}

	/**
	 * 계정 잠금 해제 (UserStatus의 failedLoginAttempts 초기화, lockedUntil null, isPermanentlyLocked false)
	 */
	async unlockAccount(id: string): Promise<void> {
		this.logger.debug(`계정 잠금 해제: ${id.toString()}`);

		await this.txHost.tx.user.update({
			where: { id: id },
			data: {
				status: {
					upsert: {
						create: {
							failedLoginAttempts: 0,
							lockedUntil: null,
							isPermanentlyLocked: false,
						},
						update: {
							failedLoginAttempts: 0,
							lockedUntil: null,
							isPermanentlyLocked: false,
						},
					},
				},
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
		this.logger.debug(`보안 정보 조회: ${id.toString()}`);

		const result = await this.txHost.tx.user.findUnique({
			where: { id: id, removedAt: null },
			select: {
				email: true,
				passwordChangedAt: true,
				status: {
					select: {
						failedLoginAttempts: true,
						lockedUntil: true,
						isPermanentlyLocked: true,
						lastLoginAt: true,
					},
				},
			},
		});

		if (!result) {
			return null;
		}

		return {
			email: result.email,
			passwordChangedAt: result.passwordChangedAt,
			failedLoginAttempts: result.status?.failedLoginAttempts ?? 0,
			lockedUntil: result.status?.lockedUntil ?? null,
			isPermanentlyLocked: result.status?.isPermanentlyLocked ?? false,
			lastLoginAt: result.status?.lastLoginAt ?? null,
		};
	}
}
