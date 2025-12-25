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
	 * ID로 사용자 조회 (Tenant, Profile 정보 포함)
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
							},
						},
						space: true,
					},
				},
				profiles: true,
			},
		});

		return result ? plainToInstance(User, result) : null;
	}

	/**
	 * 이메일로 사용자 조회 (Tenant, Profile 정보 포함)
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
							},
						},
						space: true,
					},
				},
				profiles: true,
			},
		});

		return result ? plainToInstance(User, result) : null;
	}
}
