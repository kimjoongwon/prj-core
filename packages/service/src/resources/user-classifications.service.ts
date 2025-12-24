import {
	CreateUserClassificationDto,
	QueryUserClassificationDto,
	UpdateUserClassificationDto,
} from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { UserClassificationsRepository } from "@cocrepo/repository";

@Injectable()
export class UserClassificationsService {
	constructor(private readonly repository: UserClassificationsRepository) {}

	async create(createUserClassificationDto: CreateUserClassificationDto) {
		const userClassification = await this.repository.create({
			data: createUserClassificationDto,
		});

		return userClassification;
	}

	async getManyByQuery(query: QueryUserClassificationDto) {
		const args = query.toArgs<Prisma.UserClassificationFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.UserClassificationCountArgs>();
		const items = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);

		return {
			items,
			count,
		};
	}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	updateById(
		id: string,
		updateUserClassificationDto: UpdateUserClassificationDto,
	) {
		return this.repository.update({
			where: { id },
			data: updateUserClassificationDto,
		});
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
