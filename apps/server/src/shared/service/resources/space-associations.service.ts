import {
	CreateSpaceAssociationDto,
	QuerySpaceAssociationDto,
	UpdateSpaceAssociationDto,
} from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { SpaceAssociationsRepository } from "../../repository/space-associations.repository";

@Injectable()
export class SpaceAssociationsService {
	constructor(private readonly repository: SpaceAssociationsRepository) {}

	create(createSpaceAssociationDto: CreateSpaceAssociationDto) {
		return this.repository.create({
			data: createSpaceAssociationDto,
		});
	}

	async getManyByQuery(query: QuerySpaceAssociationDto) {
		const include = {
			group: true,
		};
		const args = query.toArgs({ include });
		const countArgs = query.toCountArgs<Prisma.SpaceAssociationCountArgs>();
		const spaceAssociations = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);
		return {
			spaceAssociations,
			count,
		};
	}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	updateById(id: string, updateSpaceAssociationDto: UpdateSpaceAssociationDto) {
		return this.repository.update({
			where: { id },
			data: updateSpaceAssociationDto,
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
