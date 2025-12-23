import {
	CreateSpaceClassificationDto,
	QuerySpaceClassificationDto,
	UpdateSpaceClassificationDto,
} from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { SpaceClassificationsRepository } from "../../repository/space-classifications.repository";

@Injectable()
export class SpaceClassificationsService {
	constructor(private readonly repository: SpaceClassificationsRepository) {}

	async create(createSpaceClassificationDto: CreateSpaceClassificationDto) {
		const spaceClassification = await this.repository.create({
			data: createSpaceClassificationDto,
		});

		return spaceClassification;
	}

	async getManyByQuery(query: QuerySpaceClassificationDto) {
		const args = query.toArgs<Prisma.SpaceClassificationFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.SpaceClassificationCountArgs>();
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
		updateSpaceClassificationDto: UpdateSpaceClassificationDto,
	) {
		return this.repository.update({
			where: { id },
			data: updateSpaceClassificationDto,
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
