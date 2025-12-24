import { CreateSpaceDto, QuerySpaceDto, UpdateSpaceDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { SpacesRepository } from "@cocrepo/repository";

@Injectable()
export class SpacesService {
	constructor(private readonly repository: SpacesRepository) {}

	async create(createSpaceDto: CreateSpaceDto) {
		const space = await this.repository.create({
			data: {
				...createSpaceDto,
			},
		});

		return space;
	}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	updateById(id: string, updateSpaceDto: UpdateSpaceDto) {
		return this.repository.update({
			where: { id },
			data: updateSpaceDto,
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

	async getManyByQuery(query: QuerySpaceDto) {
		const args = query.toArgs(query);
		const spaceCount = await this.repository.count(args);
		const spaces = await this.repository.findMany(args);
		return {
			count: spaceCount,
			spaces,
		};
	}
}
