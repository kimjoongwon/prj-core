import { CreateRoleDto, UpdateRoleDto } from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { RolesRepository } from "@cocrepo/repository";

@Injectable()
export class RolesService {
	constructor(private readonly repository: RolesRepository) {}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	create(createRoleDto: CreateRoleDto) {
		return this.repository.create({
			data: {
				name: createRoleDto.name,
			},
		});
	}

	async getManyByQuery(args: any) {
		const roles = await this.repository.findMany(args);
		const count = await this.repository.count(args as Prisma.RoleCountArgs);
		return {
			roles,
			count,
		};
	}

	updateById(id: string, updateRoleDto: UpdateRoleDto) {
		return this.repository.update({
			where: { id },
			data: updateRoleDto,
		});
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
