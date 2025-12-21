import { CreateGroupDto, QueryGroupDto, UpdateGroupDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { GroupsRepository } from "../../repository/groups.repository";

@Injectable()
export class GroupsService {
	constructor(private readonly repository: GroupsRepository) {}
	create(createGroupDto: CreateGroupDto) {
		return this.repository.create({ data: createGroupDto });
	}

	async getManyByQuery(query: QueryGroupDto) {
		const args = query.toArgs<Prisma.GroupFindManyArgs>({
			orderBy: {
				createdAt: "desc",
			},
		});

		const countArgs = query.toCountArgs<Prisma.GroupCountArgs>();
		const groups = await this.repository.findMany(args);
		const totalCount = await this.repository.count(countArgs);
		return {
			totalCount,
			groups,
		};
	}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	updateById(id: string, updateDto: UpdateGroupDto) {
		return this.repository.update({
			where: { id },
			data: updateDto,
		});
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}
}
