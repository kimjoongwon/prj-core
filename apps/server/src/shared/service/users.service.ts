import { Injectable } from "@nestjs/common";
import { Prisma, QueryUserDto } from "@shared/schema";
import { UsersRepository } from "../repository/users.repository";

@Injectable()
export class UsersService {
	constructor(private readonly repository: UsersRepository) {}

	getUnique(args: Prisma.UserFindUniqueArgs) {
		return this.repository.findUnique(args);
	}

	getFirst(args: Prisma.UserFindFirstArgs) {
		return this.repository.findFirst(args);
	}

	removeMany(ids: string[]) {
		return this.repository.updateMany({
			where: { id: { in: ids } },
			data: { removedAt: new Date() },
		});
	}

	delete(args: Prisma.UserDeleteArgs) {
		return this.repository.delete(args);
	}

	create(args: Prisma.UserCreateArgs) {
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

	update(args: Prisma.UserUpdateArgs) {
		return this.repository.update(args);
	}

	remove(id: string) {
		return this.update({ where: { id }, data: { removedAt: new Date() } });
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
