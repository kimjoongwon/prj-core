import { QueryUserDto } from "@cocrepo/dto";
import { User } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { UsersRepository } from "@cocrepo/repository";
import { Injectable } from "@nestjs/common";

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

	/**
	 * Entity를 받아서 사용자 생성
	 */
	async create(user: User): Promise<User> {
		// 비즈니스 로직 추가 가능 (예: 이메일 중복 검증, 비밀번호 암호화 등)
		return this.repository.create(user);
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

	/**
	 * Partial<Entity>를 받아서 사용자 업데이트
	 */
	updateById(id: string, userUpdate: Partial<User>): Promise<User> {
		// 비즈니스 로직 추가 가능 (예: 권한 검증 등)
		return this.repository.update(id, userUpdate);
	}

	removeById(id: string) {
		return this.repository.updateWithArgs({
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
		return user;
	}

	/**
	 * 인증용 유저 조회 (이메일 기반)
	 */
	findUserForAuth(email: string) {
		console.log("email", email);
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
