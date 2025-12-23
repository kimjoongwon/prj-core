import {
	CreateRoleClassificationDto,
	QueryRoleClassificationDto,
	UpdateRoleClassificationDto,
} from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { RoleClassificationsRepository } from "../../repository/role-classifications.repository";

@Injectable()
export class RoleClassificationsService {
	constructor(private readonly repository: RoleClassificationsRepository) {}

	async create(createRoleClassificationDto: CreateRoleClassificationDto) {
		const roleClassification = await this.repository.create({
			data: createRoleClassificationDto,
		});

		return roleClassification;
	}

	async getManyByQuery(query: QueryRoleClassificationDto) {
		const args = query.toArgs<Prisma.RoleClassificationFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.RoleClassificationCountArgs>();
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
		updateRoleClassificationDto: UpdateRoleClassificationDto,
	) {
		return this.repository.update({
			where: { id },
			data: updateRoleClassificationDto,
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
