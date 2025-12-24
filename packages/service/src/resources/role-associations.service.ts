import {
	CreateRoleAssociationDto,
	QueryRoleAssociationDto,
	UpdateRoleAssociationDto,
} from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { RoleAssociationsRepository } from "@cocrepo/repository";

@Injectable()
export class RoleAssociationsService {
	constructor(private readonly repository: RoleAssociationsRepository) {}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	create(createRoleAssociationDto: CreateRoleAssociationDto) {
		return this.repository.create({
			data: createRoleAssociationDto,
		});
	}

	async getManyByQuery(query: QueryRoleAssociationDto) {
		const include = {
			group: true,
		};
		const args = query.toArgs({ include });
		const countArgs = query.toCountArgs<Prisma.RoleAssociationCountArgs>();
		const roleAssociations = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);
		return {
			roleAssociations,
			count,
		};
	}

	updateById(id: string, data: UpdateRoleAssociationDto) {
		return this.repository.update({ where: { id }, data });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
