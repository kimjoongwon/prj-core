import { User } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
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
	 * 사용자의 spaceId 필드를 업데이트합니다.
	 *
	 * @param userId - 사용자 ID
	 * @param spaceId - 업데이트할 Space ID
	 * @returns 업데이트된 spaceId
	 */
	async updateSpaceId(
		userId: string,
		spaceId: string,
	): Promise<string> {
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
	async existsTenantByUserAndSpace(userId: string, spaceId: string): Promise<boolean> {
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
