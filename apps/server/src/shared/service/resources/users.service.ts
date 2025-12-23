import { QueryUserDto } from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repository/users.repository";

@Injectable()
export class UsersService {
	constructor(private readonly repository: UsersRepository) {}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	removeMany(ids: string[]) {
		return this.repository.updateMany({
			where: { id: { in: ids } },
			data: { removedAt: new Date() },
		});
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	create(args: any) {
		return this.repository.create(args);
	}

	async getManyByQuery(query: QueryUserDto) {
		const users = await this.repository.findMany({
			...query.toArgs<Prisma.UserFindManyArgs>(),
			include: {
				tenants: {
					include: {
						role: true,
					},
				},
				profiles: true,
			},
		});

		const count = await this.repository.count(
			query.toCountArgs<Prisma.UserCountArgs>(),
		);

		return { users, count };
	}

	updateById(id: string, data: Prisma.UserUpdateInput) {
		return this.repository.update({ where: { id }, data });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}

	async getByIdWithTenants(id: string) {
		const user = await this.repository.findUnique({
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
		return user as any;
	}

	getByEmail(email: string) {
		return this.repository.findUnique({
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
	}

	async getUserWithMainTenant(userId: string) {
		return this.repository.findUnique({
			where: { id: userId },
			include: {
				tenants: {
					where: { main: true },
					include: {
						space: {
							include: {
								ground: true,
							},
						},
						role: true,
					},
				},
				profiles: true,
			},
		});
	}
}
